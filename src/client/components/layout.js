import Header from '../components/header';
import './layout.scss';

const Layout = ({ children }) => {
  return (
    <div>
      <Header />
      <div className="contents">{children}</div>
    </div>
  );
};
export default Layout;
