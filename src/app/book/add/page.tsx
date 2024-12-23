"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

export default function AddBooks() {
    const [title, setTitle] = useState("");
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [imagee, setImagee] = useState<File | null | string | any>("");

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
            setImagee(URL.createObjectURL(e.target.files[0]));
        }
    };

    const refreshAccessToken = async () => {
        try {
            if (sessionStorage.getItem("token")) {
                return sessionStorage.getItem("token");
            }

            const response = await fetch("/api/user/refreshToken", {
                method: "POST",
                credentials: "include",
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSuccessMessage("");

        const formData = new FormData();
        formData.append("title", title);
        formData.append("notes", notes);
        if (image) {
            formData.append("image", image);
        }

        try {
            const token = await refreshAccessToken();
            if (!token) {
                throw new Error("Unable to get access token");
            }

            const response = await fetch("/api/book/post", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || "Something went wrong");
            }

            setSuccessMessage("Book added successfully!");
            setTitle("");
            setNotes("");
            setImage(null);
        } catch (error: any) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='container'>
            <div className='content'>
                <div className='space-y-4'>
                    <h1 className='bookTitle'>Add a New Book</h1>
                    {imagee && (
                        <div>
                            <img src={imagee} alt='Book cover' className='mt-2 rounded shadow bookCover' />
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className='space-y-4'>
                        <div className='mt-2'>
                            <label htmlFor='title' className='block font-semibold mb-1 h5'>
                                Title
                            </label>
                            <input
                                type='text'
                                id='title'
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className='form-control background-dark text-white border-2 border-secondary rounded p-2'
                                placeholder='Enter book title...'
                                required
                            />
                        </div>

                        <div className='mt-2'>
                            <label htmlFor='notes' className='block font-semibold mb-1 h5'>
                                Notes
                            </label>
                            <ReactQuill value={notes} onChange={setNotes} className='background-dark text-white border-2 border-secondary rounded quill-custom' />
                        </div>

                        <div className='mt-2'>
                            <label htmlFor='image' className='block font-semibold mb-1 h5'>
                                Cover Image (optional)
                            </label>
                            <input
                                type='file'
                                id='image'
                                accept='image/*'
                                onChange={handleImageChange}
                                className='form-control background-dark text-white border-2 border-secondary rounded p-2'
                            />
                        </div>

                        <div className='text-end mt-2'>
                            <button type='submit' className='btn btn-sm primary-btn rounded-pill px-4 py-1' disabled={loading}>
                                {loading ? "Submitting..." : "Add Book"}
                            </button>
                        </div>

                        {successMessage && <p className='text-green-500 font-semibold mt-2'>{successMessage}</p>}
                    </form>
                </div>
            </div>
        </div>
    );
}
