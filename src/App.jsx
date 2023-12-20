import "./App.css";
import LandingPage from "./Components/LandingPage.jsx";
import ErrorPage from "./Components/ErrorPage.jsx";
import LogInSignUp from "./Components/LogInSignUp.jsx";

function App() {
  return (
    <>
      <h1>Money Tracker </h1>
      {/* <LandingPage />
      <ErrorPage /> */}
      <LogInSignUp />
    </>
  );
}

export default App;
