import { Amplify } from "aws-amplify";
import type { WithAuthenticatorProps } from "@aws-amplify/ui-react";
import { withAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { fetchAuthSession } from "@aws-amplify/auth";
import ApiCaller from "./ApiCaller";
import { useEffect, useState } from "react";
import StreakLogButton from "./components/StreakLogButton";
import logo from "./logo.svg";

Amplify.configure({
  Auth: {
    Cognito: {
      //  Amazon Cognito User Pool ID
      userPoolId: "eu-central-1_oVZ6s08cQ",
      // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
      userPoolClientId: "2v3lm5e9u0r7b0to5r3hfhifqm",
      // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
      //identityPoolId: "XX-XXXX-X:XXXXXXXX-XXXX-1234-abcd-1234567890ab",
      // OPTIONAL - This is used when autoSignIn is enabled for Auth.signUp
      // 'code' is used for Auth.confirmSignUp, 'link' is used for email link verification
      signUpVerificationMethod: "code", // 'code' | 'link'
      loginWith: {
        // OPTIONAL - Hosted UI configuration
        oauth: {
          domain: "auth.plungestreak.ku0.de",
          scopes: [
            "email",
            "profile",
            "openid",
            "aws.cognito.signin.user.admin",
          ],
          redirectSignIn: ["http://localhost:3000/"],
          redirectSignOut: ["http://localhost:3000/"],
          responseType: "code", // or 'token', note that REFRESH token will only be generated when the responseType is code
        },
      },
    },
  },
});

// You can get the current config object
const currentConfig = Amplify.getConfig();
export function App({ signOut, user }: WithAuthenticatorProps) {
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const session = await fetchAuthSession();
        const name = session.tokens?.idToken?.payload["name"]?.toString();
        setUserName(name ?? null);
      } catch (error) {
        console.error("Error fetching user name:", error);
      }
    };

    fetchUserName();
  }, []); // Empty dependency array ensures this effect runs only once during component mount

  const printAccessTokenAndIdToken = async () => {
    try {
      const session = await fetchAuthSession(); // Fetch the authentication session
      console.log("Access Token:", session.tokens?.accessToken.toString());
      console.log("ID Token:", session.tokens?.idToken?.toString());
      console.log(
        "ID Token Payload:",
        session.tokens?.idToken?.payload["name"]?.toString()
      );
    } catch (e) {
      console.log(e);
    }
  };

  const fetchItems = async () => {
    try {
      const session = await fetchAuthSession(); // Fetch the authentication session

      //console.log("Access Token:", session.tokens?.accessToken.toString());
      console.log("ID Token:", session.tokens?.idToken?.toString());
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <img src={logo} width={"50%"} className="App-logo" alt="logo" />
      <h1>Hello {userName}</h1>
      <ApiCaller />
      <StreakLogButton />
      <button onClick={signOut}>Sign out</button>
    </>
  );
}

export default withAuthenticator(App, { hideSignUp: true });
