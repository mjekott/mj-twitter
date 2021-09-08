import { dbService, storageService } from 'fbase';
import React from 'react';
import { useState } from 'react';

const Tweet = ({ tweetObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newTweet, setNewTeet] = useState(tweetObj.text);
  const { attchementUrl } = tweetObj;
  const OnDeleteTweet = async () => {
    const ok = window.confirm('Do you want to delete tweet');
    if (!ok) {
      return;
    }
    await dbService.doc(`tweets/${tweetObj.id}`).delete();
    await storageService.refFromURL(attchementUrl).delete();
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (newTweet === tweetObj.text) {
      setEditing(false);
      return;
    }
    await dbService.doc(`tweets/${tweetObj.id}`).update({
      text: newTweet,
    });
    setEditing(false);
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;

    setNewTeet(value);
  };

  const toggleEditing = () => setEditing((prev) => !prev);

  return (
    <div>
      {editing ? (
        <>
          {isOwner && (
            <>
              <form onSubmit={onSubmit}>
                <input type="text" onChange={onChange} value={newTweet} />
                <input type="submit" value="Update Tweet" />
              </form>
              <button onClick={toggleEditing}>Cancel</button>
            </>
          )}
        </>
      ) : (
        <div>
          <h4>{tweetObj.text}</h4>
          {attchementUrl && (
            <div>
              <img
                src={attchementUrl}
                alt="tweetimage"
                width="50"
                height="50"
              />
            </div>
          )}
          {isOwner && (
            <>
              <button onClick={toggleEditing}>Edit</button>
              <button onClick={OnDeleteTweet}>Delete</button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Tweet;
