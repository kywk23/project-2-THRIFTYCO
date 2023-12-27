import React, { useEffect, useState } from "react";
import { database } from "./Components/firebase";
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

  return (
    <div>
      <h2>Transaction List</h2>
      <ul>
        {transactions.map((transaction) => (
          <li key={transaction.id}>
            <p>Date: {transaction.selectedDate}</p>
            <p>Name: {transaction.name}</p>
            <p>Amount: {transaction.amount}</p>
            <p>Category: {transaction.category}</p>
            <p>Note: {transaction.note}</p>
            <button onClick={() => handleDelete(transaction.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionList;
