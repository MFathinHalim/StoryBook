"use client";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

export default function Navbar(): JSX.Element {
  const [isLanding, setLanding] = useState(false);
  const [tag, setTag] = useState("");
  const [inputValue, setInputValue] = useState("");

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

    if (window.location.pathname === "/home") {
      setTag("");
    } else if (window.location.pathname === "/book/questions") {
      setTag("Questions");
    } else if (window.location.pathname === "/book/publish") {
      setTag("Publish");
    }
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/user/logout", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        sessionStorage.clear();
        window.location.href = "/";
      } else {
        console.error("Failed to logout");
      }
    } catch (error) {
      console.error("An error occurred during logout:", error);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent form submission
    if (inputValue.trim()) {
      window.location.href = `/search/${encodeURIComponent(inputValue)}?tag=${encodeURIComponent(tag)}`;
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
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        {isLanding && (
          <form className="form-inline padding-0 w-100" onSubmit={handleSearch}>
            <div className="input-group w-100">
              <input
                className="form-control bg-transparent rounded-pill"
                type="search"
                value={inputValue}
                onChange={handleInputChange}
                id="searchInput"
                placeholder="Search"
                autoComplete="off"
                aria-label="Search"
              />
            </div>
          </form>
        )}
        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <a
              className="nav-link text-light"
              style={{ fontWeight: "bold" }}
              href="/ai"
            >
              AI
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link text-light"
              style={{ fontWeight: "bold" }}
              href="/book/questions"
            >
              Questions
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link text-light"
              style={{ fontWeight: "bold" }}
              href="/book/publish"
            >
              Novel
            </a>
          </li>
          {isLanding && (
            <li className="nav-item ms-lg-3">
              <button
                onClick={handleLogout}
                className="btn btn-outline-danger btn-sm"
                style={{
                  borderRadius: "20px",
                  padding: "5px 15px",
                  transition: "background-color 0.3s ease",
                }}
              >
                <FontAwesomeIcon icon={faSignOutAlt} />
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}
