import React, { useState, useEffect, useMemo } from "react";
import { database } from "../firebase";
import { ref, onValue, remove } from "firebase/database";
import ExpensesTotalAmt from "./ExpensesTotalAmt";
import TransactionStats from "./TransactionStats";
import { filterTransactionsByMonthAndYear } from "./utilities.jsx";
import "./style.css";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";

//MUI Table Imports
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

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
          const filteredTransactions = filterTransactionsByMonthAndYear(
            data,
            selectedMonth,
            selectedYear
          );
          setTransactions(filteredTransactions);
        } else {
          setTransactions([]);
        }
      });
    };
    fetchTransactions();
  }, [selectedMonth, selectedYear]);
  //dependencies is the month and year

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
      <div className="container">
        <div className="right-column">
          <ExpensesTotalAmt
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
          />

          <TransactionStats
            showStats={showStats}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            handleCloseShowStats={handleCloseShowStats}
          />
          <div className="container-stats">
            <h2>Monthly Transactions</h2>
            <button className="button" onClick={handleOpenShowStats}>
              Show Stats
            </button>
          </div>
          <div className="container-monthly">
            <div>
              <button className="monthly-button" onClick={handlePreviousMonth}>
                {" "}
                <KeyboardArrowLeftIcon className="WDelete" />
              </button>
              <h3>{`${new Date(selectedYear, selectedMonth).toLocaleString(
                "default",
                {
                  month: "long",
                }
              )} ${selectedYear}`}</h3>
              <button className="monthly-button" onClick={handleNextMonth}>
                {" "}
                <KeyboardArrowRightIcon className="WDelete" />
              </button>
            </div>
          </div>
          <div>
            <h2>{`Transactions for ${new Date(
              selectedYear,
              selectedMonth
            ).toLocaleString("default", {
              month: "long",
            })} ${selectedYear}`}</h2>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>DATE</TableCell>
                    <TableCell align="right">TRANSACTION NAME</TableCell>
                    <TableCell align="right">AMOUNT ($)</TableCell>
                    <TableCell align="right">CATERGORY</TableCell>
                    <TableCell align="right">NOTE</TableCell>
                    <TableCell align="right">DELETE</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedTransactions.map((transaction) => (
                    <TableRow
                      key={transaction.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell
                        className="table-font"
                        component="th"
                        scope="row"
                      >
                        {transaction.selectedDate}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {transaction.name}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {transaction.amount}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {transaction.categoryField}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {transaction.note}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        <button
                          className="monthly-button"
                          onClick={() => handleDelete(transaction.id)}
                        >
                          <ClearRoundedIcon className="WDelete" />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionList;
