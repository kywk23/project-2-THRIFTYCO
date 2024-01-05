import "./App.css";
import BillSplitGroups from "./Components/BillSplit/BillSplit-Groups.jsx";
import ExpenseTracker from "./Components/ExpenseTracker/ExpenseTracker.jsx";
import LogInSignUp from "./Components/LogInSignUp.jsx";
import LandingPage from "./Components/LandingPage.jsx";
import ErrorPage from "./Components/ErrorPage.jsx";

function App() {
  return (
    <>
      <h1>Money Tracker </h1>
      {/* <LogInSignUp />
      <LandingPage />
      <ErrorPage /> */}
      <ExpenseTracker />
      {/* <BillSplitGroups /> */}
    </>
  );
}

export default App;
