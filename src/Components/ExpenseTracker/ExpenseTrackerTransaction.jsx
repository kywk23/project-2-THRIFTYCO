import React, { useState, useEffect } from "react";
import { database } from "../firebase";
import { ref, onValue, remove } from "firebase/database";
import ExpensesTotalAmt from "./ExpensesTotalAmt";

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()); // transaction header
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Default to current year

  useEffect(() => {
    const fetchTransactions = () => {
      const transactionsRef = ref(database, "personal-expenses");

      onValue(transactionsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const transactionsArray = Object.keys(data)
            .map((key) => ({
              id: key,
              ...data[key],
            }))
            //display month transaction based on selected month
            //extract based on RT firebase expenses selected Date
            .filter((transaction) => {
              const transactionMonth = new Date(
                transaction.selectedDate
              ).getMonth();
              const transactionYear = new Date(
                transaction.selectedDate
              ).getFullYear();
              //extract data based on selected month/year
              return (
                selectedMonth === transactionMonth &&
                selectedYear === transactionYear
              );
            });
          setTransactions(transactionsArray); /// set the filtered transactions to state
        } else {
          setTransactions([]);
        }
      });
    };

    fetchTransactions();
  }, [selectedMonth, selectedYear]); //dependencies is the monthly

  //.getMonth is 0 indexed. Jan - Dec = index 0 to 11

  const handlePreviousMonth = () => {
    setSelectedMonth((prevMonth) => {
      const newMonth = prevMonth === 0 ? 11 : prevMonth - 1;
      if (newMonth === 11) {
        setSelectedYear((prevYear) => prevYear - 1);
      }
      return newMonth;
    });
  };

  const handleNextMonth = () => {
    setSelectedMonth((prevMonth) => {
      const newMonth = prevMonth === 11 ? 0 : prevMonth + 1;
      if (newMonth === 0) {
        setSelectedYear((prevYear) => prevYear + 1);
      }
      return newMonth;
    });
  };

  const handleDelete = (id) => {
    const transactionRef = ref(database, `personal-expenses/${id}`);
    remove(transactionRef)
      .then(() => {
        const updatedTransactions = transactions.filter(
          (transaction) => transaction.id !== id
        );
        setTransactions(updatedTransactions);
        console.log("Transaction deleted");
      })
      .catch((error) => {
        console.error("Delete personal expenses error", error);
      });
  };

  return (
    <div>
      <ExpensesTotalAmt
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
      />
      <h2>Monthly Transactions</h2>
      <div>
        <button onClick={handlePreviousMonth}>Previous Month</button>
        <h3>{`${new Date(selectedYear, selectedMonth).toLocaleString(
          "default",
          {
            month: "long",
          }
        )} ${selectedYear}`}</h3>
        <button onClick={handleNextMonth}>Next Month</button>
      </div>
      <div>
        <h3>{`Transactions for ${new Date(
          selectedYear,
          selectedMonth
        ).toLocaleString("default", {
          month: "long",
        })} ${selectedYear}`}</h3>
        <ul>
          {transactions.map((transaction) => (
            <li key={transaction.id}>
              <p>Date: {transaction.selectedDate}</p>
              <p>Name: {transaction.name}</p>
              <p>Amount ($): {transaction.amount}</p>
              <p>Category: {transaction.categoryField}</p>
              <p>Note: {transaction.note}</p>
              <button onClick={() => handleDelete(transaction.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TransactionList;
