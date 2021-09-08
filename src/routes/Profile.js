import { authService, dbService } from 'fbase';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';

const Profile = ({ userObj, refreshuser }) => {
  const [name, setName] = useState(userObj.displayName);
  const history = useHistory();

  const onLogoutClick = () => {
    authService.signOut();
    history.push('/');
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setName(value);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (name === userObj.displayName || name === '') {
      return;
    }
    await userObj.updateProfile({
      displayName: name,
    });
    refreshuser();
  };

  const getMyTweets = async () => {
    const data = await dbService
      .collection('tweets')
      .where('creatorId', '==', userObj.uid)
      .orderBy('createdAt')
      .get();
  };

  useEffect(() => {
    getMyTweets();
  }, []);

  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="Display Name"
          value={name}
          onChange={onChange}
        />
        <input type="submit" value="Update DisplayName" />
      </form>
      <button onClick={onLogoutClick}>logout</button>
    </>
  );
};

export default Profile;
