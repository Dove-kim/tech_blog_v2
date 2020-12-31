import './_app.scss';
import { useEffect } from 'react';

const App = ({ Component, pageProps }) => {
  useEffect(async () => {
    document.body.onkeydown = function (e) {
      if (e.ctrlKey && String.fromCharCode(e.keyCode) === 'S') {
        e.preventDefault();
      } else if (e.keyCode == 46) {
        e.preventDefault();
      }
    };
  });

  return <Component {...pageProps} />;
};

export default App;
