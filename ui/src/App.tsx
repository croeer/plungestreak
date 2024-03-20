import ApiCaller from "./ApiCaller";
import { useEffect, useState } from "react";
import StreakLogButton from "./components/StreakLogButton";
import logo from "./logo.svg";

import { AuthProvider, useAuth } from "oidc-react";
import LogoutButton from "./components/LogoutButton";
import HelloUser from "./components/HelloUser";

const oidcConfig = {
  onSignIn: () => {
    // Redirect?
  },
  authority: "https://idp.ku0.de/realms/plungestreak",
  clientId: "plungestreak",
  redirectUri: "http://localhost:3000",
  responseType: "code", // Use Authorization Code flow with PKCE
  scope: "openid profile email",
  automaticSilentRenew: true,
};

const App = () => (
  <>
    <div className="App-logo">
      <img src={logo} width="20%" alt="logo" />
    </div>
    <AuthProvider {...oidcConfig}>
      <HelloUser />
      <ApiCaller />
      <StreakLogButton />
      <LogoutButton />
    </AuthProvider>
  </>
);

export default App;
