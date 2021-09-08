import React, { useState } from 'react';
import { storageService, dbService } from 'fbase';
import { v4 as uuidV4 } from 'uuid';

const CreateTweet = ({ userObj }) => {
  const [tweet, setTweet] = useState('');
  const [attachement, setAttachment] = useState(null);
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
    <>
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
    </>
  );
};

export default CreateTweet;
