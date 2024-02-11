// src/components/ApiCaller.tsx

import React, { useState, useEffect } from "react";
import { fetchAuthSession } from "@aws-amplify/auth";

interface StreakItem {
  id: number;
  user_id: string;
  timestamp: string;
}

const ApiCaller: React.FC = () => {
  const [data, setData] = useState<string | null>(null);
  const [list, setList] = useState<StreakItem[] | null>([]);
  const [counter, setCounter] = useState<number>(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Sign in and obtain the JWT token
        const session = await fetchAuthSession(); // Fetch the authentication session
        // console.log("Access Token:", session.tokens?.accessToken.toString());
        // console.log("ID Token:", session.tokens?.idToken?.toString());

        const jwtToken = session.tokens?.idToken?.toString();

        // Make an authenticated API call
        const apiResponse = await fetch(
          `${process.env.APP_BACKEND_URL}/getstreakstatus`,
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

    fetchData();
  }, []);

  return (
    <div>
      <h1>API Caller</h1>
      <pre>{data}</pre>
      {/* <ul>
        {list?.map((item) => (
          <li key={item.id}>
            {item.user_id}: {item.timestamp}
          </li>
        ))}
      </ul> */}
    </div>
  );
};

export default ApiCaller;
