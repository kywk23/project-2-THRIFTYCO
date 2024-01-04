import "./App.css";
import LandingPage from "./Components/LandingPage.jsx";
import ErrorPage from "./Components/ErrorPage.jsx";
import LogInSignUp from "./Components/LogInSignUp.jsx";
import ExpenseTracker from "./Components/ExpenseTracker/ExpenseTracker.jsx";
import BillSplitGroups from "./Components/BillSplit/BillSplit-Groups.jsx";

function App() {
  return (
    <>
      <h1>Money Tracker </h1>
      {/* <LandingPage />
      <ErrorPage />
      <LogInSignUp />
      <ExpenseTracker /> */}
      <BillSplitGroups />
    </>
  );
}

export default App;
