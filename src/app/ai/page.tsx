"use client";

import { useState } from "react";

export default function SaveAiContent() {
    const [title, setTitle] = useState("");
    const [additionalPrompt, setAdditionalPrompt] = useState(""); // Tambahan input
    const [result, setResult] = useState<string | null>(null);
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [tag, setTag] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
            setImagePreview(URL.createObjectURL(e.target.files[0]));
        }
    };

    const handleToggle = (selectedTag: string) => {
        setTag((prevTag) => (prevTag === selectedTag ? "" : selectedTag));
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

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);

        const token = await refreshAccessToken();
        if (!token) {
            throw new Error("Unable to get access token");
        }

        const formData = new FormData();
        const combinedPrompt = `${additionalPrompt}`;
        formData.append("prompt", combinedPrompt);

        try {
            const response = await fetch("/api/ai/generate", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to generate AI content");
            }

            const data = await response.json();
            setResult(data.result);
        } catch (error: any) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSuccessMessage("");

        const formData = new FormData();
        formData.append("title", title);
        formData.append("notes", result || ""); // Simpan konten AI atau manual
        formData.append("tag", tag);
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

            if (!response.ok) {
                throw new Error("Failed to save AI content");
            }

            setSuccessMessage("Content saved successfully!");
            setTitle("");
            setResult("");
            setTag("");
            setImage(null);
            setImagePreview("");
        } catch (error: any) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container my-4">
            <h1 className="text-center mb-4">AI Generated Stories</h1>

            {imagePreview && (
                <div className="text-center mb-4">
                    <img src={imagePreview} alt="Preview" className="img-fluid rounded" style={{ maxWidth: "200px" }} />
                </div>
            )}

            <form onSubmit={handleSave}>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Title</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="form-control"
                        placeholder="Enter title..."
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="additionalPrompt" className="form-label">Additional Prompt</label>
                    <input
                        type="text"
                        id="additionalPrompt"
                        value={additionalPrompt}
                        onChange={(e) => setAdditionalPrompt(e.target.value)}
                        className="form-control"
                        placeholder="Enter additional prompt..."
                    />
                </div>

                <div className="mb-3">
                    <div className='text-justify isi mt-2 karla' dangerouslySetInnerHTML={{ __html: result || "<h3> hasil disini </h3>" }} />
                </div>

                <div className="d-grid gap-2">
                    <button
                        type="button"
                        onClick={handleGenerate}
                        className="btn primary-btn"
                        disabled={loading}
                    >
                        {loading ? "Generating..." : "Generate AI Content"}
                    </button>
                </div>

                <div className="mb-3 mt-3">
                    <label htmlFor="image" className="form-label">Cover Image (optional)</label>
                    <input
                        type="file"
                        id="image"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="form-control"
                    />
                </div>

                <div className="d-flex justify-content-between mb-3">
                    <button
                        type="button"
                        onClick={() => handleToggle("Publish")}
                        className={`btn ${tag === "Publish" ? "btn-light" : "btn-outline-light"}`}
                    >
                        Publish
                    </button>
                </div>

                <div className="d-grid gap-2">
                    <button
                        type="submit"
                        className="btn btn-success"
                        disabled={loading}
                    >
                        {loading ? "Saving..." : "Save Content"}
                    </button>
                </div>

                {successMessage && <div className="alert alert-success mt-4">{successMessage}</div>}
            </form>
        </div>
    );
}
