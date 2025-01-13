import React from 'react';
import { signIn } from 'next-auth/react';

const Login = () => {
  const handleLogin = () => {
    signIn('google');
  };

  return (
    <div>
      <button onClick={handleLogin}>Login with Google</button>
    </div>
  );
};

export default Login;