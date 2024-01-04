import React, { useState, useEffect } from "react";
import axios from "axios";

const API_KEY = "fca_live_NvQFhAJ7HtdJEVH8nfNWbHsjiRnRH3t3IsVILyjM";

export default function CurrencyConversion({
  showCurrencyModal,
  handleCloseCurrencyModal,
}) {
  const [amount, setAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState(""); // handle input currency
  const [convertedAmount, setConvertedAmount] = useState("");
  const [currencyOptions, setCurrencyOptions] = useState([]);

  useEffect(() => {
    // Fetch currencies from the API
    const API_URL = `https://api.freecurrencyapi.com/v1/latest?apikey=${API_KEY}`;

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
  }, []);

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
            <button onClick="">Calculate</button>
            <br />
            <button onClick="">Add to Expenses</button>
          </div>
        </div>
      )}
    </>
  );
}
