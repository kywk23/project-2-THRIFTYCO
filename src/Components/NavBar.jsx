import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div className="navbar">
      <Link to="/">Home</Link>
      <Link to="/login">Log In/Sign Up</Link>
      <Link to="/expensetracker">Expense Tracker</Link>
      <Link to="/splitbill">Bill Splitter</Link>
      {/* Add other navigation links as needed */}
    </div>
  );
}

export default Navbar;
