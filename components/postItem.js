import './postItem.scss';
import moment from 'moment';

const PostItem = ({ title, postNo, tag, date, body }) => {
  const go = () => {
    window.location.href = '/post/' + postNo;
  };

  return (
    <div className="PostItem" onClick={go}>
      <h1>{title}</h1>
      <div className="index_tag_list">
        {tag.map((data) => (
          <div className="index_tag_item" key={data}>
            {data}
          </div>
        ))}
      </div>
      <h2>
        {body
          .replace(/<[^>]*>?/gm, '')
          .replace(/&nbsp;?/gm, '')
          .slice(0, 200)}
      </h2>
      <span>{moment(date).format('YYYY-MM-DD')}</span>
    </div>
  );
};

export default PostItem;
