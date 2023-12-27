import React, { useState, useEffect } from "react";
import { database } from "./Components/firebase.jsx";
import { ref, push } from "firebase/database";

//npm package: date picker
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";

export default function ExpenseTrackerForm() {
  const [name, setName] = useState(""); // input transaction name
  const [amount, setAmount] = useState(""); // input number
  const [category, setCategory] = useState(""); // category of item
  const [note, setNote] = useState("");
  //date picker
  const [selectedDate, setSelectedDate] = useState(new Date().toDateString()); // current date if user did not choose

  //set date format to Day and Date only
  const handleDateChange = (date) => {
    setSelectedDate(date.toDateString());
  };

  // Prevent negative values for amount
  const handleAmountChange = (e) => {
    let inputValue = e.target.value;

    //when user keys in cents without "0" at the start, add a 0
    if (inputValue.startsWith(".")) {
      inputValue = `0${inputValue}`;
    }

    //regular expression of value starting from 0.01 or .01 (without a zero before decimal point)
    //disallow negative numbers
    const regex = /^(?!-)\d*(\.\d{0,2})?$/;

    if (regex.test(inputValue) || inputValue === "") {
      setAmount(inputValue);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const expenseRef = ref(database, "personal-expenses");

    push(expenseRef, {
      selectedDate,
      name,
      amount,
      category,
      note,
    })
      .then(() => {
        console.log("Transaction", {
          selectedDate,
          name,
          amount,
          category,
          note,
        });
        setName("");
        setAmount("");
        setCategory("");
        setNote("");
      })
      .catch((error) => {
        console.log("Personal Expenses error", error);
      });
  };

  return (
    <div>
      <div className="class">Add a Transaction</div>
      <br />
      <form onSubmit={handleSubmit}>
        <div>
          Select a date:
          <br />
          <DatePicker onChange={handleDateChange} value={selectedDate} />
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
            step="0.01" //increament
            min="0.01" //minimal amount
            required
            onChange={(e) => handleAmountChange(e)}
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
          {/* optional for user */}
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
