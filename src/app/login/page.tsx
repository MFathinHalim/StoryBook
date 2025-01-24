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
            if (response.status === 401) {
                setErrorMessage("Invalid username or password. Please try again.");
            } else {
                setErrorMessage("Server error. Please try again later.");
            }
        }
    };

    const refreshAccessToken = async () => {
        if(sessionStorage.getItem("token")) {
          return window.location.href = "/home";  
        }

        const response = await fetch("/api/user/refreshToken", {
          method: "POST",
          credentials: "include", // Ensure cookies are sent
        });   

        if (!response.ok) {
          return;
        }

        const data = await response.json();
        if (!data.token) return;
        sessionStorage.setItem("token", data.token);
        return window.location.href = "/home"; 
      }
    
    useEffect(() => {
      async function callToken() {
        await refreshAccessToken();
      }
      callToken();
    }, [])  

    return (
        <div className='container'>
            <div className='content'>
                <div className='space-y-4'>
                    <h1 className='bookTitle'>Log In</h1>
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

                        <div className='mt-2 relative'>
                            <label htmlFor='password' className='block font-semibold mb-1 h5'>
                                Password
                            </label>
                            <div className='flex items-center'>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id='password'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className='form-control background-dark text-white border-2 border-secondary rounded p-2 flex-grow'
                                    placeholder='Enter your password...'
                                    required
                                />
                                <button
                                    type='button'
                                    onClick={() => setShowPassword(!showPassword)}
                                    className='secondary-btn btn mt-2 '
                                    aria-label='Toggle Password Visibility'
                                >
                                    Show Password <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                </button>
                            </div>
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
