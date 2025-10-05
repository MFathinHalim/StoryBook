"use client";
import Loading from "@/components/Loading";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import BookShortcut from "@/components/Bookshortcut";

export default function books() {
    const [user, setUser] = useState<userType | null>(null); // User state
    const [books, setbooks] = useState<bookType[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1); // Untuk mengelola halaman
    const [hasMore, setHasMore] = useState(true); // Untuk mengetahui jika masih ada pertanyaan untuk dimuat
    const { ref, inView } = useInView();

    const refreshAccessToken = async () => {
        try {
            if (sessionStorage.getItem("token")) {
                return sessionStorage.getItem("token");
            }

            const response = await fetch("/api/user/refreshToken", {
                method: "POST",
                credentials: "include", // Ensure cookies are sent
            });

            if (!response.ok) {
                return (window.location.href = "/login");
            }

            const data = await response.json();
            if (!data.token) window.location.href = "/login";
            sessionStorage.setItem("token", data.token);
            return data.token;
        } catch (error) {
            console.error("Error refreshing access token:", error);
            return null;
        }
    };

    useEffect(() => {
        async function fetchUserData() {
            try {
                const tokenTemp = await refreshAccessToken();
                if (!tokenTemp) {
                    console.warn("No token available");
                    return;
                }

                const response = await fetch(`/api/user/check`, {
                    method: "POST",
                    headers: { Authorization: `Bearer ${tokenTemp}` },
                });

                if (!response.ok) {
                    window.location.href = "/";
                }

                const check = await response.json();
                setUser(check);
                fetchbooks(check._id, tokenTemp, currentPage); // Fetch books after user data is loaded
            } catch (error) {
                console.error("Error fetching user data:", error);
                setUser(null);
            }
        }

        // Only fetch data if user is null
        if (user === null) {
            fetchUserData();
        }
    }, [user, currentPage]);

    async function fetchbooks(userId: string, token: string, page: number) {
        try {
            const fetchQuestion = await fetch(`/api/book/get/questions?page=${page}&limit=10`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const booksFetch = await fetchQuestion.json();
            if (booksFetch.books.length > 0 && page !== 1) {
                setbooks((prevbooks) => [...prevbooks, ...booksFetch.books]);
            } else if (page === 1) {
                setbooks(booksFetch.books);
            } else {
                setHasMore(false); // No more books to load
            }
        } catch (error) {
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (inView) {
            const loadMorebooks = async () => {
                if (hasMore && !loading) {
                    try {
                        const tokenTemp = await refreshAccessToken();
                        if (!tokenTemp) {
                            console.warn("No token available");
                            return;
                        }
                        await fetchbooks(user?._id || "", tokenTemp, currentPage + 1); // Increment page here
                        setCurrentPage((prevPage) => prevPage + 1); // Update page number
                    } catch (error) {
                        console.error("Error loading more books:", error);
                    }
                }
            };

            loadMorebooks();
        }
    }, [inView, hasMore, loading, user?._id]);

    // Fallback while loading user
    if (user === null || loading) {
        return <Loading />;
    }

    return (
        <div>
            <div className='container py-3'>
                <div>
                    <h3 className='fw-bold mb-4'>Explore Questions</h3>
                    {books.length > 0 ? (
                        <div className='row row-cols-1 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 g-2'>
                            {books.map((book) => (
                                <div key={book._id}>
                                    <BookShortcut book={book} refreshAccessToken={refreshAccessToken} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className='text-muted text-center mt-5'>You haven’t written any stories yet.</p>
                    )}
                </div>
            </div>
            <div ref={ref} />
        </div>
    );
}
