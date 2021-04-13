import './postItem.scss';

const PostItem = ({ title, postNo, tag, date, body }) => {
  const go = () => {
    window.location.href = '/post/' + postNo;
  };

  let tagList = null;
  if (Array.isArray(tag)) {
    tagList = [];
    for (let i = 0; i < tag.length; i++) {
      tagList.push(
        <div className="index_tag_item" key={tag[i]}>
          {tag[i]}
        </div>,
      );
    }
  } else {
    tagList = tag;
  }

  return (
    <div className="PostItem" onClick={go}>
      <h2>{title}</h2>
      <div className="index_tag_list">{tagList}</div>
      <h3>
        {body
          .replace(/<[^>]*>?/gm, '')
          .replace(/&nbsp;?/gm, '')
          .slice(0, 200)}
      </h3>
      <span>{date.substring(0, 10)}</span>
    </div>
  );
};

export default PostItem;
