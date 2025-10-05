"use client"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShare, faTrash, faBookOpen } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
const defaultCovers = [
  "https://picsum.photos/400/600?random=1",
  "https://picsum.photos/400/600?random=2",
  "https://picsum.photos/400/600?random=3",
  "https://picsum.photos/400/600?random=4",
  "https://picsum.photos/400/600?random=5",
];
export default function BookShortcut({ book, refreshAccessToken }: any) {
      const [randomCover, setRandomCover] = useState<string>("https://picsum.photos/400/600?random=1");

  useEffect(() => {
    if (!book.cover) {
      const random = defaultCovers[Math.floor(Math.random() * defaultCovers.length)];
      setRandomCover(random);
    }
  }, [book.cover]);
  const handleShare = async () => {
    const url = `${window.location.origin}/book/${book._id}`;
    if (navigator.share) {
      await navigator.share({ title: book.title, url });
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this story?")) return;
    const token = await refreshAccessToken();
    const res = await fetch(`/api/book/delete/${book._id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) window.location.reload();
  };


  return (
    <div
      className="position-relative overflow-hidden steam-card border border-black"
      style={{
        height: "350px",
        cursor: "pointer",
      }}
    >
      {/* Cover image */}
      <a href={`/book/${book._id}`}>
        <img
          src={book.cover || randomCover}
            alt={book.title}
          className="w-100 h-100"
          style={{
            objectFit: "cover",
            transition: "transform 0.4s ease",
          }}
        />
      </a>

      {/* Hover overlay */}
      <div className="steam-overlay d-flex flex-column justify-content-end p-3 text-white">
        <div className="steam-text">
          <h5 className="fw-bold mb-2 text-truncate">{book.title}</h5>
          <div className="d-flex justify-content-between align-items-center">
            <a
              href={`/book/${book._id}`}
              className="btn btn-sm btn-light rounded-pill px-3 py-1"
            >
              <FontAwesomeIcon icon={faBookOpen} className="me-2" />
              Read
            </a>
            <div className="d-flex align-items-center gap-3">
              <FontAwesomeIcon
                icon={faShare}
                title="Share"
                onClick={(e) => {
                  e.preventDefault();
                  handleShare();
                }}
                style={{ cursor: "pointer" }}
              />
              {window.location.pathname === "/home" && (
                <FontAwesomeIcon
                  icon={faTrash}
                  title="Delete"
                  onClick={(e) => {
                    e.preventDefault();
                    handleDelete();
                  }}
                  className="text-danger"
                  style={{ cursor: "pointer" }}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Custom styles */}
      <style jsx>{`
        .steam-card img {
          filter: brightness(0.95);
        }

        .steam-card:hover img {
          transform: scale(1.1);
          filter: brightness(0.5);
        }

        .steam-overlay {
          position: absolute;
          inset: 0;
          opacity: 0;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent 60%);
          transition: opacity 0.4s ease;
        }

        .steam-card:hover .steam-overlay {
          opacity: 1;
        }

        .steam-text {
          transform: translateY(20px);
          transition: transform 0.4s ease;
        }

        .steam-card:hover .steam-text {
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
}
