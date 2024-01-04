import React, { useState, useEffect } from "react";
import axios from "axios";

const API_KEY = import.meta.env.VITE_SOME_CURRENCY_API_KEY;
const API_URL = `https://api.freecurrencyapi.com/v1/latest?apikey=${API_KEY}`;

export default function CurrencyConversion({
  showCurrencyModal,
  handleCloseCurrencyModal,
}) {
  const [amount, setAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState(""); // handle input currency
  const [convertedAmount, setConvertedAmount] = useState("");
  const [currencyOptions, setCurrencyOptions] = useState([]); //list of currency

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

  // Conversion
  // need details from currency to SGD first
  // conversion - base is foreign currency, currency is sgd (eg. usd 1 - sgd 1.33)
  // https://api.freecurrencyapi.com/v1/latest?apikey=<key>&currencies=SGD&base_currency=${fromCurrency}
  // from foreign currency multiply to SGD rate. eg. usd 1 * sgd 1.33 = converted sgd = 1.33
  // push converted amt of 1.33 to expenses (if users want to push)
  // display converted amount (SGD) to user

  const calculateConversion = () => {
    let conversion_URL = `${API_URL}&currencies=SGD&base_currency=${fromCurrency}`;
    console.log("conversion URL data", conversion_URL);

    //only allow user to convert when fromCurrency and amount is valid
    if (amount && fromCurrency) {
      axios
        .get(conversion_URL)
        .then((response) => {
          const conversionValue = response.data.data;
          const rate = Object.values(conversionValue);
          console.log("chosen curreny rate:", rate); //rates of the currency
          //calculation
          //input amount * rate
          const calConversion = amount * rate;
          setConvertedAmount(calConversion);
          console.log("converted amt:", calConversion);
          console.log("converted amt:", convertedAmount);
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

  const handleAddToExpenses = () => {
    console.log(`Adding SGD {convertedAmount} to expenses`);
  };

  return (
    <>
      {showCurrencyModal && (
        <div className="modal-background">
          <div className="modal-content">
            <button className="close" onClick={handleCloseCurrencyModal}>
              Close
            </button>
            <h2>Money Currency</h2>
            <p>Amount to be converted:</p>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
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
            <p>To SGD: {convertedAmount}</p>
            <button onClick={handleCalculate}>Calculate</button>
            <br />
            <button onClick={handleAddToExpenses}>Add to Expenses</button>
          </div>
        </div>
      )}
    </>
  );
}
