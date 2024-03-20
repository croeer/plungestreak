// src/components/StreakLogButton.tsx

import React, { useState } from "react";
import { useAuth } from "oidc-react";

const StreakLogButton: React.FC = () => {
  const [data, setData] = useState<string | null>(null);

  const auth = useAuth();

  const logStreakEntry = async () => {
    try {
      if (auth.isLoading) {
        return;
      }
      const jwtToken = auth.userData?.access_token;

      // Make an authenticated API call
      const apiResponse = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/logstreak`,
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
