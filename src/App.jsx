import "./App.css";
import BillSplitGroups from "./Components/BillSplit/BillSplit-Groups.jsx";
import ExpenseTracker from "./Components/ExpenseTracker/ExpenseTracker.jsx";
import LogInSignUp from "./Components/LogInSignUp.jsx";
import LandingPage from "./Components/LandingPage.jsx";
import ErrorPage from "./Components/ErrorPage.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Navbar from "./Components/NavBar.jsx";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <div>
          <Navbar />
          <LandingPage />
          <br />
        </div>
      ),
    },
    {
      path: "/login",
      element: (
        <div>
          <Navbar />
          <LogInSignUp />
          <br />
        </div>
      ),
    },
    {
      path: "/expensetracker",
      element: (
        <div>
          <Navbar />
          <ExpenseTracker />
        </div>
      ),
    },
    {
      path: "/splitbill",
      element: (
        <div>
          <Navbar />
          <BillSplitGroups />
        </div>
      ),
    },
  ]);
  return (
    <>
      <div>
        <RouterProvider router={router} />
        <br />
      </div>
    </>
  );
}

export default App;
