import { Link, NavLink } from "react-router-dom";

function Navbar() {
  return (
    <div className="navbar-bg">
      <div className="navbar">
        <h1 className="logo">Money Tracker </h1>
        <ul>
          <li>
            <NavLink to="/" activeClassName="active">
              Home
            </NavLink>
          </li>
          <li>
            <Link to="/login">Log In/Sign Up</Link>
          </li>
          <li className="active">
            <NavLink to="/expensetracker" activeClassName="active">
              Expense Tracker
            </NavLink>
          </li>
          <li>
            <Link to="/splitbill">Bill Splitter</Link>
          </li>
          {/* Add other navigation links as needed */}
        </ul>
      </div>
    </div>
  );
}

export default Navbar;
