// src/components/StreakLogButton.tsx

import React, { useState, useEffect } from "react";
import { fetchAuthSession } from "@aws-amplify/auth";

const StreakLogButton: React.FC = () => {
  const [data, setData] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {};

    fetchData();
  }, []);

  const logStreakEntry = async () => {
    try {
      const session = await fetchAuthSession();
      const jwtToken = session.tokens?.idToken?.toString();

      // Make an authenticated API call
      const apiResponse = await fetch(
        "https://dflbxu0fjf.execute-api.eu-central-1.amazonaws.com/logstreak",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      const result = await apiResponse.json();
      console.log(result);
      setData(JSON.stringify(result));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <button onClick={logStreakEntry}>Log Streak Item</button>
    </div>
  );
};

export default StreakLogButton;
