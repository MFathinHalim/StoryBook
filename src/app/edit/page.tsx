"use client";
import React, { useEffect, useState } from "react";

export default function EditProfile() {
    const [user, setUser] = useState<any | null>(null); // User state
    const [formData, setFormData] = useState({
        _id: "",
        name: "",
        username: "",
        desc: "",
        pp: "",
    }); // Form state
    const [file, setFile] = useState<File | null>(null); // File chooser state
    const [preview, setPreview] = useState<string | null>(null); // Preview state

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
                return null;
            }

            const data = await response.json();
            sessionStorage.setItem("token", data.token);
            console.log("Token refreshed:", data.token);
            return data.token;
        } catch (error) {
            console.error("Error refreshing access token:", error);
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
                    console.error("Failed to fetch user data");
                    throw new Error("Unauthorized");
                }

                const check = await response.json();
                setUser(check);
                setFormData(check);
            } catch (error) {
                console.error("Error fetching user data:", error);
                setUser(null);
            }
        }

        if (user === null) {
            fetchUserData();
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0] || null;
        setFile(selectedFile);
        if (selectedFile) {
            const objectUrl = URL.createObjectURL(selectedFile);
            setPreview(objectUrl);
        } else {
            setPreview(null);
        }
    };

    const handleFileUpload = async () => {
        if (!file) {
            alert("Please choose a file first!");
            return;
        }

        try {
            const uploadData = new FormData();
            uploadData.append("file", file);

            const response = await fetch("/api/upload", {
                method: "POST",
                body: uploadData,
            });

            if (!response.ok) {
                console.error("Failed to upload file");
                return;
            }

            const data = await response.json();
            setFormData((prev) => ({ ...prev, pp: data.url }));
            setPreview(null); // Clear the preview after successful upload
            alert("Profile picture updated successfully!");
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };

    const handleSave = async () => {
        try {
            const tokenTemp = await refreshAccessToken();
            if (!tokenTemp) {
                console.error("No token available for saving");
                return;
            }

            const response = await fetch("/api/user/update", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${tokenTemp}`,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                console.error("Failed to save profile");
                return;
            }

            const updatedUser = await response.json();
            setUser(updatedUser);
            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Error saving profile:", error);
        }
    };

    if (user === null) {
        return <h1>Loading...</h1>;
    }

    return (
        <>
            <h1>Edit Profile</h1>
            <form onSubmit={(e) => e.preventDefault()}>
                <input
                    type="hidden"
                    name="_id"
                    value={formData._id}
                    readOnly
                />
                <div>
                    <label>Profile Picture:</label>
                    <input type="file" onChange={handleFileChange} accept="image/*" />
                    {preview && <img src={preview} alt="Preview" width={100} />}
                    <button type="button" onClick={handleFileUpload}>
                        Upload
                    </button>
                    {formData.pp && !preview && <img src={formData.pp} alt="Profile" width={100} />}
                </div>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your name"
                    />
                </div>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Enter your username"
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea
                        name="desc"
                        value={formData.desc}
                        onChange={handleChange}
                        placeholder="Enter a description about yourself"
                    />
                </div>
                <button type="button" onClick={handleSave}>
                    Save
                </button>
            </form>
        </>
    );
}
