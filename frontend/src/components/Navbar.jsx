import "../styles/Navbar.css";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  async function handleLogout() {
    await logout();
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link className="logo" to="/">
          Todo App
        </Link>

        <div className="nav-links">
          {user ? (
            <>
              <NavLink
                to="/"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Dashboard
              </NavLink>

              <NavLink
                to="/todo"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Todo List
              </NavLink>

              <NavLink
                to="/add"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Add Task
              </NavLink>

              <NavLink
                to="/profile"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Profile
              </NavLink>

              <button
                type="button"
                className="logout-btn"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Login
              </NavLink>

              <NavLink
                to="/register"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Register
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
