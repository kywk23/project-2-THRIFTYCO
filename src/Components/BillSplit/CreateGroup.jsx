import { useEffect, useState } from "react";
import { onValue } from "firebase/database";
import { database } from "../firebase";
import { ref, push } from "firebase/database";

export default function CreateGroup() {
  // Group Creation states (TO ADD: multiple groups)
  const [groupName, setGroupName] = useState("");
  const [groupCreated, setGroupCreated] = useState(false);
  const [activeGroup, setActiveGroup] = useState(null);
  const [groupList, setGroupList] = useState([]);
  const [currentGroupSnapShotKey, setCurrentGroupSnapShotKey] = useState(null);
  //Members states
  const [members, setMembers] = useState([]);
  const [memberName, setMemberName] = useState("");
  //Expense states
  const [expenses, setExpenses] = useState([]);
  const [expenseName, setExpenseName] = useState("");
  const [inputAmount, setInputAmount] = useState("");
  const [inputPaidBy, setInputPaidBy] = useState("");

  const DB_GROUPS_KEY = "all-groups";

  const handleAddGroup = () => {
    const newGroup = {
      name: groupName,
    };
    setGroupList((prevGroupList) => [...prevGroupList, newGroup]);
    setGroupName("");
    setGroupCreated(true);
    const groupListRef = ref(database, DB_GROUPS_KEY);
    const newGroupRef = push(groupListRef, {
      groupName: groupName,
    }).then((snapshot) => {
      console.log(snapshot.key);
      setCurrentGroupSnapShotKey(snapshot.key);
      setActiveGroup(snapshot.key);
    });
  };

  useEffect(() => {
    console.log(activeGroup);
    const groupListRef = ref(database, DB_GROUPS_KEY);
    onValue(groupListRef, (snapshot) => {
      const groupsData = snapshot.val();
      if (groupsData) {
        const groupsArray = Object.keys(groupsData).map((key) => ({
          id: key,
          name: groupsData[key].groupName,
        }));
        setGroupList(groupsArray);
      } else {
        setGroupList([]);
      }
    });
  }, [activeGroup]);

  const handleAddMember = () => {
    if (activeGroup) {
      const memberRef = ref(database, `${DB_GROUPS_KEY}/${activeGroup}/members`);
      const newMemberRef = push(memberRef, {
        member: memberName,
      })
        .then(() => {
          setMembers((prevMembers) => [...prevMembers, memberName]);
          setMemberName("");
          console.log(members);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      console.error("No active group selected.");
    }
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

  // obc = {A: 100, B: 200, C: 300}
  // function splitTheBill(obj) {
  //   var total = 0;
  //   Object.keys(obj).forEach(function (key) {
  //     total += obj[key];
  //   });

  //   var average = total / Object.keys(obj).length;

  //   var result = {};
  //   Object.keys(obj).forEach(function (key) {
  //     result[key] = average - obj[key];
  //   });

  //   return result; -100, 0, 100
  // }

  return (
    <div>
      {/* Created Groups */}
      <h1>Recent Groups:</h1>
      <ul>
        {groupList.map((group) => (
          <li key={group.id}>{group.name}</li>
        ))}
      </ul>
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
      <h2>
        Active Group:{" "}
        <select value={activeGroup} onChange={(e) => setActiveGroup(e.target.value)}>
          <option value="">Select</option>
          {groupList.map((group) => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </select>
      </h2>
      {/* Group Rendering if True and Members Addition */}
      {activeGroup !== null && (
        <div>
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
          {/* Group Rendering if True and Members Addition */}
          <ul>
            {members
              .filter((member) => member.groupKey === currentGroupSnapShotKey)
              .map((member, index) => (
                <li key={index}>{member.memberName}</li>
              ))}
          </ul>

          {/* Expense Addition */}
          <form onSubmit={handleAddExpense}>
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
        </div>
      )}
      <br />
      Group Expenses:
      <ul>
        {expenses.map((expense, index) => (
          <li key={expense.id}>
            {expense.Name} - ${expense.Amount}, paid by {expense.PaidBy}
          </li>
        ))}
      </ul>
      <br />
      Balances:
    </div>
  );
}
