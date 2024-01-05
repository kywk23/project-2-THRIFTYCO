import React, { useState } from "react";
import { database } from "../firebase.jsx";
import { ref, update } from "firebase/database";

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

  //sort category from a - z
  const renderCategories = categories
    .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
    .map((category, index) => (
      <li key={index}>
        {capitalizeCategory(category)}
        <button className="delete" onClick={() => handleDelete(category)}>
          Delete
        </button>
      </li>
    ));
  // };

  return (
    <>
      {showAddCategoryModal && (
        <div className="modal-background">
          <div className="modal-content">
            <button className="close" onClick={handleCloseCategoryModal}>
              Close
            </button>
            <h2>Add/Edit New Category</h2>
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Enter new category"
            />
            <button onClick={handleAddCategory}>Add</button>
            <p> Existing Categories: </p>
            <ul>{renderCategories}</ul>
          </div>
        </div>
      )}
    </>
  );
}
