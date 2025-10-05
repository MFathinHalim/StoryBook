"use client";
import BookShortcut from "@/components/Bookshortcut";
import Loading from "@/components/Loading";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

export default function Homepage() {
  const params = useParams();
  const username = params?.username;

  const [user, setUser] = useState<userType | null>(null);
  const [seeUser, setSeeUser] = useState<userType | null>(null);
  const [books, setBooks] = useState<bookType[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { ref, inView } = useInView();

  const refreshAccessToken = async () => {
    try {
      if (sessionStorage.getItem("token")) return sessionStorage.getItem("token");
      const response = await fetch("/api/user/refreshToken", {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) return (window.location.href = "/login");
      const data = await response.json();
      if (!data.token) window.location.href = "/login";
      sessionStorage.setItem("token", data.token);
      return data.token;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    async function fetchUserData() {
      try {
        const tokenTemp = await refreshAccessToken();
        if (!tokenTemp) return;

        const response = await fetch(`/api/user/check`, {
          method: "POST",
          headers: { Authorization: `Bearer ${tokenTemp}` },
        });
        if (!response.ok) return;

        const check = await response.json();
        setUser(check);

        const fetchUser = await fetch(`/api/user/get/${username}`);
        const userFetch = await fetchUser.json();
        setSeeUser(userFetch);

        fetchBooks(userFetch._id, tokenTemp, currentPage);
      } catch {
        setUser(null);
      }
    }

    if (user === null) fetchUserData();
  }, [user, currentPage]);

  async function fetchBooks(userId: string, token: string, page: number) {
    try {
      const res = await fetch(`/api/book/get/noPrivate/${userId}?page=${page}&limit=10`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.books.length > 0) {
        setBooks((prev) => (page === 1 ? data.books : [...prev, ...data.books]));
      } else {
        setHasMore(false);
      }
    } catch {
      return;
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (inView && hasMore && !loading && seeUser?._id) {
      const loadMore = async () => {
        const token = await refreshAccessToken();
        await fetchBooks(seeUser._id, token!, currentPage + 1);
        setCurrentPage((p) => p + 1);
      };
      loadMore();
    }
  }, [inView]);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/user/logout", { method: "DELETE" });
      if (response.ok) {
        sessionStorage.clear();
        window.location.href = "/";
      }
    } catch {}
  };

  if (seeUser === null || loading) return <Loading />;

  return (
    <div className="container py-4">
      {/* === PROFILE SECTION === */}
      <div className="d-flex flex-column flex-md-row align-items-center align-items-md-start gap-4 p-4 border-bottom border-black mb-4">
        {/* Profile Picture */}
        <img
          src={seeUser?.pp || "/default-pp.jpg"}
          alt={`profile picture from ${seeUser?.username}`}
          className="rounded-circle border"
          style={{
            height: "100px",
            objectFit: "cover",
            flexShrink: 0,
          }}
        />

        {/* User Info */}
        <div className="flex-grow-1 text-center text-md-start">
          <h2 className="fw-bold mb-2">
            {seeUser?.name ||
              (seeUser?.username.charAt(0).toUpperCase() +
                seeUser?.username.slice(1))}
          </h2>

        
          <p
            className="text-muted karla"
            dangerouslySetInnerHTML={{
              __html: seeUser?.desc || "<i>No description provided.</i>",
            }}
          />
        </div>
         {seeUser?._id === user?._id && (
            <div className="d-flex gap-2 justify-content-center justify-content-md-start mb-3">
              <a href="/edit" className="btn btn-primary rounded-pill px-4" style={{ fontSize: "2px !important", fontWeight: "600 !important" }}>
                Edit
              </a>
              <button
                className="btn btn-danger rounded-pill px-3"
                onClick={handleLogout}
              >
                Keluar
              </button>
            </div>
          )}

      </div>

      {/* === BOOKS SECTION === */}
      <div>
        <h3 className="fw-bold mb-3">📚 Recent Stories</h3>
        {books.length > 0 ? (
          <div className="row row-cols-1 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 g-2">
            {books.map((book) => (
              <div key={book._id}>
                <BookShortcut
                  book={book}
                  refreshAccessToken={refreshAccessToken}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted text-center mt-5">
            This user hasn’t published any stories yet.
          </p>
        )}
      </div>

      <div ref={ref} className="my-4 text-center">
        {hasMore && loading && <Loading />}
      </div>
    </div>
  );
}
