"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function GetBook() {
  const params = useParams();
  const id = params?.id; // Extract the 'id' from the dynamic route

  const [book, setBook] = useState<bookType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    if (!id) return; // Wait for 'id' to be available

    const fetchBook = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = await refreshAccessToken();
        if (!token) throw new Error("Unable to retrieve access token");

        const response = await fetch(`/api/book/get/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch book details");
        }

        const data: bookType = await response.json();
        setBook(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]); // Fetch book whenever 'id' changes

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!book) return <p>No book found</p>;

  return (
    <div className="container mx-auto p-4">
      <div className="space-y-4">
        <h1>{book.title}</h1>
        <div className="bg-gray-100 p-4 rounded" dangerouslySetInnerHTML={{ __html: book.notes }} />
        {book.cover && (
          <div>
            <img
              src={book.cover}
              alt="Book cover"
              className="mt-2 rounded shadow w-1/2"
            />
          </div>
        )}
      </div>
    </div>
  );
}
