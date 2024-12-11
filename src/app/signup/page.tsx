"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignUpForm() {
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const response = await fetch("/api/user/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            const data: any = response.json();
            if (data.token) {
                sessionStorage.setItem("token", data.token);
                router.push("/home");
            }
        } else {
            console.error("Login Failed");
        }
    };

    return (
        <div>
            <h1>Sign Up</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <input
                        type='text'
                        id='Nama'
                        name='Nama'
                        autoComplete='off'
                        placeholder='Name'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        type='text'
                        id='username'
                        name='username'
                        autoComplete='off'
                        placeholder='Username'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type='password'
                        id='password'
                        name='password'
                        placeholder='Your Password'
                        autoComplete='off'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type='submit'>Sign In</button>
                </div>
            </form>
        </div>
    );
}
