// src/components/ApiCaller.tsx

import React, { useState, useEffect } from "react";
import { useAuth } from "oidc-react";

interface StreakItem {
  id: number;
  user_id: string;
  timestamp: string;
}

const ApiCaller: React.FC = () => {
  const [data, setData] = useState<string | null>(null);
  const [list, setList] = useState<StreakItem[] | null>([]);
  const [counter, setCounter] = useState<number>(1);
  const auth = useAuth();

  const fetchData = async () => {
    try {
      // Sign in and obtain the JWT token
      if (auth.isLoading) {
        return;
      }
      const jwtToken = auth.userData?.access_token;
      console.log("Access Token:", jwtToken?.toString());

      // Make an authenticated API call
      const apiResponse = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/getstreakitems`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      const result = await apiResponse.json();

      setList(result);
      setData(JSON.stringify(result));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [auth]);

  return (
    <div>
      <h1>API Caller</h1>
      <pre>{data}</pre>
      <ul>
        {list?.map((item) => (
          <li key={item.id}>
            {item.user_id}: {item.timestamp}
          </li>
        ))}
      </ul>
      <button onClick={fetchData}>Refresh</button>
    </div>
  );
};

export default ApiCaller;
