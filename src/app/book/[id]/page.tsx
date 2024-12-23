"use client";

import { useState, useEffect } from "react";
import BookShortcut from "@/components/Bookshortcut";
import Loading from "@/components/Loading";

export default function Homepage() {
    const [user, setUser] = useState<userType | null>(null); // User state
    const [books, setBooks] = useState<bookType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

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
                return window.location.href = "/login";
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

    const fetchBooks = async (page = 1) => {
        try {
            const token = await refreshAccessToken();
            if (!token) throw new Error("Unable to retrieve access token");

            // Fetch books
            const response = await fetch(`/api/book/get/userId/${user?._id}?page=${page}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) throw new Error("Failed to fetch books");

            const data = await response.json();
            if (page === 1) {
                setBooks(data.books);
            } else {
                setBooks((prevBooks) => [...prevBooks, ...data.books]);
            }
        } catch (error) {
            console.error("Error fetching books:", error);
        } finally {
            setLoading(false);
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

                if (check._id && check._id !== "system") {
                    fetchBooks(1); // Fetch books on user load
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
                setUser(null);
            }
        }

        if (user === null) {
            fetchUserData();
        }
    }, [user]);

    // Infinite scroll logic
    const handleScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
        const bottom = e.currentTarget.scrollHeight === e.currentTarget.scrollTop + e.currentTarget.clientHeight;
        if (bottom) {
            setCurrentPage((prevPage) => {
                const nextPage = prevPage + 1;
                fetchBooks(nextPage); // Load next page of books
                return nextPage;
            });
        }
    };

    // Fallback while loading user
    if (user === null || loading) {
        return <Loading />;
    }

    if (error) return <p className="text-red-500">Error: {error}</p>;

    return (
        <>
            <div className="container py-3">
                <div className="text-center">
                    <div style={{ position: 'relative' }}>
                        <img
                            className="pfp-home"
                            src={user?.pp || ''}
                            alt={`profile picture from ${user.username}`}
                            style={{
                                position: 'absolute',
                                zIndex: 1,
                            }}
                        />
                        <img
                            className="pfp-home-blur"
                            src={user?.pp || ''}
                            alt={`profile picture from ${user.username}`}
                        />
                    </div>
                    <h1 className="mt-3 mb-0">{user?.name || user?.username}</h1>
                    <p className="secondary-text">{user?.desc || "No Description"}</p>
                    <div className="d-flex gap-2 justify-content-center">
                        <a href="/book/add" className="btn primary-btn">Have some idea?</a>
                        <a href="/edit" className="btn secondary-btn">Edit Profile</a>
                    </div>
                </div>
                <div className="mt-5 d-flex flex-column align-items-center w-100">
                    <h3 className="button-container text-left">Recent Stories</h3>
                    {books.length > 0 ? (
                        <div onScroll={handleScroll} style={{ maxHeight: '80vh', overflowY: 'auto' }}>
                            {books.map((book, index) => (
                                <BookShortcut key={book._id} book={book} refreshAccessToken={refreshAccessToken} />
                            ))}
                            {/* A simple loading indication at the bottom */}
                            {loading && <Loading />}
                        </div>
                    ) : (
                        <p>No books to display.</p>
                    )}
                </div>
            </div>
        </>
    );
}
