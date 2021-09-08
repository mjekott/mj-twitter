import Tweet from 'components/Tweet';
import { dbService, storageService } from 'fbase';
import React, { useState, useEffect } from 'react';
import { v4 as uuidV4 } from 'uuid';

const Home = ({ userObj }) => {
  const [tweet, setTweet] = useState('');
  const [tweets, setTweets] = useState([]);
  const [attachement, setAttachment] = useState(null);

  /*   const getTweets = async () => {
    const dbtweets = await dbService.collection('tweets').get();
    dbtweets.forEach((document) => {
      const tweetObject = {
        ...document.data(),
        id: document.id,
      };
      setTweets((prev) => [tweetObject, ...prev]);
    });
  }; */

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

  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const file = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        target: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    let attchementUrl;
    if (attachement) {
      const fileref = storageService.ref().child(`${userObj.uid}/${uuidV4()}`);
      const response = await fileref.putString(attachement, 'data_url');
      attchementUrl = await response.ref.getDownloadURL();
    }
    if (!tweet) {
      alert('tweet can not be empty');
      return;
    }
    const newTweet = {
      text: tweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      ...(attchementUrl && { attchementUrl }),
    };
    await dbService.collection('tweets').add(newTweet);
    setTweet('');
    setAttachment(null);
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;

    setTweet(value);
  };

  const onClearAttachement = () => setAttachment(null);
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          name="tweet"
          placeholder="What's on your mind"
          maxLength={120}
          onChange={onChange}
          value={tweet}
          required
        />
        <input type="file" accept="image/*" onChange={onFileChange} />
        <input type="submit" value="Submit" />
        {attachement && (
          <div>
            <img src={attachement} width="50" height="50" alt="tweet-img" />
            <button onClick={onClearAttachement}>Clear</button>
          </div>
        )}
      </form>
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
    </div>
  );
};

export default Home;
