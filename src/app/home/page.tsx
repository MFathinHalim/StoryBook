"use client";
import BookShortcut from "@/components/Bookshortcut";
import Loading from "@/components/Loading";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

export default function Homepage() {
    const [user, setUser] = useState<userType | null>(null);
    const [books, setBooks] = useState<bookType[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const { ref, inView } = useInView();

    const handleLogout = async () => {
        try {
            const response = await fetch("/api/user/logout", { method: "DELETE" });
            if (response.ok) {
                sessionStorage.clear();
                window.location.href = "/login";
            }
        } catch {}
    };

    const refreshAccessToken = async () => {
        try {
            const existing = sessionStorage.getItem("token");
            if (existing) return existing;

            const response = await fetch("/api/user/refreshToken", {
                method: "POST",
                credentials: "include",
            });

            if (!response.ok) return handleLogout();

            const data = await response.json();
            if (!data.token) return handleLogout();
            sessionStorage.setItem("token", data.token);
            return data.token;
        } catch {
            handleLogout();
            return null;
        }
    };

    async function fetchBooks(userId: string, token: string, page: number) {
        try {
            const res = await fetch(`/api/book/get/userId/${userId}?page=${page}&limit=9`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();

            if (data.books.length > 0) {
                setBooks((prev) => (page === 1 ? data.books : [...prev, ...data.books]));
            } else {
                setHasMore(false);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        async function load() {
            const token = await refreshAccessToken();
            if (!token) return;
            const userRes = await fetch(`/api/user/check`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
            });

            const userData = await userRes.json();
            setUser(userData);
            fetchBooks(userData._id, token, currentPage);
        }

        if (!user) load();
    }, [user]);

    useEffect(() => {
        if (inView && hasMore && !loading && user?._id) {
            const loadMore = async () => {
                const token = await refreshAccessToken();
                await fetchBooks(user._id, token!, currentPage + 1);
                setCurrentPage((p) => p + 1);
            };
            loadMore();
        }
    }, [inView]);

    if (user === null || loading) return <Loading />;

    return (
        <div className='container mt-4 py-3'>
            {/* Profile Section */}

            <section className='text-center mb-5'>
                <a href={`/profile/${user.username}`}>
                    <img src={user?.pp || ""} alt={user.username} className='rounded-circle' style={{ width: "140px", height: "140px", objectFit: "cover" }} />
                </a>
                <h2 className='fw-bold my-2'>Hi, {user.username ? user.username.charAt(0).toUpperCase() + user.username.slice(1) : "Writer"}</h2>
                <p className='text-muted mb-4'>Your personal library of stories and imagination.</p>
                <a href='/create' className='btn btn-primary rounded-pill px-4 shadow-sm'>
                    Create New Story
                </a>
            </section>

            {/* Book Section */}
            <div className='mt-5'>
                <h3 className='fw-bold mb-4'>📚 Your Stories</h3>
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

            <div ref={ref} className='my-4 text-center'>
                {hasMore && loading && <Loading />}
            </div>
        </div>
    );
}
