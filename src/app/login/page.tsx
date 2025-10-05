"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function LoginForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const response = await fetch("/api/user/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            const data: any = await response.json();
            if (data.token) {
                sessionStorage.setItem("token", data.token);
                router.push("/home");
            }
        } else {
            setErrorMessage(
                response.status === 401
                    ? "Invalid username or password. Please try again."
                    : "Server error. Please try again later."
            );
        }
    };

    const refreshAccessToken = async () => {
        if (sessionStorage.getItem("token")) return (window.location.href = "/home");

        const response = await fetch("/api/user/refreshToken", { method: "POST", credentials: "include" });
        if (!response.ok) return;

        const data = await response.json();
        if (!data.token) return;
        sessionStorage.setItem("token", data.token);
        window.location.href = "/home";
    };

    useEffect(() => {
        async function callToken() {
            await refreshAccessToken();
        }
        callToken();
    }, []);

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "90vh !important" }}>
            <div className="card border border-black p-5 rounded-4" style={{ maxWidth: "500px", width: "90%" }}>
                <h1 className="text-center mb-4">Selamat Kembali</h1>

                {errorMessage && (
                    <div className="alert alert-danger" role="alert">
                        {errorMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                    <div>
                        <label htmlFor="username" className="form-label fw-semibold">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="form-control border border-secondary p-2"
                            placeholder="Enter your username..."
                            maxLength={16}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="form-label fw-semibold">
                            Password
                        </label>
                        <div className="input-group gap-2">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="form-control border border-secondary"
                                placeholder="Enter your password..."
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="btn btn-outline-secondary rounded-pill"
                                aria-label="Toggle Password Visibility"
                            >
                                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                            </button>
                        </div>
                    </div>

                    <div>
                        <h6>
                            Don't have an account?{" "}
                            <a href="/signup" className="text-primary text-decoration-underline fw-bold">
                                Sign Up
                            </a>
                        </h6>
                    </div>

                    <button type="submit" className="btn btn-primary w-100 rounded-pill">
                        Log In
                    </button>
                </form>
            </div>
        </div>
    );
}
