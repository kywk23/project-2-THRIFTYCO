import "./App.css";
import LandingPage from "./Components/LandingPage.jsx";
import ErrorPage from "./Components/ErrorPage.jsx";
import SignUp from "./Components/SignUp.jsx";

function App() {
  return (
    <>
      <h1>Money Tracker </h1>
      {/* <LandingPage />
      <ErrorPage /> */}
      <SignUp />
    </>
  );
}

export default App;
