import Layout from '../../components/layout';
import './post.scss';
import dynamic from 'next/dynamic';
const Comments = dynamic(() => import('../../components/comments'), {
  ssr: false,
});

export const getServerSideProps = async (context) => {
  const postNo = context.params.id;
  let res = null;

  res = await fetch(`https://tech.dpot.xyz/api/post/${postNo}`);

  const post = await res.json();
  return {
    props: { postNo, post },
  };
};

const Post = ({ postNo, post }) => {
  return (
    <Layout>
      <div className="Post_page">
        <div className="Title">{post.title}</div>
        <div className="category">{post.category}</div>
        <div
          className="ql-snow ql-editor body"
          dangerouslySetInnerHTML={{
            __html: post.body,
          }}
        />
      </div>
      <Comments />
    </Layout>
  );
};

export default Post;
