import React, { useEffect, useState } from "react";
import { database } from "../firebase.jsx";
import { ref, onValue } from "firebase/database";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
ChartJS.register(ArcElement, Tooltip, Legend);
import { filterTransactionsByMonthAndYear } from "./utilities.jsx";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";

export default function TransactionStats({
  selectedMonth,
  selectedYear,
  showStats,
  handleCloseShowStats,
}) {
  const [labels, setLabels] = useState([]);
  const [amountByCategory, setAmountByCategory] = useState({});

  useEffect(() => {
    if (showStats) {
      const totalExpenseAmt = ref(database, "personal-expenses");

      //fetch data and calculate total amount for the selected month and year
      onValue(totalExpenseAmt, (snapshot) => {
        const data = snapshot.val();
        if (data) {
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
    }
  }, [selectedMonth, selectedYear, showStats]);

  const options = {
    maintainAspectRatio: false,
  };

  // Prepare data for the pie chart
  const data = {
    labels: labels,
    datasets: [
      {
        label: "Amount ($)",
        data: Object.values(amountByCategory),

        //to change colour during css implementation
        backgroundColor: [
          "rgba(196, 255, 249, 0.6)",
          "rgba(156, 234, 239, 0.6)",
          "rgba(104, 216, 214, 0.6)",
          "rgba(61, 204, 199, 0.6)",
          "rgba(7, 190, 184, 0.6)",
          "rgba(221, 222, 250, 0.6)",
          "rgba(189, 190, 237, 0.6)",
          "rgba(152, 153, 214, 0.6)",
          "rgba(122, 119, 204, 0.6)",
          "rgba(86, 87, 185, 0.6)",
        ],
        borderColor: [
          "rgba(196, 255, 249, 0.6)",
          "rgba(156, 234, 239, 0.6)",
          "rgba(104, 216, 214, 0.6)",
          "rgba(61, 204, 199, 0.6)",
          "rgba(7, 190, 184, 0.6)",
          "rgba(221, 222, 250, 0.6)",
          "rgba(189, 190, 237, 0.6)",
          "rgba(152, 153, 214, 0.6)",
          "rgba(122, 119, 204, 0.6)",
          "rgba(86, 87, 185, 0.6)",
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
        <div className="overlay">
          <div className="popup">
            <button className="close" onClick={handleCloseShowStats}>
              <ClearRoundedIcon className="BDelete" />
            </button>
            <p className="title">
              {new Date(selectedYear, selectedMonth).toLocaleString("default", {
                month: "long",
              })}{" "}
              {selectedYear}
            </p>
            <div className="piechart">
              <Pie data={data} className="piechart" options={options} />
            </div>
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
