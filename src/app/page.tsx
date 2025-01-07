"use client";
import BookShortcut from "@/components/Bookshortcut";
import Loading from "@/components/Loading";
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
                return 
           }

            const data = await response.json();
            if (!data.token) return
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
                    return
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



    return (
      <div className="d-flex justify-content-center align-items-center" style={{height: "75vh", overflow: "hidden !important"}}> {/* Centering container */}
          <div className="container">
              <div className="text-center position-relative">
                  <img
                      className="pfp-landing-blur"
                      src={user?.pp || 'https://img.freepik.com/free-photo/anime-style-character-space_23-2151133935.jpg?semt=ais_hybrid'}
                      alt={`profile picture dari ${user?.username || ""}`}
                  />
                  <div className="position-absolute top-50 start-50 translate-middle w-100 text-center" style={{ zIndex: 1 }}>
                      <h1 className="mt-3 mb-0 text-white">Story Book</h1>
                      <h3 className="mt-0 mb-0 secondary-text text-white">The place where your story is written</h3> {/* Text white for visibility */}
                      <div className="d-flex gap-2 mt-3 justify-content-center">
                          <a href={user?.username ? "/home" : "/login"} className="btn primary-btn">Have some Ideas?</a>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  );

}
