import { useState, useEffect } from "react";
import { database } from "../firebase";
import { onValue, ref, push } from "firebase/database";

export default function BillSplitMembers({ activeGroup }) {
  //Members states
  const [members, setMembers] = useState([]);
  const [memberName, setMemberName] = useState("");
  const [memberSnapShotKey, setMemberSnapShotKey] = useState("");

  // //Expense states
  const [expenses, setExpenses] = useState([]);
  const [expenseName, setExpenseName] = useState("");
  const [inputAmount, setInputAmount] = useState("");
  const [inputPaidBy, setInputPaidBy] = useState("");
  const [expensesPerPax, setExpensesPerPax] = useState(0);
  const [balances, setBalances] = useState({});

  // Database keys
  const DB_GROUPS_KEY = "all-groups";

  const handleAddMember = async (e, activeGroup) => {
    if (activeGroup === "") {
      alert("A Group is not selected for adding members.\nPlease select a group first.");
      return;
    } else if (memberName === "") {
      alert("Please enter a member name.");
      return;
    }
    e.preventDefault();
    try {
      const memberRef = ref(database, `${DB_GROUPS_KEY}/${activeGroup}/members`);
      const newMemberRef = await push(memberRef, {
        memberName: memberName,
      });
      setMemberSnapShotKey(newMemberRef.key);
    } catch (error) {
      console.error(error.message);
    }
    setMemberName("");
  };

  //useEffect for member addition
  useEffect(() => {
    setMembers([]);
    setExpenses([]);

    const memberListRef = ref(database, `${DB_GROUPS_KEY}/${activeGroup}/members`);
    onValue(memberListRef, (snapshot) => {
      const membersData = snapshot.val();
      if (membersData) {
        const membersArray = Object.keys(membersData).map((key) => ({
          id: key,
          memberName: membersData[key].memberName,
        }));
        setMembers(membersArray);
      }
    });
    const expensesRef = ref(database, `${DB_GROUPS_KEY}/${activeGroup}/expenses`);
    onValue(expensesRef, (snapshot) => {
      const expensesData = snapshot.val();
      if (expensesData) {
        const expensesArray = Object.keys(expensesData).map((key) => ({
          id: key,
          Name: expensesData[key].Name,
          Amount: expensesData[key].Amount,
          PaidBy: expensesData[key].PaidBy,
        }));
        setExpenses(expensesArray);
      }
    });
  }, [activeGroup]);

  const handleAddExpense = async (e, activeGroup) => {
    e.preventDefault();
    const newExpense = {
      Name: expenseName,
      Amount: inputAmount,
      PaidBy: inputPaidBy,
    };
    try {
      setExpenses([...expenses, newExpense]);
      const expenseRef = ref(database, `${DB_GROUPS_KEY}/${activeGroup}/expenses`);
      const newExpenseRef = await push(expenseRef, newExpense);
    } catch (error) {
      console.error(error.message);
    }
    setExpenseName("");
    setInputAmount("");
    setInputPaidBy("");
  };

  useEffect(() => {
    const expenseAmounts = expenses.map((expense) => Number(expense.Amount));
    //  const activeMembers
    const numOfMembersOfActiveGroup = members.length;
    const totalExpenseAmount = expenseAmounts.reduce((a, b) => a + b, 0);
    const expensesPerPaxValue = totalExpenseAmount / numOfMembersOfActiveGroup;
    setExpensesPerPax(expensesPerPaxValue);
    console.log(`expense per pax`, expensesPerPax);
    console.log(`ttl expense amt`, totalExpenseAmount);
    console.log(expenses.length);
  }, [expenses, members]);

  // useEffect(() => {
  //   const expenseAmounts = expenses.map((expense) => expense.Amount);
  //   console.log(`Expense Amounts:`, expenseAmounts);
  //   const numOfMembersOfActiveGroup = members.length;
  //   console.log(`Number of members of active group:`, numOfMembersOfActiveGroup);
  //   const expensesPerPax = expenseAmounts.reduce((a, b) => a + b, 0) / numOfMembersOfActiveGroup;
  // }, [activeGroup]);

  // Find activegroup.expenses
  // For each expenses, paidby: memberName to exclude for -negative balance.
  // paidBy: all other members, to be -balance
  // render: to receive(+) and to pay(owe -)
  // export function thisFunction (){

  //

  return (
    <div>
      <label>
        Members:
        <input
          type="text"
          value={memberName}
          placeholder="Add Members here"
          onChange={(e) => setMemberName(e.target.value)}
        />
        <button type="button" onClick={(e) => handleAddMember(e, activeGroup)}>
          Add Member
        </button>
      </label>
      {/* Members rendering based on active group */}
      <h2>Members:</h2>
      <ul>
        {members.map((member) => (
          <li key={member.id}>{member.memberName}</li>
        ))}
      </ul>
      {/* Expense Addition */}
      {members.length > 0 && activeGroup && (
        <form onSubmit={(e) => handleAddExpense(e, activeGroup)}>
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
                <option key={member.id} value={member.memberName}>
                  {member.memberName}
                </option>
              ))}
            </select>
          </label>
          <button type="submit">Add Expense</button>
        </form>
      )}
      <br />
      <h3>Group Expenses:</h3>
      <ul>
        {expenses.map((expense, index) => (
          <li key={expense.id}>
            {expense.Name} - ${expense.Amount}, paid by {expense.PaidBy}
          </li>
        ))}
      </ul>
      <br />
      <h3> Balances: </h3>
      Expenses Per Pax: ${expensesPerPax.toFixed(2)}
      <br />
    </div>
  );
}
