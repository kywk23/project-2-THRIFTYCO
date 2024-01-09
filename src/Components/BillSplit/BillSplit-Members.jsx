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

  const [totalAmountPaid, setTotalAmountPaid] = useState(0);
  const [averageAmountPaid, setAverageAmountPaid] = useState(0);

  const [paymentTransactions, setPaymentTransactions] = useState([]);

  // Balances state
  const [balances, setBalances] = useState([]);

  // Database keys
  const DB_GROUPS_KEY = "all-groups";
  //Adding of Member to group using memberName
  const handleAddMember = async (e, activeGroup) => {
    if (activeGroup === "") {
      alert(
        "A Group is not selected for adding members.\nPlease select a group first."
      );
      return;
    } else if (memberName === "") {
      alert("Please enter a member name.");
      return;
    }
    e.preventDefault();
    try {
      const memberRef = ref(
        database,
        `${DB_GROUPS_KEY}/${activeGroup}/members`
      );
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
    const memberListRef = ref(
      database,
      `${DB_GROUPS_KEY}/${activeGroup}/members`
    );
    const expensesRef = ref(
      database,
      `${DB_GROUPS_KEY}/${activeGroup}/expenses`
    );

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
        console.log("expensesArray", expensesArray);

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
  }, [activeGroup]);

  //calculate total amount paid, and average of each member

  useEffect(() => {
    let totalPaid = 0;

    // Calculate total amount paid by all members
    expenses.forEach((expense) => {
      totalPaid += Number(expense.Amount);
    });

    setTotalAmountPaid(totalPaid);

    if (members.length > 0) {
      const avgAmountPaid = totalPaid / members.length;
      setAverageAmountPaid(avgAmountPaid);
    }
  }, [expenses, members]);

  const calculateBalances = () => {
    const balanceMap = {};

    // Initialize balances
    members.forEach((member) => {
      balanceMap[member.memberName] = 0; // Start with a balance of zero for each member
    });

    // calculate the actual balance for each member
    expenses.forEach((expense) => {
      const amount = parseFloat(expense.Amount); //conver to num
      balanceMap[expense.PaidBy] += amount; //add in expense to array
      console.log("amount", balanceMap[expense.PaidBy]);
    });

    // adjust the balance based on the average amount each member should pay
    members.forEach((member) => {
      balanceMap[member.memberName] -= averageAmountPaid; // deduct the average amount from each member's expenses
      console.log("amt after average", balanceMap[member.memberName]);
    });

    // set the updated balances
    const calculatedBalances = Object.entries(balanceMap).map(
      ([member, balance]) => ({
        member,
        balance,
      })
    );

    setBalances(calculatedBalances);

    console.log("balance map", balanceMap);
    console.log("exp", expenses);

    // receivers has a positive balance =
    // payers has a negative balance, to pay back to receiver

    const payers = [];
    const receivers = [];

    Object.entries(balanceMap).forEach(([member, balance]) => {
      // receiver
      if (balance > 0) {
        receivers.push({ member, balance });
        //payer
      } else if (balance < 0) {
        payers.push({ member, balance: Math.abs(balance) });
      }
    });

    const transactions = [];

    // Perform transactions between payers and receivers
    payers.forEach((payer) => {
      while (payer.balance > 0) {
        //sort in descending order
        //receiver with the highest positive balance comes first
        receivers.sort((a, b) => b.balance - a.balance);

        //find amount bigger than 0
        const receiver = receivers.find((amt) => amt.balance > 0);

        //receiver amount =< 0
        if (!receiver) break;

        //evaluates payer's balance and receiver's balance and returns the smallest value between them.
        const transferAmount = Math.min(payer.balance, receiver.balance);

        transactions.push({
          from: payer.member,
          to: receiver.member,
          amount: transferAmount,
        });

        payer.balance -= transferAmount;
        receiver.balance -= transferAmount;

        //loop to ensure payer pays receiver till amount = 0.
      }
    });
    setPaymentTransactions(transactions);
    // transactions array will contain the transactions needed to settle debts
    console.log("Payment Transactions:", transactions);
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
      const expenseRef = ref(
        database,
        `${DB_GROUPS_KEY}/${activeGroup}/expenses`
      );
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
            <select
              value={inputPaidBy}
              onChange={(e) => setInputPaidBy(e.target.value)}
            >
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
      {members.length > 0 && activeGroup && (
        <div>
          <h3>Group Expenses:</h3>
          <ul>
            {expenses.map((expense, index) => (
              <li key={expense.id}>
                {expense.Name} - ${expense.Amount}, paid by {expense.PaidBy}
              </li>
            ))}
          </ul>
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
          <p>Total Expenses of the Group: ${totalAmountPaid}</p>
          <p>Average Amount Each Person Has to Pay: ${averageAmountPaid}</p>
          )}
          <br />
          <button onClick={calculateBalances}>Calculate Balances</button>
          <br />
          <h3>Member Balances:</h3>
          <ul>
            {balances.map((balance, index) => (
              <li key={index}>
                {balance.balance < 0
                  ? `${balance.member} should pay $${Math.abs(balance.balance)}`
                  : `${balance.member} should receive $${Math.abs(
                      balance.balance
                    )}`}
              </li>
            ))}
          </ul>
          <br />
          <ul>
            {paymentTransactions.map((transaction, index) => (
              <li key={index}>
                {transaction.from} should pay {transaction.to} $
                {transaction.amount}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
