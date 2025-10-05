"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Loading from "@/components/Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faShare, faCodeBranch } from "@fortawesome/free-solid-svg-icons";
import { useInView } from "react-intersection-observer";

export default function GetBook() {
  const params = useParams();
  const id = params?.id;

  const [book, setBook] = useState<bookType | any>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<commentType[] | any>([]);
  const [newComment, setNewComment] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const { ref, inView } = useInView();
  const [hasMore, setHasMore] = useState(true);

  const refreshAccessToken = async () => {
    try {
      const existing = sessionStorage.getItem("token");
      if (existing) return existing;

      const res = await fetch("/api/user/refreshToken", {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (!data.token) window.location.href = "/login";
      sessionStorage.setItem("token", data.token);
      return data.token;
    } catch {
      window.location.href = "/login";
    }
  };

  const fetchBookAndComments = async (page = 1) => {
    try {
      const token = await refreshAccessToken();
      if (!token) return;

      if (page === 1) {
        setLoading(true);
        const res = await fetch(`/api/book/get/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setBook(data);
      }

      const commentRes = await fetch(`/api/comment/${id}?page=${page}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const commentData = await commentRes.json();

      if (page === 1) setComments(commentData.comments);
      else setComments((prev: any) => [...prev, ...commentData.comments]);

      if (commentData.comments.length === 0) setHasMore(false);
    } catch {
      //
    } finally {
      setCurrentPage(page);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchBookAndComments(1);
  }, [id]);

  useEffect(() => {
    if (inView && hasMore && !loading) {
      fetchBookAndComments(currentPage + 1);
    }
  }, [inView, hasMore, loading]);

  const handlePostComment = async () => {
    if (!newComment.trim()) return;
    const token = await refreshAccessToken();
    const res = await fetch(`/api/comment/post/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ comment: newComment }),
    });
    const data = await res.json();
    setComments((prev: any) => [data.comment, ...prev]);
    setNewComment("");
  };

  const handleUpvote = async (commentId: string) => {
    const token = await refreshAccessToken();
    const res = await fetch(`/api/comment/upvote/${commentId}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setComments((prev: any) =>
      prev.map((c: any) =>
        c._id === commentId ? { ...c, upvote: data.total } : c
      )
    );
  };

  const handleAiSummary = async () => {
    if (!book?.notes) return;
    try {
      setLoadingSummary(true);
      const token = await refreshAccessToken();
      const form = new FormData();
      form.append("notes", book.notes);
      const res = await fetch("/api/ai/summary", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
      const data = await res.json();
      setAiSummary(data.result);
    } catch {
      alert("Book too long for AI summary 😅");
    } finally {
      setLoadingSummary(false);
    }
  };

  function formatTanggal(t: string) {
    const [bulan, tanggal, tahun] = t.split("/");
    const namaBulan = [
      "Januari","Februari","Maret","April","Mei","Juni",
      "Juli","Agustus","September","Oktober","November","Desember",
    ];
    return `${tanggal} ${namaBulan[parseInt(bulan) - 1]} ${tahun}`;
  }

  if (loading) return <Loading />;
  if (!book) return <p className="text-center mt-5">No book found.</p>;

  return (
    <div className="container py-4">
      <div className="mx-auto" style={{ maxWidth: "750px" }}>
        {/* HEADER */}
        <div className="mb-4">
          <p className="text-muted small mb-1">{formatTanggal(book.time)}</p>
          <h1 className="fw-bold lh-1 mb-2" style={{ fontSize: "2.5rem" }}>{book.title}</h1>
          <a href={`/profile/${book.user.username}`} className="text-decoration-none text-secondary">
            Ditulis oleh {book.user.name || book.user.username}
          </a>
        </div>

        {/* COVER */}
        {book.cover && (
          <img
            src={book.cover}
            alt="Book Cover"
            className="w-100 border border-black mb-4 shadow-sm"
            style={{ height: "auto" }}
          />
        )}

        {/* ACTIONS */}
        <div className="d-flex flex-wrap gap-2 mb-4">
          <a href={`/book/edit/${book.id}`} className="btn btn-primary rounded-pill px-4">
            <FontAwesomeIcon icon={faCodeBranch} /> Fork
          </a>
          <button className="btn btn-secondary rounded-pill px-4">
            <FontAwesomeIcon icon={faShare} /> Share
          </button>
          <button onClick={handleAiSummary} className="btn btn-outline-dark fw-bold rounded-pill px-4">
            {loadingSummary ? "Generating..." : "AI Summary"}
          </button>
        </div>

        {/* SUMMARY */}
        {aiSummary && (
          <div className="p-3 border border-black mb-4">
            <h5 className="fw-bold mb-2">AI Summary</h5>
            <p className="mb-0">{aiSummary}</p>
          </div>
        )}

        {/* CONTENT */}
        <div
          className="karla mb-5"
          style={{
            fontSize: "1.05rem",
            lineHeight: "1.8",
            color: "#2b2b2b",
          }}
          dangerouslySetInnerHTML={{ __html: book.notes }}
        />

        {/* COMMENTS */}
        <div className="border-top pt-4">
          <h4 className="fw-bold mb-3">Comments</h4>
          <textarea
            className="form-control mb-2"
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            style={{ height: "80px", resize: "none" }}
          />
          <div className="text-end mb-3">
            <button onClick={handlePostComment} className="btn btn-dark rounded-pill px-4">
              Post
            </button>
          </div>

          {/* Comment List */}
          {comments?.length > 0 ? (
            <ul className="list-unstyled">
              {comments.map((c: any) => (
                <li key={c._id} className="py-3 border-bottom d-flex justify-content-between align-items-start">
                  <div className="d-flex gap-3">
                    <img
                      src={c.user.pp || "https://via.placeholder.com/35"}
                      className="rounded-circle"
                      width={35}
                      height={35}
                      alt="User"
                    />
                    <div>
                      <a href={`/profile/${c.user.username}`} className="fw-semibold text-dark text-decoration-none">
                        {c.user.name || c.user.username}
                      </a>
                      <p className="mb-1" style={{ fontSize: "0.95rem", color: "#444" }}>
                        {c.comment}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleUpvote(c._id)}
                    className="btn btn-sm btn-outline-danger rounded-pill"
                  >
                    <FontAwesomeIcon icon={faHeart} /> {c.upvote.length || 0}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted">No comments yet.</p>
          )}
          <div ref={ref}></div>
        </div>
      </div>
    </div>
  );
}
