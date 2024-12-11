"use client";
import { useEffect, useState } from "react";

export default function Homepage() {
    const [user, setUser] = useState<any>(null); // User state
    const [token, setToken] = useState("");

    const refreshAccessToken = async () => {
        try {
            if (sessionStorage.getItem("token")) {
                console.log("Using cached token");
                return sessionStorage.getItem("token");
            }

            const response = await fetch("/api/user/refreshToken", {
                method: "POST",
                credentials: "include", // Ensure cookies are sent
            });

            if (!response.ok) {
                console.error("Failed to refresh token");
                return null;
            }

            const data = await response.json();
            sessionStorage.setItem("token", data.token);
            console.log("Token refreshed:", data.token);
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
                setToken(tokenTemp);

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
            <h1>Story Book</h1>
            <h2>Hello {user?.username || "Guest"}</h2>
        </>
    );
}
