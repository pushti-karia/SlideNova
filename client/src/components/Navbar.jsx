import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="container navbar__inner">
        <NavLink to="/" className="navbar__logo">
          <div className="navbar__logo-icon">✦</div>
          SlideNova
        </NavLink>
        <div className="navbar__nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `navbar__link${isActive ? ' active' : ''}`}
          >
            <span>Generate</span>
          </NavLink>
          <NavLink
            to="/history"
            className={({ isActive }) => `navbar__link${isActive ? ' active' : ''}`}
          >
            <span>History</span>
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
