import React, { useState, useEffect, useMemo } from "react";
import { database } from "../firebase";
import { ref, onValue, remove } from "firebase/database";
import ExpensesTotalAmt from "./ExpensesTotalAmt";
import TransactionStats from "./TransactionStats";

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()); // transaction header
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Default to current year
  const [showStats, setShowStats] = useState(false);

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

  console.log("sorted", sortedTransactions);

  // show stats

  const handleOpenShowStats = () => {
    setShowStats(true);
    console.log("stats open");
  };

  const handleCloseShowStats = () => {
    setShowStats(false);
    console.log("stats close");
  };

  return (
    <div>
      <ExpensesTotalAmt
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
      />

      <button className="button" onClick={handleOpenShowStats}>
        Show Stats
      </button>

      <TransactionStats
        showStats={showStats}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        handleCloseShowStats={handleCloseShowStats}
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
          {sortedTransactions.map((transaction) => (
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
