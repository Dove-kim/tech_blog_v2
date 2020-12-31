import Head from 'next/head';
import './header.scss';

const Header = () => {
  const getBacktoMain = () => {
    window.location.href = '/';
  };

  return (
    <div className="Header">
      <Head>
        <title>DovePot</title>
        <link rel="icon" href="/pngegg.png"></link>
      </Head>
      <div className="wrapper" onClick={getBacktoMain}>
        <p className="logo">Dove의 테크 항아리</p>
        <img src="/pngegg.png"></img>
      </div>
    </div>
  );
};

export default Header;
