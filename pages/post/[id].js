import Layout from '../../components/layout';
import './post.scss';
import dynamic from 'next/dynamic';

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
  console.log(post);
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
        <EditerView text={post.body} />
        <div
          style={{ display: 'none' }}
          dangerouslySetInnerHTML={{
            __html: post.body.replace(/<(\/img|img)([^>]*)>/gi, ''),
          }}
        />
      </div>
      <Comments />
    </Layout>
  );
};

export default Post;
