import React, { useState, useEffect } from "react";
import { database } from "../firebase.jsx";
import { ref, push, update, onValue, remove } from "firebase/database";

// npm package: date picker
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";

import CurrencyConversion from "./CurrencyConversion.jsx";
import AddEditCategories from "./AddEditCategories.jsx";

export default function ExpenseTrackerForm() {
  const [name, setName] = useState(""); // input transaction name
  const [amount, setAmount] = useState(""); // input number
  const [note, setNote] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toDateString());
  const [categoryField, setCategoryField] = useState(""); // Items in the category label
  const [categories, setCategories] = useState([]);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false); //pop up for category
  const [showCurrencyModal, setShowCurrencyModal] = useState(false); // pop up for conversion of currency

  const handleDateChange = (date) => {
    setSelectedDate(date.toDateString());
  };

  //allow input value from e and value from currency conversion
  const handleAmountChange = (valueOrEvent) => {
    let inputValue = "";

    if (typeof valueOrEvent === "string") {
      inputValue = valueOrEvent;
    } else if (valueOrEvent && valueOrEvent.target) {
      inputValue = valueOrEvent.target.value || "";
    }

    if (inputValue.startsWith(".")) {
      inputValue = `0${inputValue}`;
    }

    const regex = /^(?!-)\d*(\.\d{0,2})?$/;

    if (regex.test(inputValue) || inputValue === "") {
      setAmount(inputValue);
    }
  };

  const handleCategoryChange = (e) => {
    setCategoryField(e.target.value);
  };

  const handleOpenCategoryModal = () => {
    setShowAddCategoryModal(true);
    console.log("cat open");
  };

  const handleCloseCategoryModal = () => {
    setShowAddCategoryModal(false);
    console.log("cat close");
  };

  useEffect(() => {
    const defaultCategories = ["Food", "Transportation"]; //default categories for all users
    const categoriesRef = ref(database, "expenses-categories");
    //fetch categories from Firebase when the component mounts
    onValue(categoriesRef, (snapshot) => {
      const categoriesData = snapshot.val();
      console.log("category", snapshot.val());
      if (!categoriesData) {
        //add default categories in Firebase if they don't exist
        update(categoriesRef, {
          ...defaultCategories.reduce(
            (acc, category) => ({ ...acc, [category]: true }),
            {}
          ),
        })
          .then(() => {
            console.log("Default categories added to Firebase");
            setCategories(defaultCategories); // Update state with default categories
          })
          .catch((error) => {
            console.error(
              "Error adding default categories to Firebase:",
              error
            );
          });
      } else {
        const categoriesList = Object.keys(categoriesData);
        setCategories(categoriesList); // update state with fetched categorie, including new categories
      }
    });
  }, []);

  // capitalize the first letter of a category
  const capitalizeCategory = (category) => {
    return category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
  };

  const handleOpenCurrencyModal = () => {
    setShowCurrencyModal(true);
    console.log("Currency pop-up: open");
  };

  const handleCloseCurrencyModal = () => {
    setShowCurrencyModal(false);
    console.log("Currency pop-up: close");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const expenseRef = ref(database, "personal-expenses");
    push(expenseRef, {
      selectedDate,
      name,
      amount,
      categoryField,
      note,
    })
      .then(() => {
        console.log("Transaction", {
          selectedDate,
          name,
          amount,
          categoryField,
          note,
        });
        setName("");
        setAmount("");
        setCategoryField("");
        setNote("");
      })
      .catch((error) => {
        console.log("submit personal expenses error", error);
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
          <div>Amount ($):</div>
          <input
            type="number"
            step="0.01"
            min="0.01"
            required
            onChange={(e) => handleAmountChange(e)}
            value={amount}
          />
        </label>
        <br />

        {/* <div>Convert Currency</div> */}
        <button type="button" onClick={handleOpenCurrencyModal}>
          Convert Currency
        </button>

        <label>
          <div>Category:</div>
          <select value={categoryField} onChange={handleCategoryChange}>
            <option value="" disabled>
              Select category
            </option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {/* standardise appearance of text on frontend*/}
                {capitalizeCategory(category)}
              </option>
            ))}
          </select>
        </label>

        <div>Add/Edit Category:</div>
        <button type="button" onClick={handleOpenCategoryModal}>
          Add/Edit Category
        </button>

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
      <br />
      {/* must be outside the form to stop the trigger of "required" */}

      <AddEditCategories
        showAddCategoryModal={showAddCategoryModal}
        categories={categories}
        setCategories={setCategories}
        setCategoryField={setCategoryField}
        capitalizeCategory={capitalizeCategory}
        handleCloseCategoryModal={handleCloseCategoryModal}
      />
      <br />
      <CurrencyConversion
        showCurrencyModal={showCurrencyModal}
        handleCloseCurrencyModal={handleCloseCurrencyModal}
        handleAmountChange={handleAmountChange}
      />
    </div>
  );
}
