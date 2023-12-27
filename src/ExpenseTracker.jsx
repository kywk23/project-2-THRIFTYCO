import React from "react";
import ExpenseTrackerForm from "./ExpenseTrackerForm";
import ExpenseTrackerTransaction from "./ExpenseTrackerTransaction";

export default function ExpenseTracker() {
  return (
    <>
      <h1 className="class">Expense Tracker</h1>
      <div className="class">Transaction Form</div>
      <ExpenseTrackerForm />
      <div className="class">Transation List</div>
      <ExpenseTrackerTransaction />
    </>
  );
}
