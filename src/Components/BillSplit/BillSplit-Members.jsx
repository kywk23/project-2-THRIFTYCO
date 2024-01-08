import { useState, useEffect, useRef } from "react";
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
  // const [expensesPerPax, setExpensesPerPax] = useState(0);
  // const [paidByArray, setPaidByArray] = useState([]);
  // const [toGiveArray, setToGiveArray] = useState([]);

  // Balances state
  const [balances, setBalances] = useState([]);

  // Database keys
  const DB_GROUPS_KEY = "all-groups";
  //Adding of Member to group using memberName
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

  useEffect(() => {
    setMembers([]);
    setExpenses([]);
  }, [activeGroup]);

  // const prevMembersRef = useRef([]);

  //useEffect for member and expense addition
  useEffect(() => {
    const memberListRef = ref(database, `${DB_GROUPS_KEY}/${activeGroup}/members`);
    const expensesRef = ref(database, `${DB_GROUPS_KEY}/${activeGroup}/expenses`);

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

        // // Calculate the paidByArray
        // const paidByArray = members.map((member) => {
        //   const totalPaid = expensesArray
        //     .filter((expense) => expense.PaidBy === member.memberName)
        //     .reduce((sum, expense) => sum + Number(expense.Amount), 0);
        //   return { [member.memberName]: totalPaid };
        // });
        // setPaidByArray(paidByArray);
        // console.log(`paid by array`, paidByArray);

        // // Calculate ToGive
        // const toGiveArray = expensesArray.map((expense) => {
        //   const amountPerMember = expense.Amount / members.length;
        //   const fromArray = members
        //     .filter((member) => member.memberName !== expense.PaidBy)
        //     .map((member) => ({ From: member.memberName, Amount: amountPerMember }));
        //   return { To: expense.PaidBy, From: fromArray };
        // });

        // console.log(`toGiveArray`, toGiveArray);
        // setToGiveArray(toGiveArray);
      }
    });
    // Save current members to ref
    // prevMembersRef.current = members;
  }, [activeGroup]);

  const calculateBalances = () => {
    const balanceMap = new Map();

    // Initialize balances
    members.forEach((member) => {
      balanceMap.set(member.memberName, 0);
    });

    // Calculate balances based on expenses
    expenses.forEach((expense) => {
      const amountPerMember = expense.Amount / members.length;
      balanceMap.set(expense.PaidBy, balanceMap.get(expense.PaidBy) - expense.Amount);

      members.forEach((member) => {
        if (member.memberName !== expense.PaidBy) {
          balanceMap.set(member.memberName, balanceMap.get(member.memberName) + amountPerMember);
        }
      });
    });
    // Convert Map to array for rendering
    const calculatedBalances = Array.from(balanceMap.entries()).map(([member, balance]) => ({
      member,
      balance,
    }));
    setBalances(calculatedBalances);
  };

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

  // Find activegroup.expenses
  // For each expenses, paidby: memberName to exclude for -negative balance.
  // paidBy: all other members, to be -balance
  // render: to receive(+) and to pay(owe -)
  // export function thisFunction (){

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
      {/* <h2>To Give List:</h2>
      <ul>
        {toGiveArray.map((toGive, index) => (
          <li key={index}>
            {toGive.To} has to receive:
            <ul>
              {toGive.From.map((from, fromIndex) => (
                <li key={fromIndex}>
                  ${from.Amount} from {from.From}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul> */}
      <button onClick={calculateBalances}>Calculate Balances</button>
      <br />
      <h3>Member Balances:</h3>
      <ul>
        {balances.map((balance, index) => (
          <li key={index}>
            {balance.balance < 0
              ? `${balance.member} should receive $${Math.abs(balance.balance)}`
              : `${balance.member} should pay $${Math.abs(balance.balance)}`}
          </li>
        ))}
      </ul>
    </div>
  );
}
