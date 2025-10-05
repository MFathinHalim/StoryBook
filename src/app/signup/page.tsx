"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function SignUpForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setErrorMessage("");

        try {
            const response = await fetch("/api/user/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.message) router.push("/home");
            } else {
                if (response.status === 409) setErrorMessage("Username already exists. Please choose another.");
                else if (response.status === 401) setErrorMessage("Invalid username or password. Please try again.");
                else setErrorMessage("Server error. Please try again later.");
            }
        } catch (error) {
            console.error("Error during signup:", error);
            setErrorMessage("Network error. Please check your connection and try again.");
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
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "90vh" }}>
            <div className="card border border-black p-5 rounded-4" style={{ maxWidth: "500px", width: "90%" }}>
                <h1 className="text-center mb-4">Bergabunglah</h1>

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

                    <div className="text-center">
                        <h6>
                            Already have an account?{" "}
                            <a href="/login" className="text-primary text-decoration-underline fw-bold">
                                Log in
                            </a>
                        </h6>
                    </div>

                    <button type="submit" className="btn btn-primary w-100 rounded-pill mt-3">
                        Sign Up
                    </button>
                </form>
            </div>
        </div>
    );
}
