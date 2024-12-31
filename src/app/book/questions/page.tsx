"use client";
import Loading from "@/components/Loading";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import BookShortcut from "@/components/Bookshortcut";

export default function Questions() {
    const [user, setUser] = useState<userType | null>(null); // User state
    const [questions, setQuestions] = useState<bookType[]>([]);
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
                    console.error("Failed to fetch user data");
                    throw new Error("Unauthorized");
                }

                const check = await response.json();
                setUser(check);
                fetchQuestions(check._id, tokenTemp, currentPage); // Fetch questions after user data is loaded
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

    async function fetchQuestions(userId: string, token: string, page: number) {
        try {
            const fetchQuestion = await fetch(`/api/book/get/questions?page=${page}&limit=2`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const questionsFetch = await fetchQuestion.json();
            if (questionsFetch.books.length > 0 && page !== 1) {
                setQuestions((prevQuestions) => [...prevQuestions, ...questionsFetch.books]);
            } else if (page === 1) {
                setQuestions(questionsFetch.books);
            } else {
                setHasMore(false); // No more questions to load
            }
        } catch (error) {
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (inView) {
            const loadMoreQuestions = async () => {
                if (hasMore && !loading) {
                    try {
                        const tokenTemp = await refreshAccessToken();
                        if (!tokenTemp) {
                            console.warn("No token available");
                            return;
                        }
                        await fetchQuestions(user?._id || "", tokenTemp, currentPage + 1); // Increment page here
                        setCurrentPage((prevPage) => prevPage + 1); // Update page number
                    } catch (error) {
                        console.error("Error loading more questions:", error);
                    }
                }
            };

            loadMoreQuestions();
        }
    }, [inView, hasMore, loading, user?._id]);

    // Fallback while loading user
    if (user === null || loading) {
        return <Loading />;
    }

    return (
        <div>
        <div className="container py-3">
                {questions.length > 0 ? (
                    <div className="row">
                        {questions.map((question) => (
                            <div key={question._id} className="col-md-4 col-sm-6">
                                <BookShortcut key={question._id} book={question} refreshAccessToken={refreshAccessToken} />
                            </div>
                        ))}
                        {loading && <Loading />}
                    </div>
                ) : (
                    <p>No publish to display.</p>
                )}
        </div>
        <div ref={ref} />
    </div>
    );
}
