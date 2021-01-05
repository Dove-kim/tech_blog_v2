import './postItem.scss';
import moment from 'moment';

const PostItem = ({ title, postNo, category, date, body }) => {
  const go = () => {
    window.location.href = '/post/' + postNo;
  };

  return (
    <div className="PostItem" onClick={go}>
      <h1>{title}</h1>

      <h2>{body.replace(/<[^>]*>?/gm, '').slice(0, 200)}</h2>
      <span className="categoryPrev">{category}</span>
      <span>{moment(date).format('YYYY-MM-DD')}</span>
    </div>
  );
};

export default PostItem;
