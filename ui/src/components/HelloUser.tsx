// src/components/HelloUser.tsx

import { AuthContextProps, withAuth } from "oidc-react";

const HelloUser: React.FC<AuthContextProps> = ({ userData }) => {
  return (
    <div>
      <p>Hello {userData?.profile.given_name}!</p>
    </div>
  );
};

export default withAuth(HelloUser);
