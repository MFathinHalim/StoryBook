"use client";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt, faBars } from "@fortawesome/free-solid-svg-icons";

export default function Navbar(): JSX.Element {
    const [isLanding, setLanding] = useState(true);
    const [tag, setTag] = useState("");
    const [inputValue, setInputValue] = useState("");
    const [path, setPath] = useState("");
    const [username, setUsername] = useState("");
    const refreshAccessToken = async () => {
        try {
            if (sessionStorage.getItem("token")) {
                return sessionStorage.getItem("token");
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
            return data.token;
        } catch (error) {
            return null;
        }
    };
    useEffect(() => {
        const fetchData = async () => {
            // Refresh the access token
            const tokenTemp = await refreshAccessToken();

            // Check user information
            const response = await fetch(`/api/user/check`, {
                method: "POST",
                headers: { Authorization: `Bearer ${tokenTemp}` },
            });

            if (response.ok) {
                const check = await response.json();
                setUsername(check.username);
            }

            return;
        };

        setPath(window.location.pathname);
        fetchData();
    }, [username]);

    useEffect(() => {
        //@ts-ignore
        import("bootstrap/dist/js/bootstrap.bundle");
    }, []);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const tagParam = urlParams.get("tag") ? `?tag=${urlParams.get("tag")}` : "";
        if (window.location.pathname === "/home") {
            setTag("");
        } else if (window.location.pathname === "/book/questions") {
            setTag("Question");
        } else if (window.location.pathname === "/book/publish") {
            setTag("Publish");
        } else if (tagParam) {
            setTag(tagParam.replace("?tag=", ""));
        }
    }, []);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Prevent form submission
        if (inputValue.trim()) {
            window.location.href = `/search/${encodeURIComponent(inputValue)}?tag=${tag}`;
        }
    };

    return (
        <nav className='navbar navbar-expand-lg bg-bg px-3 sticky-top border-bottom'>
            <div className='container-lg '>
                <a className='navbar-brand' href='/home'>
                    <img
                        src='https://ik.imagekit.io/9hpbqscxd/SG/image-86.jpg?updatedAt=1705798245623'
                        width='35'
                        height='35'
                        className='d-inline-block align-top rounded-circle me-2'
                        alt=''
                    />
                </a>
                <button
                    className='navbar-toggler'
                    type='button'
                    data-bs-toggle='collapse'
                    data-bs-target='#navbarNav'
                    aria-controls='navbarNav'
                    aria-expanded='false'
                    aria-label='Toggle navigation'
                    style={{ border: "none" }}>
                    <FontAwesomeIcon icon={faBars} />
                </button>
                <div className='collapse navbar-collapse' id='navbarNav'>
                    <ul className='navbar-nav w-100'>
                        {isLanding && (
                            <>
                                <li className='nav-item'>
                                    <a className={`nav-link`} href='/book/questions'>
                                        {tag === "Question" ? <strong> Question </strong> : "Question"}
                                    </a>
                                </li>
                                <li className='nav-item'>
                                    <a className='nav-link' href='/book/publish'>
                                        {tag === "Publish" ? <strong> Publish </strong> : "Publish"}
                                    </a>
                                </li>
                                <form className='form-inline mx-lg-3 padding-0 w-100 d-flex align-items-center' onSubmit={handleSearch}>
                                    <div className='input-group'>
                                        <input
                                            className='form-control bg-transparent search karla border-1'
                                            type='search'
                                            value={inputValue}
                                            onChange={handleInputChange}
                                            id='searchInput'
                                            placeholder='Search'
                                            autoComplete='off'
                                            aria-label='Search'
                                        />
                                    </div>
                                </form>
                            </>
                        )}
                    </ul>
                    {isLanding && (
                        <ul className='navbar-nav ms-auto'>
                            <li className='nav-item dropdown'>
                                <a className='nav-link dropdown-toggle' href='#' role='button' data-bs-toggle='dropdown' aria-expanded='false'>
                                    Write
                                </a>
                                <ul className='dropdown-menu dropdown-menu-end'>
                                    <li>
                                        <a className='dropdown-item' href='/book/add'>
                                            {path === "/book/add" ? <strong>Write</strong> : "Write"}
                                        </a>
                                    </li>
                                    <li>
                                        <a className='dropdown-item' href='/ai'>
                                            {path === "/ai" ? <strong>Ai Write</strong> : "Ai Write"}
                                        </a>
                                    </li>
                                </ul>
                            </li>
                            <li className='nav-item'>
                                <a className='nav-link rounded-pill' href={`/profile/${username}`}>
                                    {path === `/profile/${username}` ? <strong>Profile</strong> : "Profile"}
                                </a>
                            </li>
                        </ul>
                    )}
                </div>
            </div>
        </nav>
    );
}
