import React from "react";

export default function CurrencyConversion({
  showCurrencyModal,
  handleCloseCurrencyModal,
}) {
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
              // value={}
              onChange={(e) => e.target.value}
              placeholder="Enter amount"
            />
            <p>From</p>
            <input
              type="text"
              // value={}
              onChange={(e) => e.target.value}
              placeholder="Choose Currency"
            />
            <p>To SGD: </p>
            <button>Calculate</button>
            <br />
            <button>Add to Expenses</button>
          </div>
        </div>
      )}
    </>
  );
}
