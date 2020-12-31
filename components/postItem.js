import './postItem.scss';
import Link from 'next/link';

const PostItem = ({ title, postNo, text, date }) => {
  return (
    <div className={'PostItem'}>
      <Link href={'/post/' + postNo}>
        <h1>{title}</h1>
      </Link>

      <h2>{text}</h2>
      <span>{date}</span>
    </div>
  );
};

export default PostItem;
