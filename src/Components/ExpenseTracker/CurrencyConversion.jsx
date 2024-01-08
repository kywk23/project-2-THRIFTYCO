import React, { useState, useEffect } from "react";
import axios from "axios";
import "./popup.css";

const API_KEY = import.meta.env.VITE_SOME_CURRENCY_API_KEY;
const API_URL = `https://api.freecurrencyapi.com/v1/latest?apikey=${API_KEY}`;

export default function CurrencyConversion({
  showCurrencyModal,
  handleCloseCurrencyModal,
  handleAmountChange,
}) {
  const [toConvertAmount, setToConvertAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState("");
  const [toCurrency, setToCurrency] = useState("SGD"); //default always set to SGD
  const [convertedAmount, setConvertedAmount] = useState("");
  const [currencyOptions, setCurrencyOptions] = useState([]); //list of currency

  const handleAmountToBeConverted = (e) => {
    let inputValue = e.target.value;

    if (inputValue.startsWith(".")) {
      inputValue = `0${inputValue}`;
    }

    const regex = /^(?!-)\d*(\.\d{0,2})?$/;

    if (regex.test(inputValue) || inputValue === "") {
      setToConvertAmount(inputValue);
    }
  };

  //display currency in drop down selection
  useEffect(() => {
    // fetch currencies from the API only when user click on 'convert currency', to save usage.
    if (showCurrencyModal) {
      axios
        .get(API_URL)
        .then((response) => {
          const currencyData = response.data.data;
          console.log("current list - data", currencyData);
          const currencies = Object.keys(currencyData);
          setCurrencyOptions(currencies);
          console.log("currencies", currencies);
        })
        .catch((error) => {
          console.error("Error fetching currencies:", error);
          // Handle error state or display an error message for currency fetch failure
        });
    }
  }, [showCurrencyModal]);

  // Conversion Logic
  // fetch details from the specified currency to SGD first
  // conversion URL base_currency is the foreign currency; set the target currency to SGD by default
  // calculation: foreign currency amount * SGD rate (e.g., USD 1 * SGD 1.33 = expenses in SGD)
  // display the converted amount (in SGD) to the user
  // allow the user to add the converted amount to the expense tracker - not done

  const calculateConversion = () => {
    let conversion_URL = `${API_URL}&currencies=${toCurrency}&base_currency=${fromCurrency}`;
    console.log("conversion URL data", conversion_URL);

    //only allow user to convert when fromCurrency and amount is valid
    if (toConvertAmount && fromCurrency) {
      axios
        .get(conversion_URL)
        .then((response) => {
          const exchangeRateValues = response.data.data;
          const exchangeRate = Object.values(exchangeRateValues);
          console.log("chosen curreny exchangeRate:", exchangeRate);
          //calculation
          //input amount * exchangeRate
          const calConversion = toConvertAmount * exchangeRate;
          const toTwoDecimal = calConversion.toFixed(2);
          //set to 2 decimal points
          setConvertedAmount(toTwoDecimal);
        })
        .catch((error) => {
          console.error("Currency conversion page error:", error);
        });
    } else {
      console.error("Please provide amount and currency to convert");
      // Handle error state or display an error message for missing input
    }
  };

  const handleCalculate = () => {
    calculateConversion();
  };

  const handleAddToExpensesForm = () => {
    handleAmountChange(convertedAmount); // pass the converted amount to Amount in expense tracker form
    console.log(`Add ${convertedAmount} to expenses tracker form`);
    setConvertedAmount(""); // clear converted amount after adding to expenses
    setToConvertAmount(""); // clear to convert amount
    handleCloseCurrencyModal(); //close window
  };

  return (
    <>
      {showCurrencyModal && (
        <div className="overlay">
          <div className="popup">
            <button className="close" onClick={handleCloseCurrencyModal}>
              Close
            </button>
            <h2>Money Currency</h2>
            <p>Amount to be converted:</p>
            <input
              type="number"
              step="0.01"
              min="0.01"
              required
              onChange={(e) => handleAmountToBeConverted(e)}
              value={toConvertAmount}
            />
            <p>From</p>
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
            >
              <option value="">Choose Currency</option>
              {currencyOptions.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
            <p>To Converted Amount: {convertedAmount}</p>
            <p>To</p>
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
            >
              <option value="">Choose Currency</option>
              {currencyOptions.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>

            <button className="function" onClick={handleCalculate}>
              Calculate
            </button>
            <br />
            <button onClick={handleAddToExpensesForm}>Add to Form</button>
          </div>
        </div>
      )}
    </>
  );
}
