import { useState, useEffect } from 'react';
import AppRouter from './Router';
import { authService } from 'fbase';
function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setisLoggedIn] = useState(false);
  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setisLoggedIn(true);
      } else {
        setisLoggedIn(false);
      }
      setInit(true);
    });
  }, []);
  return (
    <div>
      {init ? <AppRouter isLoggedIn={isLoggedIn} /> : 'loading ....'}
      <footer>&copy; {new Date().getFullYear()} Ntwitter </footer>
    </div>
  );
}

export default App;
