import { useState } from "react";

export default function CreateGroup() {
  // Group Creation states (TO ADD: multiple groups)
  const [groupName, setGroupName] = useState("");
  const [groupCreated, setGroupCreated] = useState(false);
  //Members states
  const [members, setMembers] = useState([]);
  const [memberName, setMemberName] = useState("");
  //Expense states
  const [expenses, setExpenses] = useState([]);
  const [expenseName, setExpenseName] = useState("");
  const [inputAmount, setInputAmount] = useState("");
  const [inputPaidBy, setInputPaidBy] = useState("");

  const handleAddGroup = (e) => {
    e.preventDefault();
    console.log(groupName);
    setGroupCreated(true);
  };

  const handleAddMember = () => {
    setMembers([...members, memberName]);
    console.log("Members:", members);
    setMemberName("");
  };

  const handleAddExpense = () => {
    console.log("Expense Name:", expenseName);
    console.log("Amount:", inputAmount);
    console.log("Paid By:", inputPaidBy);
    const newExpense = {
      Name: expenseName,
      Amount: inputAmount,
      PaidBy: inputPaidBy,
    };
    setExpenses([...expenses, newExpense]);
    setExpenseName("");
    setInputAmount("");
    setInputPaidBy("");
    pricePerPax();
    console.log(pricePerPax());
  };

  const pricePerPax = () => {
    const totalAmount = expenses.reduce((a, b) => a + b.Amount, 0);
    const numberOfMembers = members.length;
    const pricePerPax = totalAmount / numberOfMembers;
    return pricePerPax;
  };

  // put to RTDB
  // 1) render total (inputAmount) by respective paidBy

  //  function splitBill(users, expenses)
  //   // users is an array of user objects with name and balance properties
  //   // expenses is an array of expense objects with name, amount, paidBy and splitBy properties
  //   // update the balance of each user based on the expenses
  //   for each expense in expenses
  //     let payer = expense.paidBy
  //     let amount = expense.amount
  //     let receivers = expense.splitBy
  //     let share = amount / receivers.length
  //     for each receiver in receivers
  //       if receiver is not payer
  //         receiver.balance -= share
  //         payer.balance += share
  //   // find the minimum number of transactions to settle the debts
  //   let transactions = []
  //   while users have non-zero balances
  //     let maxCreditor = user with maximum positive balance
  //     let maxDebtor = user with maximum negative balance
  //     let minAmount = minimum of maxCreditor.balance and -maxDebtor.balance
  //     maxDebtor.balance += minAmount
  //     maxCreditor.balance -= minAmount
  //     add a transaction from maxDebtor to maxCreditor with minAmount to transactions
  //   return transactions

  // Smallest num in paidBy, will pay other users;
  // paying amount =
  return (
    <div>
      {/* Group Creation */}
      <h1>Create Group</h1>
      <label>
        Group Name:
        <input
          type="text"
          value={groupName}
          placeholder="Group Name"
          onChange={(e) => setGroupName(e.target.value)}
        />
      </label>
      <button onClick={handleAddGroup}>Create Group</button>
      <br />
      {/* Group Rendering if True and Members Addition */}
      {groupCreated && (
        <div>
          <h2>Group Name: {groupName}</h2>
          <label>
            Members:
            <input
              type="text"
              value={memberName}
              placeholder="Add Members here"
              onChange={(e) => setMemberName(e.target.value)}
            />
            <button type="button" onClick={handleAddMember}>
              Add Member
            </button>
          </label>
          <ul>
            {members.map((member, index) => (
              <li key={index}>{member}</li>
            ))}
          </ul>
          {/* Expense Addition */}
          <form>
            <label>
              Expenses:
              <input
                type="text"
                required
                value={expenseName}
                placeholder="Expense Name"
                onChange={(e) => setExpenseName(e.target.value)}
              />
            </label>
            <br />
            <label>
              Amount:
              <input
                type="number"
                step="0.01" //increament
                min="0.01" //minimal amount
                required
                value={inputAmount}
                placeholder="Amount"
                onChange={(e) => setInputAmount(e.target.value)}
              />
            </label>
            <br />
            <label>
              Paid By:
              <select value={inputPaidBy} onChange={(e) => setInputPaidBy(e.target.value)}>
                <option value="">Select</option>
                {members.map((member) => (
                  <option key={member} value={member}>
                    {member}
                  </option>
                ))}
              </select>
            </label>
            <button type="button" onClick={handleAddExpense}>
              Add Expense
            </button>
          </form>
        </div>
      )}
      <br />
      Group Expenses:
      <ul>
        {expenses.map((expense, index) => (
          <li key={index}>
            {expense.Name} - ${expense.Amount}, paid by {expense.PaidBy}
          </li>
        ))}
      </ul>
      <br />
      Balances:
    </div>
  );
}
