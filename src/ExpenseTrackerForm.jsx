import React, { useState, useEffect } from "react";

export default function ExpenseTrackerForm() {
  const [name, setName] = useState(""); // input transaction name
  const [amount, setAmount] = useState(""); // input number
  const [category, setCategory] = useState(""); // category of item
  const [note, setNote] = useState("");
  const [currentDate, setCurrentDate] = useState(""); // state to hold current date

  useEffect(() => {
    // use current date for now
    setCurrentDate(new Date().toDateString());
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Transaction", {
      Date: currentDate,
      name,
      amount,
      category,
      note,
    });
  };

  return (
    <div>
      <div className="class">Add a Transaction</div>
      <br />
      <form onSubmit={handleSubmit}>
        <div>
          <div>Date: {currentDate}</div>
        </div>
        <br />
        <label>
          <div>Transaction Name:</div>
          <input
            type="text"
            required
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </label>
        <label>
          <div>Amount</div>
          <input
            type="number"
            required
            onChange={(e) => setAmount(e.target.value)}
            value={amount}
          />
        </label>
        <label>
          <div>Category:</div>
          <input
            type="text"
            required
            onChange={(e) => setCategory(e.target.value)}
            value={category}
          />
        </label>
        <label>
          <div>Note:</div>
          <input
            type="text"
            onChange={(e) => setNote(e.target.value)}
            value={note}
          />
        </label>

        <br />
        <button className="button">Add Transaction</button>
      </form>
    </div>
  );
}
