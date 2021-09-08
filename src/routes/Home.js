import CreateTweet from 'components/CreateTweet';
import ListTweet from 'components/ListTweet';

const Home = ({ userObj }) => {
  return (
    <div>
      <CreateTweet userObj={userObj} />
      <ListTweet userObj={userObj} />
    </div>
  );
};

export default Home;
