import React, { useState } from "react";
import { database } from "../firebase.jsx";
import { ref, update } from "firebase/database";
import "./popup.css";
import { IconButton } from "@mui/material";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import TextField from "@mui/material/TextField";

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

  const handleDelete = (categoryToDelete) => {
    const updatedCategories = categories.filter(
      (category) => category !== categoryToDelete
    );
    setCategories(updatedCategories);
  };

  // const useStyles = makeStyles((theme) => ({
  //   deleteIcon: {
  //     // Add icon styles here
  //     color: "white",
  //   },
  // }));

  //sort category from a - z
  const renderCategories = categories
    .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
    .map((category, index) => (
      <div className="WDelete">
        <li key={index}>
          <IconButton
            className="WDelete"
            onClick={() => handleDelete(category)}
          >
            {capitalizeCategory(category)}
            <ClearRoundedIcon className="WDelete" />
          </IconButton>
        </li>
      </div>
    ));
  // };

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
              placeholder="Add New Category"
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <button className="function" onClick={handleAddCategory}>
              Add
            </button>
            <p> Existing Categories: </p>
            <ul className="category-list">{renderCategories}</ul>
          </div>
        </div>
      )}
    </>
  );
}
