import { useState } from "react";

export default function CreateGroup() {
  // Group Creation states (TO ADD: multiple groups)
  const [groupName, setGroupName] = useState("");
  const [groupCreated, setGroupCreated] = useState(false);
  //Members states
  const [members, setMembers] = useState([]);
  const [memberName, setMemberName] = useState("");
  //Expense states
  const [expenseName, setExpenseName] = useState("");
  const [inputAmount, setInputAmount] = useState("");
  const [inputPaidBy, setInputPaidBy] = useState("");

  const handleAddGroup = (e) => {
    e.preventDefault();
    console.log(groupName);
    setGroupCreated(true);
  };

  const handleAddMember = () => {
    // if (memberName.trim() !== "") {
    setMembers([...members, memberName]);
    console.log("Members:", members);
    setMemberName("");
  };

  const handleAddExpense = () => {
    console.log("Expense Name:", expenseName);
    console.log("Amount:", inputAmount);
    console.log("Paid By:", inputPaidBy);
    setExpenseName("");
    setInputAmount("");
    setInputPaidBy("");
  };

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
    </div>
  );
}
