"use client";
import BookShortcut from "@/components/Bookshortcut";
import Loading from "@/components/Loading";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

export default function Homepage() {
    const [user, setUser] = useState<userType | null>(null); // User state
    const [books, setBooks] = useState<bookType[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1); // Untuk mengelola halaman
    const [hasMore, setHasMore] = useState(true); // Untuk mengetahui jika masih ada buku untuk dimuat
    const { ref, inView } = useInView();
    
    const handleLogout = async () => {
      try {
        const response = await fetch("/api/user/logout", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json"
          },
        });
        
        if (response.ok) {
          sessionStorage.clear();
          window.location.href = "/login"
        }
      } catch (error) {
        return ;
      }
    }
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
                handleLogout();
                return (window.location.href = "/login");
            }

            const data = await response.json();
            if (!data.token) return window.location.href = "/login";
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
            const fetchBook = await fetch(`/api/book/get/userId/${userId}?page=${page}&limit=9`, {
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
}, [inView, hasMore, loading, user?._id]);


    // Fallback while loading user
    if (user === null || loading) {
        return <Loading />;
    }

    return (
        <div>
            <div className='container mt-4 py-3'>
                <div className='text-center'>
                    <div style={{ position: "relative" }}>
                        <a href={`/profile/${user.username  }`}>
                            <img
                                className='pfp-home'
                                src={user?.pp || ""}
                                alt={`profile picture from ${user.username}`}
                                style={{
                                    position: "absolute",
                                    zIndex: 1,
                                }}
                            />
                            <img className='pfp-home-blur' src={user?.pp || ""} alt={`profile picture from ${user.username}`} />
                        </a>
                    </div>

                    <h1 className='mt-3 mb-2'>Hello, {user?.name || user?.username}</h1>
                    <div className='secondary-text karla pb-1' dangerouslySetInnerHTML={{ __html: user?.desc || "No Description" }} />
                    <div className='d-flex gap-2 justify-content-center'>
                        <a href='/book/add' className='btn primary-btn'>
                            Have some idea ?
                        </a>
                        <a href='/ai' className='btn secondary-btn'>
                            Try AI
                        </a>
                    </div>
                </div>
                <div className='mt-5 w-100'>
                    <h3 className='button-container text-left'>Recent Stories</h3> {/* Teks rata kiri, lebar 100% */}
                    {books.length > 0 ? (
                        <div className="row">
                            {books.map((book, index) => (
                                <div key={book._id} className="col-md-4 col-sm-6">
                                <BookShortcut key={book._id} book={book} refreshAccessToken={refreshAccessToken} />
                            </div>
                            ))}
                            {loading && <Loading />}
                        </div>
                    ) : (
                        <p>No books to display.</p>
                    )}
                </div>
            </div>
                    <div ref={ref} />

        </div>
    );
}
