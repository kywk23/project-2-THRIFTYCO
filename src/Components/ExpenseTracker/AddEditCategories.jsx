import React, { useState } from "react";
import { database } from "../firebase.jsx";
import { ref, update, remove } from "firebase/database";
import "./popup.css";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";

export default function AddEditCategories({
  showAddCategoryModal,
  categories,
  setCategories,
  setCategoryField,
  capitalizeCategory,
  handleCloseCategoryModal,
}) {
  const [newCategory, setNewCategory] = useState("");

  const handleAddCategory = () => {
    //input validation
    //change the current category to lowercase for comparison
    const lowerCaseCategories = categories.map((category) => category.toLowerCase());
    const categoryExists = lowerCaseCategories.includes(newCategory.trim().toLowerCase());

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

  //allow user to delete categories
  const handleDelete = (categoryToDelete) => {
    const categoryRefToDelete = ref(database, "expenses-categories/" + categoryToDelete);
    remove(categoryRefToDelete)
      .then(() => {
        const updatedCategories = categories.filter((category) => category !== categoryToDelete);
        setCategories(updatedCategories);
        console.log("Category deleted");
      })
      .catch((error) => {
        console.error("Delete category error", error);
      });
  };

  //sort category from a - z
  const renderCategories = categories
    .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
    .map((category, index) => (
      <ul className="category-list">
        <li className="category-list" key={index}>
          <button className="categorybutton" onClick={() => handleDelete(category)}>
            {capitalizeCategory(category)}
            <ClearRoundedIcon className="WDelete" />
          </button>
        </li>
      </ul>
    ));

  return (
    <>
      {showAddCategoryModal && (
        <div className="overlay">
          <div className="popup">
            <div>
              <button className="close" onClick={handleCloseCategoryModal}>
                <ClearRoundedIcon className="BDelete" />
              </button>
            </div>
            <p className="title">Add New Category:</p>
            <input
              className="input"
              placeholder="Add New Category"
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <button className="function" onClick={handleAddCategory}>
              Add
            </button>
            <p className="subtitle"> Existing Categories: </p>
            <ul className="category-list">{renderCategories}</ul>
          </div>
        </div>
      )}
    </>
  );
}
