import Axios from 'axios';
import Layout from '../components/layout';
import PostItem from '../components/postItem';

export const getServerSideProps = async (context) => {
  let res = null;
  const tag = context.query.tag
    ? context.query.tag >= 0
      ? context.query.tag
      : -1
    : -1;
  res = await Axios.get(`https://tech.dpot.xyz/api/post?tag=${tag}`);

  const posts = res.data;

  return {
    props: {
      posts,
    },
  };
};

const Index = ({ posts }) => {
  return (
    <>
      <Layout>
        <div className="PostList">
          {posts.map((post) => (
            <PostItem
              key={post.no}
              postNo={post.no}
              title={post.title}
              tag={post.tag}
              body={post.body}
              date={post.createdAt}
            />
          ))}
        </div>
      </Layout>
    </>
  );
};

export default Index;
