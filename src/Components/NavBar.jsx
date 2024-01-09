import { Link, NavLink } from "react-router-dom";
import { useLogOut } from "./Hooks/useLogOut";
import { useAuthContext } from "./Hooks/useAuthContext";

function Navbar() {
  const { logout } = useLogOut();
  const { user, authIsReady } = useAuthContext();

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
            <li className="active">
              <NavLink to="/expensetracker" activeclassname="active" className="nav-link">
                Expense Tracker
              </NavLink>
            </li>
            <li>
              <NavLink to="/splitbill" activeclassname="active" className="nav-link">
                Bill Splitter
              </NavLink>
            </li>

            {!user && (
              <>
                <li>
                  <NavLink to="/SignUp" activeclassname="active" className="nav-link">
                    Sign Up
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/LogIn" activeclassname="active" className="nav-link">
                    Log In
                  </NavLink>
                </li>
              </>
            )}

            {user && (
              <>
                <li style={{ color: "rgb(150, 100, 300)", textDecoration: "underline white" }}>
                  Hello, {user.displayName}{" "}
                </li>
                <button style={{ backgroundColor: "white" }} onClick={logout}>
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
