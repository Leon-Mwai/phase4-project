import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
  Link,
} from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Dashboard from "../pages/Dashboard";
import Budgets from "../pages/Budgets";

import "../styles/Navbar.css"; // ⬅️ Add this
import "../styles/App.css"; // ⬅️ Optional global styles

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
        // Still log out the user locally even if server request fails
        setUser(null);
      });
  }

  if (loading) return <h2>Loading...</h2>;

  return (
    <Router>
      <div className="navbar">
        <Link className="nav-link" to="/">
          🏠 Home
        </Link>
        {user ? (
          <>
            <Link className="nav-link" to="/dashboard">
              📊 Dashboard
            </Link>
            <Link className="nav-link" to="/budgets">
              💸 Budgets
            </Link>
            <button className="nav-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link className="nav-link" to="/login">
              🔐 Login
            </Link>
            <Link className="nav-link" to="/signup">
              📝 Signup
            </Link>
          </>
        )}
      </div>

      <div className="app-content">
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/signup">
            {user ? <Redirect to="/dashboard" /> : <Signup setUser={setUser} />}
          </Route>
          <Route path="/login">
            {user ? <Redirect to="/dashboard" /> : <Login setUser={setUser} />}
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
      </div>
    </Router>
  );
}

export default App;
