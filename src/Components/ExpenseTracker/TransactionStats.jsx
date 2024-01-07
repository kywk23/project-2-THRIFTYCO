import React, { useEffect, useState } from "react";
import { database } from "../firebase.jsx";
import { ref, onValue } from "firebase/database";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
ChartJS.register(ArcElement, Tooltip, Legend);
import { filterTransactionsByMonthAndYear } from "./utilities.jsx";

export default function TransactionStats({
  selectedMonth,
  selectedYear,
  showStats,
  handleCloseShowStats,
}) {
  const [labels, setLabels] = useState([]);
  const [amountByCategory, setAmountByCategory] = useState({});

  useEffect(() => {
    const totalExpenseAmt = ref(database, "personal-expenses");

    //fetch data and calculate total amount for the selected month and year
    onValue(totalExpenseAmt, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // const transactionsArray = Object.values(data);
        // console.log("transaction amt", Object.values(data));
        //filter transactions for the selected month and year
        //import filter
        const filteredTransactions = filterTransactionsByMonthAndYear(
          data,
          selectedMonth,
          selectedYear
        );

        // Calculate total amount for the categories
        // use hashmap to count amount per category

        const amountPerCategory = {}; //

        filteredTransactions.forEach((transaction) => {
          const category = transaction.categoryField;

          // If category exists in the object, add the transaction amount to its total
          if (amountPerCategory[category]) {
            amountPerCategory[category] += Number(transaction.amount);
          } else {
            // If category doesn't exist, initialize the total for that category
            amountPerCategory[category] = Number(transaction.amount);
          }
        });

        setAmountByCategory(amountPerCategory);
        console.log("amountPERcat", amountPerCategory);

        // Extract category labels from the object keys
        const categories = Object.keys(amountPerCategory);
        setLabels(categories);
        console.log("cat", categories);
      } else {
        // no data for the selected month and year
        setAmountByCategory({});
        setLabels([]);
      }
    });
  }, [selectedMonth, selectedYear]);

  // Prepare data for the pie chart
  const data = {
    labels: labels,
    datasets: [
      {
        label: "Amount",
        data: Object.values(amountByCategory),

        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };
  console.log("amount by cat", amountByCategory);
  console.log("labels", labels);

  return (
    <div>
      {showStats && (
        <div>
          <h2>Transaction Stats</h2>
          <button className="button" onClick={handleCloseShowStats}>
            Close
          </button>
          <div style={{ height: "400px", width: "400px" }}>
            <Pie data={data} />
          </div>
        </div>
      )}
    </div>
  );
}

//Logic
//import transaction details
//import pie chart data
//extract monthly transaction data
//extract labels used
//extract total amount per label
//data must follow the same arrangement.
//eg. red is 9, blue is 2.
//labels - [red, blue]
//data - [9, 12]
//update pie chart's label and data set with RT database
//return pie chart
