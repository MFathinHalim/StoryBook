"use client";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt, faBars } from "@fortawesome/free-solid-svg-icons";

export default function Navbar(): JSX.Element {
  const [isLanding, setLanding] = useState(false);
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
        return (window.location.href = "/login");
      }

      const data = await response.json();
      if (!data.token) window.location.href = "/login";
      sessionStorage.setItem("token", data.token);
      return data.token;
    } catch (error) {
      return null;
    }
  };
useEffect(() => {
  const fetchData = async () => {
    try {
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
      } else {
        console.error("Failed to fetch user information");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  setPath(window.location.pathname);
  fetchData();
}, [username]);


  useEffect(() => {
    //@ts-ignore
    import("bootstrap/dist/js/bootstrap.bundle");
  }, []);

  useEffect(() => {
    if (
      window.location.pathname === "/" ||
      window.location.pathname === "/login" ||
      window.location.pathname === "/signup"
    ) {
      setLanding(false);
    } else {
      setLanding(true);
    }
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
    <nav className="navbar navbar-expand-lg navbar-dark px-3 sticky-top background-dark">
      <a
        className="navbar-brand"
        href="/home"
        style={{ color: "#fff", fontWeight: "bold", fontSize: "1.5rem" }}
      >
        <img
          src="https://ik.imagekit.io/9hpbqscxd/SG/image-86.jpg?updatedAt=1705798245623"
          width="35"
          height="35"
          className="d-inline-block align-top rounded-circle me-2"
          alt=""
        />
        Story Book
      </a>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
        style={{ border: "none" }}
      >
        <FontAwesomeIcon icon={faBars} />
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav me-auto">
          {isLanding && (
            <>
              <li className="nav-item">
                <a className={`nav-link`} href="/book/questions">
                  {tag === "Question" ? (
                    <strong> Question </strong>
                  ) : (
                    "Question"
                  )}
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/book/publish">
                  {tag === "Publish" ? <strong> Publish </strong> : "Publish"}
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/about">
                  {path === "/about" ? <strong> About Us </strong> : "About Us"}
                </a>
              </li>
              <form
                className="form-inline mx-3 padding-0 d-flex align-items-center"
                onSubmit={handleSearch}
              >
                <div className="input-group">
                  <input
                    className="form-control search karla border-1"
                    type="search"
                    value={inputValue}
                    onChange={handleInputChange}
                    id="searchInput"
                    placeholder="Search Book"
                    autoComplete="off"
                    aria-label="Search"
                  />
                </div>
              </form>
            </>
          )}
        </ul>
        {isLanding && (
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a className="nav-link rounded-pill" href="/book/add">
                {path === "/book/add" ? <strong>Write</strong> : "Write"}
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link rounded-pill" href="/ai">
                {path === "/ai" ? <strong>Ai Write</strong> : "Ai Write"}
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link rounded-pill" href={`/profile/${username}`}>
                {path === `/profile/${username}` ? <strong>Profile</strong> : "Profile"}
              </a>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
}
