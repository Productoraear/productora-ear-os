import React from 'react';
import { useRouter } from 'next/navigation';

const SignOutButton = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    const response = await fetch('/api/auth/logout', { method: 'POST' });
    if (response.ok) {
      router.push('/login');
    }
  };

  return (
    <button onClick={handleSignOut} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300">
      Sign Out
    </button>
  );
};

export default SignOutButton;