"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function GetBook() {
    const params = useParams();
    const id = params?.id;

    const [book, setBook] = useState<bookType | any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [comments, setComments] = useState<commentType[] | any>([]);
    const [newComment, setNewComment] = useState("");

    const [currentPage, setCurrentPage] = useState(0);

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
                console.error("Failed to refresh token");

                return undefined;
            }

            const data = await response.json();

            sessionStorage.setItem("token", data.token);
            return data.token;
        } catch (error) {
            console.error("Error refreshing access token:", error);

            return undefined;
        }
    };
    const fetchBookAndComments = async (page = 1) => {
        try {
            setLoading(true);
            setError(null);

            const token = await refreshAccessToken();
            if (!token) throw new Error("Unable to retrieve access token");
            //headers: { Authorization: `Bearer ${token}` },

            // Fetch Book
            const bookResponse = await fetch(`/api/book/get/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!bookResponse.ok) throw new Error("Failed to fetch book details");
            const bookData = await bookResponse.json();
            setBook(bookData);

            // Fetch Comments
            const commentsResponse = await fetch(`/api/comment/${id}?page=${page}`, { headers: { Authorization: `Bearer ${token}` } }); // Get comments by book ID
            if (!commentsResponse.ok) console.error("Failed to fetch comments"); // Don't throw error, just log
            else {
                const commentsData = await commentsResponse.json();
                if (page === 1) {
                    setComments(commentsData.comments);
                } else {
                    // Jika bukan halaman pertama, gabungkan dengan komentar sebelumnya
                    //@ts-ignore
                    setComments((prevComments) => [...prevComments, ...commentsData.comments]);
                }
            }
        } catch (err) {
            return;
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (!id) return;

        setCurrentPage(currentPage + 1);
        fetchBookAndComments(currentPage + 1);
    }, [id]);
    const handleUpvote = async (commentId: string) => {
        try {
            const token = await refreshAccessToken();
            if (!token) throw new Error("Unable to retrieve access token");

            const response = await fetch(`/api/comment/upvote/${commentId}`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to upvote comment");
            }
            const data = await response.json();
            setComments(
                (
                    //@ts-ignore
                    prevComments,
                ) =>
                    //@ts-ignore
                    prevComments.map((comment) => {
                        if (comment.id === commentId) {
                            return { ...comment, upvote: data.total }; // Update upvote from response
                        }
                        return comment; // Return the unchanged comment
                    }),
            );
        } catch (err) {
            //@ts-ignore

            alert(err.message);
        }
    };
    const handlePostComment = async () => {
        if (!newComment.trim()) return;

        try {
            const token = await refreshAccessToken();
            if (!token) throw new Error("Unable to retrieve access token");

            const response = await fetch(`/api/comment/post/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ comment: newComment }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to post comment");
            }
            const data = await response.json();
            //@ts-ignore

            comments.push(data.comment);
            setNewComment("");
        } catch (err) {
            //@ts-ignore
            alert(err.message);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p className='text-red-500'>Error: {error}</p>;
    if (!book) return <p>No book found</p>;

    return (
        <div className='container mx-auto p-4'>
            <div className='space-y-4'>
                <h1>{book.title}</h1>
                <div className='bg-gray-100 p-4 rounded' dangerouslySetInnerHTML={{ __html: book.notes }} />
                {book.cover && (
                    <div>
                        <img src={book.cover} alt='Book cover' className='mt-2 rounded shadow w-1/2' />
                    </div>
                )}
            </div>

            <div className='mt-8 comments-container'>
                <h2 className='text-xl font-bold mb-4'>Comments</h2>

                {comments?.length > 0 ? (
                    comments?.map((comment: commentType) => (
                        <div key={comment._id} className='border p-4 mb-2 rounded'>
                            <p>{comment.comment}</p>
                            <div className='flex justify-between items-center mt-2'>
                                <button onClick={() => handleUpvote(comment.id)} className='text-blue-500 hover:text-blue-700'>
                                    Upvote ({comment.upvote.length || 0})
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No comments yet.</p>
                )}
                <button
                    onClick={() => {
                        setCurrentPage(currentPage + 1);
                        fetchBookAndComments(currentPage + 1);
                    }}
                    className='bg-blue-500 text-white px-4 py-2 rounded mt-2 hover:bg-blue-700'>
                    Tampilkan Lebih Banyak
                </button>

                <div className='mt-4'>
                    <textarea className='w-full p-2 border rounded' placeholder='Write a comment...' value={newComment} onChange={(e) => setNewComment(e.target.value)} />
                    <button onClick={handlePostComment} className='bg-green-500 text-white px-4 py-2 rounded mt-2 hover:bg-green-700'>
                        Post Comment
                    </button>
                </div>
            </div>
        </div>
    );
}
