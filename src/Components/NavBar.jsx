import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div className="navbar-bg">
      <div className="navbar">
        <h1 className="logo">Money Tracker </h1>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/login">Log In/Sign Up</Link>
          </li>
          <li>
            <Link to="/expensetracker">Expense Tracker</Link>
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
