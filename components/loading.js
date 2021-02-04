import './loading.scss';

const Loading = ({ children }) => {
  return (
    <div className="loading_div">
      <div className="loading_overlay" />
      <div className="loading-container">
        <div className="loading"></div>
        <div id="loading-text">로딩중..</div>
      </div>
    </div>
  );
};

export default Loading;
