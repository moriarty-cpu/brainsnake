import React from 'react';
import { UserCard, useAuth } from '../components';

export default function Profile() {
  const { user } = useAuth();
  return (
    <main>
      <div className="container">
        {user ? <UserCard/> : <div>No user data</div>}
      </div>
    </main>
  );
}
