import Layout from '../../components/layout';
import './post.scss';
import dynamic from 'next/dynamic';
import moment from 'moment';

const EditerView = dynamic(() => import('../../components/post'), {
  ssr: false,
});
const Comments = dynamic(() => import('../../components/comments'), {
  ssr: false,
});

export const getServerSideProps = async (context) => {
  const postNo = context.params.id;
  let res = null;

  res = await fetch(`https://tech.dpot.xyz/api/post/${postNo}`);

  const post = await res.json();

  if (post.result == false) {
    return {
      notFound: true,
    };
  }
  //console.log(post);
  return {
    props: { postNo, post },
  };
};

const Post = ({ postNo, post }) => {
  return (
    <Layout>
      <div className="Post_page">
        <header>
          <hi className="Title">{post.title}</hi>
        </header>
        <div className="category">{post.category}</div>
        <time dateTime="post.category">
          {moment(post.createdAt).format('YYYY-MM-DD')}
        </time>
        <EditerView text={post.body} />
        <div
          style={{ display: 'none' }}
          dangerouslySetInnerHTML={{
            __html: post.body.replace(/<(\/img|img)([^>]*)>/gi, ''),
          }}
        />
      </div>
      <footer>
        <Comments />
      </footer>
    </Layout>
  );
};

export default Post;
