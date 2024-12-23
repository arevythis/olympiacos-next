import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

const Navbar = ({ onShowLoginModal, onShowAddMatchModal, onShowAddTeamModal }) => {
  const { currentUser, logout } = useAuth();

  useEffect(() => {
    console.log('Navbar: Current user state updated:', currentUser);
  }, [currentUser]);

  return (
    <nav className="navbar navbar-expand-lg navbar-light fixed-top mask-custom shadow-0">
      <div className="container">
        <img src="/oly.png" alt="Olympiacos Logo" style={{ height: "60px", width: "60px", objectFit: "contain", marginRight: "10px" }} />
        <Link className="navbar-brand" href="/">
          <span style={{ color: "#a30909" }}>Olympiacos </span><span style={{ color: "#fff" }}>project</span>
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent" aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item me-3">
              <a className="nav-link" href="#" onClick={onShowAddMatchModal} style={{ color: "white" }}>Add Match</a>
            </li>
            <li className="nav-item me-3">
              <a className="nav-link" href="#" onClick={onShowAddTeamModal} style={{ color: "white" }}>Add Team</a>
            </li>
            {currentUser ? (
              <li className="nav-item dropdown me-3">
                <a className="nav-link dropdown-toggle" href="#" id="username-dropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false" style={{ color: "red" }}>
                  <span id="username">{currentUser.username}</span>
                </a>
                <ul className="dropdown-menu" aria-labelledby="username-dropdown">
                  <li><a className="dropdown-item" href="#" onClick={logout}>Log Out</a></li>
                </ul>
              </li>
            ) : (
              <li className="nav-item me-3">
                <a id="login-link" className="nav-link" href="#" onClick={onShowLoginModal} style={{ color: "white" }}>Log In</a>
              </li>
            )}
            <li className="nav-item me-3">
              <Link href="/teamsTable" className="teamz">
                Teams
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;