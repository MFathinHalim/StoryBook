"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignUpForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const router = useRouter();

    const handleSubmit = async (event: Event | any) => {
        event.preventDefault();
        setErrorMessage(""); // Reset error message

        try {
            const response = await fetch("/api/user/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.message) {
                    router.push("/home"); // Redirect if signup is successful
                }
            } else {
                if (response.status === 409) {
                    setErrorMessage("Username already exists. Please choose another.");
                } else if (response.status === 401) {
                    setErrorMessage("Invalid username or password. Please try again.");
                } else {
                    setErrorMessage("Server error. Please try again later.");
                }
            }
        } catch (error) {
            console.error("Error during signup:", error);
            setErrorMessage("Network error. Please check your connection and try again.");
        }
    };

    return (
        <div className='container'>
            <div className='content'>
                <div className='space-y-4'>
                    <h1 className='bookTitle'>Sign Up</h1>
                    {errorMessage && (
                        <div className='alert alert-danger' role='alert'>
                            {errorMessage}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className='space-y-4'>
                        <div className='mt-2'>
                            <label htmlFor='username' className='block font-semibold mb-1 h5'>
                                Username
                            </label>
                            <input
                                type='text'
                                id='username'
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className='form-control background-dark text-white border-2 border-secondary rounded p-2'
                                placeholder='Enter your username...'
                                maxLength={16}
                                required
                            />
                        </div>

                        <div className='mt-2'>
                            <label htmlFor='password' className='block font-semibold mb-1 h5'>
                                Password
                            </label>
                            <input
                                type='password'
                                id='password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className='form-control background-dark text-white border-2 border-secondary rounded p-2'
                                placeholder='Enter your password...'
                                required
                            />
                        </div>
                        <h5 className='mt-3'>
                            Already have an account?{" "}
                            <a href='/login' className='bold text-info text-decoration-underline'>
                                Log in
                            </a>
                        </h5>
                        <div className='text-end mt-2'>
                            <button type='submit' className='btn btn-sm primary-btn rounded-pill px-4 py-1'>
                                Sign Up
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
