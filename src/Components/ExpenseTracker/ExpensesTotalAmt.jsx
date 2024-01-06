import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../firebase.jsx";
import { filterTransactionsByMonthAndYear } from "./utilities.js";

export default function ExpensesTotalAmt({ selectedMonth, selectedYear }) {
  const [totalAmount, setTotalAmount] = useState(0); // State for total amount

  useEffect(() => {
    const totalExpenseAmt = ref(database, "personal-expenses");

    //fetch data and calculate total amount for the selected month and year
    onValue(totalExpenseAmt, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const transactionsArray = Object.values(data);
        console.log("transaction amt", Object.values(data));
        //filter transactions for the selected month and year

        const filteredTransactions = filterTransactionsByMonthAndYear(
          data,
          selectedMonth,
          selectedYear
        );

        // const filteredTransactions = transactionsArray.filter((transaction) => {
        //   const transactionMonth = new Date(
        //     transaction.selectedDate
        //   ).getMonth();
        //   const transactionYear = new Date(
        //     transaction.selectedDate
        //   ).getFullYear();
        //   return (
        //     transactionMonth === selectedMonth &&
        //     transactionYear === selectedYear
        //   );
        // });

        // Calculate total amount for the selected month and year
        const total = filteredTransactions.reduce(
          (acc, transaction) => acc + Number(transaction.amount),
          0
        );

        setTotalAmount(total);
        console.log("total amt:", total);
      } else {
        setTotalAmount(0); //when selected month's array is empty
      }
    });
  }, [selectedMonth, selectedYear]);

  return (
    <div>
      <p>
        Total Expenses for{" "}
        {new Date(selectedYear, selectedMonth).toLocaleString("default", {
          month: "long",
        })}{" "}
        {selectedYear}: ${totalAmount.toFixed(2)}
      </p>
    </div>
  );
}
