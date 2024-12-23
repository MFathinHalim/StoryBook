"use client"
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

export default function Navbar(): JSX.Element {
  const [isLanding, setLanding] = useState(false)
  useEffect(() => {
    if(window.location.pathname === "/" || window.location.pathname === "/login" || window.location.pathname === "/signup") {
      setLanding(false)
    }else {
      setLanding(true)
    }
  });
  const handleLogout = async () => {
    try {
      const response = await fetch('/api/user/logout', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        // Hapus session storage setelah berhasil logout
        sessionStorage.clear();
        // Arahkan ke halaman login atau '/'
        window.location.href = '/';
      } else {
        console.error('Failed to logout');
      }
    } catch (error) {
      console.error('An error occurred during logout:', error);
    }
  };
  

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark px-3 sticky-top background-dark">
        <a className="navbar-brand" href="/home">
          <h1 className="p-0 m-0">Story Book</h1>
        </a>
        <li className="nav-item active">
        <a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a>
      </li>
      <li className="nav-item">
        <a className="nav-link" href="#">Link</a>
      </li>
        {isLanding && (
          <>
          <button
            onClick={handleLogout}
            className="btn btn-sm btn-transparent danger-text ms-auto"
            title="Logout"
            style={{
              border: 'none',
              background: 'none',
              fontSize: '1.2rem',
              cursor: 'pointer',
            }}
          >
            <FontAwesomeIcon icon={faSignOutAlt} />
          </button>
          </>
        )}
      </nav>
    </>
  );
}
