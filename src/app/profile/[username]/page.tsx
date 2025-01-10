"use client";
import BookShortcut from "@/components/Bookshortcut";
import Loading from "@/components/Loading";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

export default function Homepage() {
    const params = useParams();
    const username = params?.username;

    const [user, setUser] = useState<userType | null>(null); // User state
    const [seeUser, setSeeUser] = useState<userType | null>(null); //! See User
    const [books, setBooks] = useState<bookType[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1); // Untuk mengelola halaman
    const [hasMore, setHasMore] = useState(true); // Untuk mengetahui jika masih ada buku untuk dimuat
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
                const fetchUser = await fetch(`/api/user/get/${username}`, {
                    method: "GET"
                });
                const userFetch = await fetchUser.json();
                setSeeUser(userFetch);

                fetchBooks(userFetch._id, tokenTemp, currentPage); // Fetch books after user data is loaded
            } catch (error) {
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
            const fetchBook = await fetch(`/api/book/get/noPrivate/${userId}?page=${page}&limit=2`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const booksFetch = await fetchBook.json();
            if (booksFetch.books.length > 0 && page !== 1) {
                setBooks((prevBooks) => [...prevBooks, ...booksFetch.books]);
            } else if (page === 1) {
                setBooks(booksFetch.books);
            } else {
                setHasMore(false); // No more books to load
            }
        } catch (error) {
            return
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
                    await fetchBooks(seeUser?._id || "", tokenTemp, currentPage + 1); // Increment page here
                    setCurrentPage((prevPage) => prevPage + 1); // Update page number
                } catch (error) {
                    return
                }
            }
        };

        loadMoreBooks();
    }
}, [inView, hasMore, loading, user?._id]);


    // Fallback while loading user
    if (seeUser === null || loading) {
        return <Loading />;
    }

    return (
        <div>
            <div className='px-3 py-3'>
                <div className='text-center'>
                    <div style={{ position: "relative" }}>
                        <img
                            className='pfp-home'
                            src={seeUser?.pp || ""}
                            alt={`profile picture from ${seeUser?.username}`}
                            style={{
                                position: "absolute",
                                zIndex: 1,
                            }}
                        />
                        <img className='pfp-home-blur' src={seeUser?.pp || ""} alt={`profile picture from ${seeUser?.username}`} />
                    </div>
                    <h1 className='mt-3 mb-0'>{seeUser?.name || seeUser?.username}</h1>
                    <div className='secondary-text karla' dangerouslySetInnerHTML={{ __html: seeUser?.desc || "No Description" }} />
                      {seeUser?._id === user?._id && (
                        <div className='mb-0'>
                          <a href="/edit" className="btn primary-btn">Edit Profile</a>
                        </div>
                      )}
                </div>
                <div className='mt-3 w-100'>
                    <h3 className='button-container text-left'>Recent Stories</h3> {/* Teks rata kiri, lebar 100% */}
                    {books.length > 0 ? (
                        <div className="row">
                            {books.map((book, index) => (
                                <div key={book._id} className="col-md-3 col-sm-6">
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
 