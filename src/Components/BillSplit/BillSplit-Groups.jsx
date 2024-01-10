import { useEffect, useState } from "react";
import { onValue, ref, push } from "firebase/database";
import { database } from "../firebase";
import BillSplitMembers from "./BillSplit-Members";
import { useAuthContext } from "../Hooks/useAuthContext";

export default function BillSplitGroups() {
  // Group Creation states
  const [groupName, setGroupName] = useState("");
  const [activeGroup, setActiveGroup] = useState("");
  const [groupList, setGroupList] = useState([]);

  // Database keys
  const DB_GROUPS_KEY = "all-groups";
  //Hooks
  const { user } = useAuthContext();

  const handleAddGroup = async (e) => {
    e.preventDefault();
    try {
      const groupListRef = ref(database, DB_GROUPS_KEY);
      const snapshot = await push(groupListRef, {
        groupName: groupName,
      });
      setActiveGroup(snapshot.key);
    } catch (error) {
      console.error("Error adding group:", error.message);
    }
    setGroupName("");
  };

  useEffect(() => {
    const groupListRef = ref(database, DB_GROUPS_KEY);
    onValue(groupListRef, (snapshot) => {
      const groupsData = snapshot.val();
      if (groupsData) {
        const groupsArray = Object.keys(groupsData).map((key) => ({
          id: key,
          name: groupsData[key].groupName,
        }));
        setGroupList(groupsArray);
      }
    });
  }, [activeGroup]);

  return (
    <div>
      {/* Group Creation */}
      <div className="container">
        <div className="left-column">
          {user && (
            <>
              <h2>Create Group</h2>
              <input
                type="text"
                value={groupName}
                placeholder="Group Name"
                onChange={(e) => setGroupName(e.target.value)}
              />
              <button onClick={handleAddGroup}>Create Group</button>
            </>
          )}
          <br />
          <br />
          {/* Created Groups */}
          <h2>Available Groups:</h2>
          <ul>
            {groupList.map((group) => (
              <li key={group.id}>{group.name}</li>
            ))}
          </ul>
          <br />
          {/* Active Group Selector*/}
          <div style={{ display: "flex", alignItems: "center" }}>
            <h2>Select Group: </h2>
            <select value={activeGroup} onChange={(e) => setActiveGroup(e.target.value)}>
              <option value="">Select</option>
              {groupList.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      {/* <div className="right-column"> */}
      <BillSplitMembers activeGroup={activeGroup} />
      {/* </div> */}
    </div>
  );
}
