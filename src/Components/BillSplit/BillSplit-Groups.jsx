import { useEffect, useState } from "react";
import { onValue, ref, push } from "firebase/database";
import { database } from "../firebase";
import BillSplitMembers from "./BillSplit-Members";
import { useAuthContext } from "../Hooks/useAuthContext";

//Auth - check user's UID
import useAuthUID from "../Hooks/useAuthUID";

export default function BillSplitGroups() {
  // Group Creation states
  const [groupName, setGroupName] = useState("");
  const [activeGroup, setActiveGroup] = useState("");
  const [groupList, setGroupList] = useState([]);

  const userUID = useAuthUID();

  // Database keys
  const DB_GROUPS_KEY = `all-groups/${userUID}/`;
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
  }, [activeGroup, DB_GROUPS_KEY]);

  return (
    <div>
      {/* Group Creation */}
      <div className="container">
        <div className="left-column">
          <>
            <h2>Create Group</h2>
            <input
              type="text"
              style={{ fontSize: "1em" }}
              value={groupName}
              placeholder="Group Name"
              onChange={(e) => setGroupName(e.target.value)}
            />
            <button onClick={handleAddGroup}>Create Group</button>
          </>

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
      <BillSplitMembers activeGroup={activeGroup} />
    </div>
  );
}
