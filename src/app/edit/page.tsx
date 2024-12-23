"use client";
import Loading from "@/components/Loading";
import React, { useEffect, useRef, useState } from "react";

export default function EditProfile() {
    const [user, setUser] = useState<any | null>(null);
    const [formData, setFormData] = useState({
        _id: "",
        name: "",
        username: "",
        desc: "",
    });
    const [preview, setPreview] = useState<string | null>(null);
    const [image, setImage] = useState<File | null>(null);
    const [isSaving, setIsSaving] = useState(false); // NEW: State for loading
    const fileInputRef = useRef<HTMLInputElement | null>(null);

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
                return null;
            }

            const data = await response.json();
            sessionStorage.setItem("token", data.token);
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
                setFormData({
                    _id: check._id,
                    name: check.name,
                    username: check.username,
                    desc: check.desc,
                });
                setPreview(check.pp);
            } catch (error) {
                console.error("Error fetching user data:", error);
                setUser(null);
            }
        }

        if (user === null) {
            fetchUserData();
        }
    }, [user]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSave = async () => {
        setIsSaving(true); // Start loading
        try {
            const tokenTemp = await refreshAccessToken();
            if (!tokenTemp) {
                console.error("No token available for saving");
                return;
            }

            const formDataToSend = new FormData();
            formDataToSend.append("_id", formData._id);
            formDataToSend.append("name", formData.name);
            formDataToSend.append("username", formData.username);
            formDataToSend.append("desc", formData.desc);

            if (image) {
                formDataToSend.append("image", image);
            }

            const response = await fetch("/api/user/update", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${tokenTemp}`,
                },
                body: formDataToSend,
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
        } finally {
            setIsSaving(false); // Stop loading
        }
    };

    const handleProfileClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    if (user === null) {
        return <Loading />;
    }

    return (
        <div className="container py-3">
            <div className="text-center">
                <div
                    style={{ position: "relative", cursor: "pointer" }}
                    onClick={handleProfileClick}
                >
                    <img
                        className="pfp-home"
                        src={preview || ""}
                        alt={`profile picture from ${user.username}`}
                        style={{
                            position: "absolute",
                            zIndex: 1,
                        }}
                    />
                    <img
                        className="pfp-home-blur"
                        src={preview || ""}
                        alt={`profile picture from ${user.username}`}
                    />
                </div>
                <label
                    htmlFor="image"
                    className="mt-2 p"
                    style={{ fontFamily: "Montserrat", fontWeight: "bold" }}
                >
                    <strong className="danger-text">*</strong> Click profile picture to change
                </label>

                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    accept="image/*"
                    onChange={handleFileChange}
                />

                <form onSubmit={(e) => e.preventDefault()}>
                    <input type="hidden" name="_id" value={formData._id} readOnly />

                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control text-center"
                            style={{ fontSize: "xx-large" }}
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your name"
                        />
                    </div>

                    <div className="mb-3">
                        <textarea
                            className="form-control text-center"
                            style={{ fontSize: "xx-large" }}
                            id="desc"
                            name="desc"
                            value={formData.desc}
                            onChange={handleChange}
                            placeholder="Enter a description about yourself"
                        ></textarea>
                    </div>


                        <button
                            type="button"
                            onClick={handleSave}
                            className="btn primary-btn btn-lg"
                            disabled={isSaving}
                        >
                                {isSaving ? "Submitting..." : "Save"}
                        </button>
                </form>
            </div>
        </div>
    );
}
