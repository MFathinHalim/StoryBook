"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Loading from "@/components/Loading";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

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
                window.location.href = "/login" 
            }

            const data = await response.json();
            if(!data.token) return window.location.href = "/login" 

            sessionStorage.setItem("token", data.token);
            return data.token;
        } catch (error) {
            console.error("Error refreshing access token:", error);

            return undefined;
        }
    };
    const fetchBookAndComments = async (page = 1) => {
        try {
            const token = await refreshAccessToken();
            if (!token) throw new Error("Unable to retrieve access token");
            if (page === 1) {

                setLoading(true);
                setError(null);


                //headers: { Authorization: `Bearer ${token}` },

                // Fetch Book
                const bookResponse = await fetch(`/api/book/get/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!bookResponse.ok) throw new Error("Failed to fetch book details");
                const bookData = await bookResponse.json();
                setBook(bookData);
            }

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
            page = +page + 1;
            setCurrentPage(page)
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
            console.log(data)
            setComments((prevComments: any) =>
                prevComments.map((comment: any) => {
                    if (comment._id === commentId) {
                        // Update jumlah upvote
                        return { ...comment, upvote: data.total};
                    }
                    return comment;
                }),
            );
        } catch (err) {
            alert((err as Error).message);
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

    if (loading) return <Loading />;
    if (error) return <p className='text-red-500'>Error: {error}</p>;
    if (!book) return <p>No book found</p>;
    function formatTanggal(tanggalAwal: string) {
        const [bulan, tanggal, tahun] = tanggalAwal.split("/"); // Memisahkan tanggal, bulan, dan tahun

        const namaBulan = [ // Array nama bulan
            "Januari", "Februari", "Maret", "April", "Mei", "Juni",
            "Juli", "Agustus", "September", "Oktober", "November", "Desember"
        ];


        const bulanIndex = parseInt(bulan) - 1; // Mendapatkan index bulan (dimulai dari 0)
        const namaBulanFormatted = namaBulan[bulanIndex];
        return `${tanggal} ${namaBulanFormatted} ${tahun}`; // Menggabungkan kembali dengan format baru
    }


    return (
        <div className='container'>
            <div className='content'>

                <div className='space-y-4'>
                    <h5 className="bookTitle" style={{ opacity: "78%" }}>{formatTanggal(book.time)}</h5>
                    <h1 className="bookTitle">{book.title}</h1>
                    <h5 className="bookTitle" style={{ opacity: "78%" }}>Write by {book.user.name || book.user.username }</h5>
                    {book.cover && (
                        <div>
                            <img src={book.cover} alt='Book cover' className='mt-2 rounded shadow bookCover' />
                        </div>
                    )}
                    <div className="d-flex gap-2 mt-2">
                        <a href={`/book/edit/${book.id}`} className="btn secondary-btn rounded-pill">Edit</a>
                        <button className="btn primary-btn rounded-pill">Share</button>
                    </div>
                    <div className='text-justify isi mt-2 karla' dangerouslySetInnerHTML={{ __html: book.notes }} />
                </div>
                <h3 className='font-bold mb-2'>Comments</h3>
                <div className='comment-form rounded background-dark text-white'>
                    <div className='d-flex'>
                        <div className='w-100'>
                            <textarea
                                className='form-control background-dark text-white border-2 border-secondary rounded p-2'
                                placeholder='Write a comment...'
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                style={{ resize: 'none', height: '80px', wordWrap: 'break-word' }}
                            />
                        </div>
                    </div>
                    <div className='text-end mt-2'>
                        <button
                            onClick={handlePostComment}
                            className='btn btn-sm primary-btn rounded-pill px-4 py-1'
                            style={{ fontWeight: 'bold' }}
                        >
                            Post Comment
                        </button>
                    </div>
                </div>
                <div>
                    {comments?.length > 0 ? (
                        <ul className='list-group background-dark border-0 comment-list'>
                            {comments.map((comment: any) => (
                                <li key={comment._id} className='my-2 list-group-item border-0 align-items-center p-0 background-dark text-white d-flex justify-content-between'>
                                    <div className='d-flex p-0 '>
                                        <img
                                            src={comment.user.pp || 'https://via.placeholder.com/30'} // Use user avatar if available, otherwise placeholder
                                            alt='User Avatar'
                                            style={{ height: '35px' }}
                                            className='comment-avatar rounded-circle me-2'
                                        />
                                        <div className='comment-user-info mb-0'>
                                            <h5 className='comment-name mb-0'>{comment.user.name}</h5>
                                            <p className='my-0' style={{ wordWrap: 'break-word', maxWidth: '55vw' }}>{comment.comment}</p>
                                        </div>
                                    </div>
                                    <div className='comment-actions'>
                                        <button
                                            onClick={() => handleUpvote(comment._id)}
                                            className='btn btn-sm danger-btn rounded-pill '
                                            style={{ fontWeight: "bold !important" }}
                                        >
                                            <FontAwesomeIcon icon={faHeart} /> {comment.upvote.length || 0}
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className='text-center'>No comments yet.</p>
                    )}
                    <button
                        onClick={() => {
                            fetchBookAndComments(currentPage + 1)
                        }}
                        className='btn primary-btn mt-2 cursor-default rounded-pill mb-3'
                    >
                        Tampilkan Lebih Banyak
                    </button>
                </div>

            </div>
        </div>
    );
}