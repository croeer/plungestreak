// src/components/ApiCaller.tsx

import React, { useState, useEffect } from "react";
import { fetchAuthSession } from "@aws-amplify/auth";

const ApiCaller: React.FC = () => {
  const [data, setData] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Sign in and obtain the JWT token
        const session = await fetchAuthSession(); // Fetch the authentication session
        console.log("Access Token:", session.tokens?.accessToken.toString());
        console.log("ID Token:", session.tokens?.idToken?.toString());

        const jwtToken = session.tokens?.idToken?.toString();

        // Make an authenticated API call
        const apiResponse = await fetch(
          "https://dflbxu0fjf.execute-api.eu-central-1.amazonaws.com/",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );

        const result = await apiResponse.json();
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
      {data && <pre>{data}</pre>}
    </div>
  );
};

export default ApiCaller;
