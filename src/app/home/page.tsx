"use client";
import { useEffect, useState } from "react";

export default function Homepage() {
    const [user, setUser] = useState<userType | null>(null); // User state
    const [books, setBooks] = useState<bookType[]>([]);

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
                return window.location.href = "/login"
            }

            const data = await response.json();
            if(!data.token) window.location.href = "/login"
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

                if (check._id && check._id !== "system") {
                    const fetchBook = await fetch(`/api/book/get/userId/${check._id}`, {
                        headers: { Authorization: `Bearer ${tokenTemp}` },
                    });

                    if (!fetchBook.ok) {
                        console.error("Error Fetching Book");
                        throw new Error("Error");
                    }
                    const booksFetch = await fetchBook.json();
                    setBooks(booksFetch);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
                setUser(null);
            }
        }

        // Only fetch data if user is null
        if (user === null) {
            fetchUserData();
        }
    }, [user]);

    // Fallback while loading user
    if (user === null) {
        return <h1>Loading...</h1>;
    }

    return (
        <>
            <img src={user?.pp || ""} alt={`profile picture from ${user.username}`} width={500} height={500} />
            <h1>{user?.name || user?.username}</h1>
            <p>@{user?.username || "Guest"}</p>
            <h2>{user?.desc || "No Description"}</h2>
            <div>
                <button>Wanna write something?</button>
                <a href="/edit">Edit Profile</a>
            </div>
            <div>
                <h3>Recent Stories</h3>
                {books.length > 0 ? (
                    <ul>
                        {books.map((book, index) => (
                            <li key={index}>
                                <a href={`/book/${book?.id}`}><h3>{book?.title}</h3></a>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Tidak ada buku untuk ditampilkan.</p>
                )}
            </div>
        </>
    );
}
