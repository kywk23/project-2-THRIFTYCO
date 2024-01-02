import React, { useState, useEffect } from "react";
import { database } from "../firebase.jsx";
import { ref, push, update, onValue } from "firebase/database";

// npm package: date picker
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";

export default function ExpenseTrackerForm() {
  const [name, setName] = useState(""); // input transaction name
  const [amount, setAmount] = useState(""); // input number
  const [note, setNote] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toDateString());
  const [categoryField, setCategoryField] = useState(""); // Items in the category label
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState(""); // add new category

  const handleDateChange = (date) => {
    setSelectedDate(date.toDateString());
  };

  const handleAmountChange = (e) => {
    let inputValue = e.target.value;

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

  const handleAddCategory = () => {
    //input validation
    //change the current category to lowercase for comparison
    const lowerCaseCategories = categories.map((category) =>
      category.toLowerCase()
    );
    const categoryExists = lowerCaseCategories.includes(
      newCategory.trim().toLowerCase()
    );

    //do now allow users to add category if new category is empty or already exists
    if (newCategory.trim() !== "" && !categoryExists) {
      const categoriesRef = ref(database, "expenses-categories");
      const newCategoryData = {};
      newCategoryData[newCategory] = true;

      update(categoriesRef, newCategoryData)
        .then(() => {
          console.log("New category added to Firebase:", newCategory);
          setCategories([...categories, newCategory]); // Update state with new category
          setCategoryField(newCategory);
          setNewCategory("");
        })
        .catch((error) => {
          console.error("Error adding new category to Firebase:", error);
        });
    } else console.log("category is empty or already exists.");
  };

  useEffect(() => {
    const categoriesRef = ref(database, "expenses-categories");
    const defaultCategories = ["Food", "Bills", "Transportation"]; //default categories for all users

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
        <label>
          <div>Category:</div>
          <select value={categoryField} onChange={handleCategoryChange}>
            <option value="" disabled>
              Select category
            </option>
            {categories.map((cat, index) => (
              <option key={index} value={cat}>
                {/* standardise appearance of text on frontend*/}
                {cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
        </label>
        <label>
          <div>Add New Category:</div>
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Enter new category"
          />
          <button type="button" onClick={handleAddCategory}>
            Add Category
          </button>
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
