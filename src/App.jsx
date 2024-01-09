import "./App.css";
import BillSplitGroups from "./Components/BillSplit/BillSplit-Groups.jsx";
import ExpenseTracker from "./Components/ExpenseTracker/ExpenseTracker.jsx";
import SignUp from "./Components/LogInSignUp/SignUp.jsx";
import LogIn from "./Components/LogInSignUp/LogIn.jsx";
import LandingPage from "./Components/LandingPage.jsx";
import ErrorPage from "./Components/ErrorPage.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Navbar from "./Components/NavBar.jsx";
import { Helmet } from "react-helmet";

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
      path: "/LogIn",
      element: (
        <div>
          <Navbar />
          <LogIn />
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
      <Helmet>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Spectral:wght@300&display=swap"
          rel="stylesheet"
        />
      </Helmet>
      <div>
        <RouterProvider router={router} />
        <br />
      </div>
    </>
  );
}

export default App;
