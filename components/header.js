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
        <script
          type="text/javascript"
          src="//t1.daumcdn.net/kas/static/ba.min.js"
          async
        ></script>
      </Head>
      <div className="wrapper" onClick={getBacktoMain}>
        <h1 className="logo">DPot의 개발블로그</h1>
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
