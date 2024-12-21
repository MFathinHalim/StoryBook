"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css"; // Import Quill styles

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

export default function AddBooks() {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const refreshAccessToken = async () => {
    try {
      if (sessionStorage.getItem("token")) {
        console.log("Using cached token");
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
      console.log("Token refreshed:", data.token);
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
      const token = await refreshAccessToken(); // Ensure the token is awaited
      if (!token) {
        throw new Error("Unable to get access token");
      }

      const response = await fetch("/api/book/post", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // Use the token correctly
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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add a New Book</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block font-semibold mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div>
          <label htmlFor="notes" className="block font-semibold mb-1">
            Notes
          </label>
          <ReactQuill
            value={notes}
            onChange={setNotes}
            className="bg-white border border-gray-300 rounded"
          />
        </div>

        <div>
          <label htmlFor="image" className="block font-semibold mb-1">
            Cover Image (optional)
          </label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Add Book"}
        </button>

        {successMessage && (
          <p className="text-green-500 font-semibold mt-2">{successMessage}</p>
        )}
      </form>
    </div>
  );
}
