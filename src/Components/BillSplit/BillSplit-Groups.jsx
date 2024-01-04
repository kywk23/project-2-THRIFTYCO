import { useEffect, useState } from "react";
import { onValue, ref, push } from "firebase/database";
import { database } from "../firebase";

export default function BillSplitGroups() {
  // Group Creation states
  const [groupName, setGroupName] = useState("");
  const [activeGroup, setActiveGroup] = useState("");
  const [groupList, setGroupList] = useState([]);
  const [currentGroupSnapShotKey, setCurrentGroupSnapShotKey] = useState(null);

  const DB_GROUPS_KEY = "all-groups";

  const handleAddGroup = async (e) => {
    e.preventDefault();
    try {
      const groupListRef = ref(database, DB_GROUPS_KEY);
      const snapshot = await push(groupListRef, {
        groupName: groupName,
      });
      setCurrentGroupSnapShotKey(snapshot.key);
      setActiveGroup(snapshot.key);
      setGroupName("");
    } catch (error) {
      console.error("Error adding group:", error.message);
    }
  };

  useEffect(() => {
    const groupListRef = ref(database, DB_GROUPS_KEY);
    onValue(groupListRef, (snapshot) => {
      const groupsData = snapshot.val();
      console.log(`Groups Data:`, groupsData);
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
      {/* Created Groups */}
      <h2>Recent Groups:</h2>
      <ul>
        {groupList.map((group) => (
          <li key={group.id}>{group.name}</li>
        ))}
      </ul>
      {/* Group Creation */}
      <h2>Create Group</h2>
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
        Active Group:
        <select value={activeGroup} onChange={(e) => setActiveGroup(e.target.value)}>
          <option value="">Select</option>
          {groupList.map((group) => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </select>
      </h2>
    </div>
  );
}

// All headers are <h2>
