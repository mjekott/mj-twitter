import React, { useState, useEffect } from 'react';
import { dbService } from 'fbase';
import Tweet from 'components/Tweet';

const ListTweet = ({ userObj }) => {
  const [tweets, setTweets] = useState([]);
  useEffect(() => {
    dbService.collection('tweets').onSnapshot((snapshot) => {
      const newArray = snapshot.docs.map((doc) => {
        return {
          ...doc.data(),
          id: doc.id,
        };
      });

      setTweets(newArray);
    });
  }, []);

  return (
    <div>
      {tweets.map((tweet) => {
        return (
          <Tweet
            key={tweet.id}
            tweetObj={tweet}
            isOwner={tweet.creatorId === userObj.uid}
          />
        );
      })}
    </div>
  );
};

export default ListTweet;
