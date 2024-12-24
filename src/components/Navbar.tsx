"use client";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

export default function Navbar(): JSX.Element {
  const [isLanding, setLanding] = useState(false);
  useEffect(() => {
    //@ts-ignore
    import('bootstrap/dist/js/bootstrap.bundle');
  }, []); // Hanya dipanggil sekali setelah render pertama
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
  }, []); // Tambahkan dependency array untuk menghindari pemanggilan useEffect berulang-ulang

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

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark px-3 sticky-top background-dark"
    >
      <a className="navbar-brand" href="/home" style={{ color: "#fff", fontWeight: "bold", fontSize: "1.5rem" }}>
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
        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <a className="nav-link text-light" style={{ fontWeight: "bold !important" }} href="/book/questions">
              Questions
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link text-light" style={{ fontWeight: "bold !important" }}
              href="/book/publish">
              Novel
            </a>
          </li>
          {isLanding && (
            <li className="nav-item ms-lg-3">
              <button
                onClick={handleLogout}
                className="btn btn-outline-danger btn-sm"
                title="Logout"
                style={{
                  borderRadius: "20px",
                  padding: "5px 15px",
                  transition: "background-color 0.3s ease",
                }}
              >
                <FontAwesomeIcon icon={faSignOutAlt} /> Log Out
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}
