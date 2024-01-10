import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useLogOut } from "./Hooks/useLogOut";
import { useAuthContext } from "./Hooks/useAuthContext";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const { logout } = useLogOut();
  const { user, authIsReady } = useAuthContext();

  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [firstLogin, setFirstLogin] = useState(false);

  const nav = useNavigate();

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    nav("/");
  };

  useEffect(() => {
    if (user) {
      setIsLoggedIn(true);
      if (!firstLogin) {
        setFirstLogin(true);
        nav("/expensetracker"); // Redirect to Expense Tracker only on initial login
      }
    } else {
      setIsLoggedIn(false);
      setFirstLogin(false);
    }
  }, [user, nav, firstLogin]);

  return (
    <div className="navbar-bg">
      <div className="navbar">
        <h1 className="logo"> THRIFTY & CO. </h1>
        {authIsReady && (
          <ul>
            <li>
              <NavLink to="/" activeclassname="active" className="nav-link">
                Home
              </NavLink>
            </li>
            {user && (
              <>
                <li className="active">
                  <NavLink
                    to="/expensetracker"
                    activeclassname="active"
                    className="nav-link"
                  >
                    Expense Tracker
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/splitbill"
                    activeclassname="active"
                    className="nav-link"
                  >
                    Bill Splitter
                  </NavLink>
                </li>
              </>
            )}

            {!user && (
              <>
                <li>
                  <NavLink
                    to="/SignUp"
                    activeclassname="active"
                    className="nav-link"
                  >
                    Sign Up
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/LogIn"
                    activeclassname="active"
                    className="nav-link"
                  >
                    Log In
                  </NavLink>
                </li>
              </>
            )}
            {user && (
              <>
                <li style={{ color: "rgb(255, 95, 31)" }}>
                  Hello, {user.displayName}{" "}
                </li>
                <button
                  style={{ backgroundColor: "white" }}
                  onClick={isLoggedIn ? handleLogout : () => nav("/")} //when user sign out or not previously sign in, goes to home page
                >
                  Log Out
                </button>
              </>
            )}
            {/* Add other navigation links as needed */}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Navbar;
