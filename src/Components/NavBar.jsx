import { Link, NavLink } from "react-router-dom";

function Navbar() {
  return (
    <div className="navbar-bg">
      <div className="navbar">
        <h1 className="logo"> THRIFTY & CO. </h1>
        <ul>
          <li>
            <NavLink to="/" activeclassname="active">
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/LogIn" activeclassname="active">
              Log In
            </NavLink>
          </li>
          <li className="active">
            <NavLink to="/expensetracker" activeclassname="active">
              Expense Tracker
            </NavLink>
          </li>
          <li>
            <NavLink to="/splitbill" activeclassname="active">
              Bill Splitter
            </NavLink>
          </li>
          {/* Add other navigation links as needed */}
        </ul>
      </div>
    </div>
  );
}

export default Navbar;
