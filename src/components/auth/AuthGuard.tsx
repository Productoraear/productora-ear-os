import React from 'react';

interface AuthGuardProps {
  children: JSX.Element;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
const isAuthenticated = true; // Replace with actual authentication check

if (!isAuthenticated) {
  return <div>No estás autenticado</div>;
}
  return <div>{children}</div>;
};

export default AuthGuard;