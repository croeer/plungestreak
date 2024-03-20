// src/components/LogoutButton.tsx

import React, { useState, useEffect } from "react";
import { useAuth } from "oidc-react";

const LogoutButton: React.FC = () => {
  const auth = useAuth();
  const handleSignOut = () => {
    auth.userManager.signoutRedirect();
    auth.userManager.removeUser();
  };
  return (
    <div>
      <button onClick={handleSignOut}>Log out</button>
    </div>
  );
};

export default LogoutButton;
