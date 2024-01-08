//do not edit.

const filterTransactionsByMonthAndYear = (
  data,
  selectedMonth,
  selectedYear
) => {
  if (!data) return [];

  //to import key along with data, for the delete function in the list of transaction
  const transactionsArray = Object.keys(data).map((key) => ({
    id: key,
    ...data[key],
  }));

  console.log("refactor function by mth/year:", Object.values(data));

  return transactionsArray.filter((transaction) => {
    const transactionMonth = new Date(transaction.selectedDate).getMonth();
    const transactionYear = new Date(transaction.selectedDate).getFullYear();
    return (
      selectedMonth === transactionMonth && selectedYear === transactionYear
    );
  });
};

export { filterTransactionsByMonthAndYear };
