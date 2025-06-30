import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
  Link,
  useLocation,
} from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Dashboard from "../pages/Dashboard";
import Budgets from "../pages/Budgets";

import "../styles/Navbar.css";
import "../styles/App.css";

function Navbar({ user, onLogout }) {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const getUserInitials = (user) => {
    if (!user || !user.username) return "U";
    return user.username.charAt(0).toUpperCase();
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          💰 BrokeBuddy
        </Link>

        <ul className="navbar-nav">
          {user ? (
            <>
              <li>
                <Link
                  to="/dashboard"
                  className={`nav-link ${isActive("/dashboard") ? "active" : ""}`}
                >
                  <span className="nav-link-icon">📊</span>
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/budgets"
                  className={`nav-link ${isActive("/budgets") ? "active" : ""}`}
                >
                  <span className="nav-link-icon">💸</span>
                  Budgets
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  to="/login"
                  className={`nav-link ${isActive("/login") ? "active" : ""}`}
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/signup"
                  className={`nav-link ${isActive("/signup") ? "active" : ""}`}
                >
                  Sign Up
                </Link>
              </li>
            </>
          )}
        </ul>

        {user && (
          <div className="nav-actions">
            <div className="nav-user">
              <div className="nav-user-avatar">{getUserInitials(user)}</div>
              <div className="nav-user-info">
                <div className="nav-user-name">{user.username}</div>
                <div className="nav-user-email">{user.email}</div>
              </div>
            </div>
            <button className="nav-btn nav-btn-danger" onClick={onLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

function LoadingScreen() {
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <div className="loading-text">Loading...</div>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5555/check_session", {
      credentials: "include",
    })
      .then((res) => (res.ok ? res.json().then(setUser) : setUser(null)))
      .catch((error) => {
        console.error("Session check error:", error);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  function handleLogout() {
    fetch("http://localhost:5555/logout", {
      method: "DELETE",
      credentials: "include",
    })
      .then(() => setUser(null))
      .catch((error) => {
        console.error("Logout error:", error);
        setUser(null);
      });
  }

  if (loading) return <LoadingScreen />;

  return (
    <Router>
      <div className="app">
        <Navbar user={user} onLogout={handleLogout} />

        <main className="app-content">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/signup">
              {user ? (
                <Redirect to="/dashboard" />
              ) : (
                <Signup setUser={setUser} />
              )}
            </Route>
            <Route path="/login">
              {user ? (
                <Redirect to="/dashboard" />
              ) : (
                <Login setUser={setUser} />
              )}
            </Route>
            <Route path="/dashboard">
              {user ? (
                <Dashboard user={user} setUser={setUser} />
              ) : (
                <Redirect to="/login" />
              )}
            </Route>
            <Route path="/budgets">
              {user ? <Budgets user={user} /> : <Redirect to="/login" />}
            </Route>
          </Switch>
        </main>
      </div>
    </Router>
  );
}

export default App;
