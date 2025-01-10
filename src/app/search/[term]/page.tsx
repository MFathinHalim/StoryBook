"use client";
import BookShortcut from "@/components/Bookshortcut";
import Loading from "@/components/Loading";
import { useEffect, useState } from "react";
import { useParams } from 'next/navigation';
import { useInView } from "react-intersection-observer";

export default function Homepage() {
    const [user, setUser] = useState<userType | null>(null); // User state
    const [books, setBooks] = useState<bookType[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1); // Untuk mengelola halaman
    const [hasMore, setHasMore] = useState(true); // Untuk mengetahui jika masih ada buku untuk dimuat
    const { ref, inView } = useInView();
    const params = useParams();
    const searchTerm = params.term;

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
                    console.error("Failed to fetch user data");
                    throw new Error("Unauthorized");
                }

                const check = await response.json();
                setUser(check);
                fetchBooks(check._id, tokenTemp, currentPage); // Fetch books after user data is loaded
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

    async function fetchBooks(userId: string, token: string, page: number) {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const tagParam = urlParams.get('tag') ? `?tag=${urlParams.get('tag')}` : '';
            const fetchBook = await fetch(`/api/book/search/${searchTerm}${tagParam}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!fetchBook.ok) {
                console.error("Error Fetching Books");
                throw new Error("Error fetching books");
            }
            const booksFetch = await fetchBook.json();
            if (booksFetch.books.length > 0 && page !== 1) {
                setBooks((prevBooks) => [...prevBooks, ...booksFetch.books]);
            } else if (page === 1) {
                setBooks(booksFetch.books);
            } else {
                setHasMore(false); // No more books to load
            }
        } catch (error) {
            console.error("Error fetching books:", error);
        } finally {
            setLoading(false);
        }
    }

   useEffect(() => {
    if (inView) {
        const loadMoreBooks = async () => {
            if (hasMore && !loading) {
                try {
                    const tokenTemp = await refreshAccessToken();
                    if (!tokenTemp) {
                        console.warn("No token available");
                        return;
                    }
                    await fetchBooks(user?._id || "", tokenTemp, currentPage + 1); // Increment page here
                    setCurrentPage((prevPage) => prevPage + 1); // Update page number
                } catch (error) {
                    console.error("Error loading more books:", error);
                }
            }
        };

        loadMoreBooks();
    }
}, []);


    // Fallback while loading user
    if (user === null || loading) {
        return <Loading />;
    }

    return (
        <div>
            <div className='px-3 py-3'>

                    {books.length > 0 ? (
                        <div className="row">
                            {books.map((book, index) => (
                                <div key={book._id || index} className="col-md-3 col-sm-6">
                                <BookShortcut key={book._id || index} book={book} refreshAccessToken={refreshAccessToken} />
                            </div>
                            ))}
                            {loading && <Loading />}
                        </div>
                    ) : (
                        <p>No books to display.</p>
                    )}
            </div>
                    <div ref={ref} />

        </div>
    );
}