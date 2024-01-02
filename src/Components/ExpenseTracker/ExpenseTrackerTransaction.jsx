import React, { useEffect, useState, useMemo } from "react";
import { database } from "../firebase";
import { ref, onValue, remove, update } from "firebase/database";

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = () => {
      //ref personal-expenses "folder"
      const transactionsRef = ref(database, "personal-expenses");

      //fetch as and when new data is entered
      onValue(transactionsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const transactionsArray = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setTransactions(transactionsArray);
        } else {
          //reset
          setTransactions([]);
        }
      });
    };

    fetchTransactions();
  }, []);

  //allow user to delete trransaction
  const handleDelete = (id) => {
    const transactionRef = ref(database, `personal-expenses/${id}`);
    remove(transactionRef)
      .then(() => {
        // filter out the deleted transaction from the state
        const updatedTransactions = transactions.filter(
          (transaction) => transaction.id !== id
        );
        setTransactions(updatedTransactions);
        console.log("transaction deleted");
      })
      .catch((error) => {
        console.error("delete personal expenses error", error);
      });
  };

  //useMemo is React's use memory.
  //occurs when the transactions state changes,
  const sortedTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => {
      //latest date to earlist date
      const dateA = new Date(a.selectedDate).getTime();
      const dateB = new Date(b.selectedDate).getTime();
      return dateB - dateA;
    });
  }, [transactions]);

  return (
    <div>
      <ul>
        {sortedTransactions.map((transaction) => (
          <li key={transaction.id}>
            <p>Date: {transaction.selectedDate}</p>
            <p>Name: {transaction.name}</p>
            <p>Amount ($): {transaction.amount}</p>
            <p>Category: {transaction.categoryField}</p>
            <p>Note: {transaction.note}</p>
            <button onClick={() => handleDelete(transaction.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionList;
