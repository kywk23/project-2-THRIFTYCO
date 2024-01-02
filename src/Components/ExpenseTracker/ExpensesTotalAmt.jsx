import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../firebase.jsx";

export default function ExpensesTotalAmt() {
  const [totalAmount, setTotalAmount] = useState(0); // State for total amount

  useEffect(() => {
    const totalExpenseAmt = ref(database, "personal-expenses");

    //fetch data and calculate total amount
    onValue(totalExpenseAmt, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const transactionsArray = Object.values(data);

        //calculate total amount
        const total = transactionsArray.reduce(
          //set amount to number
          (acc, transaction) => acc + Number(transaction.amount),
          0
        );
        setTotalAmount(total);
      } else {
        setTotalAmount(0);
      }
    });
  }, []);

  return (
    <div>
      <p>Total Expenses: ${totalAmount}</p>
    </div>
  );
}
