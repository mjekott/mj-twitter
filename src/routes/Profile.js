import { authService } from 'fbase';
import React from 'react';
import { useHistory } from 'react-router';

const Profile = () => {
  const history = useHistory();

  const onLogoutClick = () => {
    authService.signOut();
    history.push('/');
  };

  return (
    <>
      <button onClick={onLogoutClick}>logout</button>
    </>
  );
};

export default Profile;
