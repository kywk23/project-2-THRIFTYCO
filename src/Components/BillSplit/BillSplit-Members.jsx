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

  useEffect(() => {
    console.log(`Curent active group:`, activeGroup);
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
  }, [activeGroup]);

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
  };

  // console.error("No active group selected.");

  // if (activeGroup && memberSnapShotKey) {
  //   const memberRef = ref(
  //     database,
  //     `${DB_GROUPS_KEY}/${activeGroup}/members/${memberSnapShotKey}`
  //   );
  //   console.log(`member snapshot key:`, memberSnapShotKey);
  //   onValue(memberRef, (snapshot) => {
  //     const membersData = snapshot.val();
  //     console.log(membersData);
  //     if (membersData) {
  //       // const membersArray = Object.keys(membersData).map((key) => ({
  //       //   id: key,
  //       //   name: membersData[key].memberName,
  //       // }));
  //       setMembers((prevMembers) => [...prevMembers, { memberName: membersData.memberName }]);
  //     } else {
  //       setMembers([]);
  //     }
  //   });
  // } else {
  //   setMembers([]);
  // }

  // const pricePerPax = () => {
  //   const totalAmount = expenses.reduce((a, b) => a + b.Amount, 0);
  //   const numberOfMembers = members.length;
  //   const pricePerPax = totalAmount / numberOfMembers;
  //   return pricePerPax;
  // };

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

      <ul>
        {members.map((member) => (
          <li key={member.id}>{member.memberName}</li>
        ))}
      </ul>

      {/* Expense Addition */}
      {/* <form onSubmit={handleAddExpense}>
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
      </form> */}
      <br />
      {/* Group Expenses:
      <ul>
        {expenses.map((expense, index) => (
          <li key={expense.id}>
            {expense.Name} - ${expense.Amount}, paid by {expense.PaidBy}
          </li>
        ))}
      </ul> */}
      <br />
      {/* Balances: */}
    </div>
  );
}
