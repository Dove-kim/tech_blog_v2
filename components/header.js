import Head from 'next/head';
import './header.scss';
import dynamic from 'next/dynamic';
const SideMenu = dynamic(() => import('../components/sideMenu'), {
  ssr: false,
});

const Header = () => {
  const getBacktoMain = () => {
    window.location.href = '/';
  };

  return (
    <div className="Header">
      <Head>
        <title>TechPot</title>
        <link rel="icon" href="/pngegg.png"></link>
      </Head>
      <div className="wrapper" onClick={getBacktoMain}>
        <p className="logo">Mark의 개발블로그</p>
        <img src="/pngegg.png"></img>
      </div>
      <div
        id="back"
        style={{ display: 'none' }}
        onClick={() => {
          window.history.back();
        }}
      >
        뒤로가기
      </div>
      <SideMenu />
    </div>
  );
};

export default Header;
