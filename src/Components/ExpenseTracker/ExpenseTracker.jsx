import React from "react";
import ExpenseTrackerForm from "./ExpenseTrackerForm";
import ExpenseTrackerTransaction from "./ExpenseTrackerTransaction";

export default function ExpenseTracker() {
  return (
    <>
      <ExpenseTrackerForm />
      <br />
      <ExpenseTrackerTransaction />
    </>
  );
}
