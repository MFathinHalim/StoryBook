"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const response = await fetch("/api/user/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            const data: any = await response.json();
            if (data.token) {
                sessionStorage.setItem("token", data.token);
                router.push("/home");
            }
        } else {
            console.error("Login Failed");
        }
    };

    return (
        <div className='container'>
            <div className='content'>
                <div className='space-y-4'>
                    <h1 className='bookTitle'>Log In</h1>
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
                            Don't have an account?{" "}
                            <a href='/signup' className='bold text-info text-decoration-underline'>
                                Sign Up
                            </a>
                        </h5>
                        <div className='text-end mt-2'>
                            <button type='submit' className='btn btn-sm primary-btn rounded-pill px-4 py-1'>
                                Log In
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
