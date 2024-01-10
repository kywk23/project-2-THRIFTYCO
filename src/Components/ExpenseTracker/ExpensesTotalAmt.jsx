import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../firebase.jsx";
import { filterTransactionsByMonthAndYear } from "./utilities.jsx";

//Auth - check user's UID
import useAuthUID from "../Hooks/useAuthUID";

export default function ExpensesTotalAmt({ selectedMonth, selectedYear }) {
  const [totalAmount, setTotalAmount] = useState(0); // State for total amount

  const userUID = useAuthUID();

  useEffect(() => {
    const totalExpenseAmt = ref(database, "personal-expenses");

    //fetch data and calculate total amount for the selected month and year
    onValue(totalExpenseAmt, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        //import - filter transactions for the selected month and year

        const filteredTransactions = filterTransactionsByMonthAndYear(
          data,
          selectedMonth,
          selectedYear,
          userUID
        );

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
  }, [selectedMonth, selectedYear, userUID]);

  return (
    <div>
      <h2>
        Total Expenses for{" "}
        {new Date(selectedYear, selectedMonth).toLocaleString("default", {
          month: "long",
        })}{" "}
        {selectedYear}: ${totalAmount.toFixed(2)}
      </h2>
    </div>
  );
}
