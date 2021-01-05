import Layout from '../components/layout';
import PostItem from '../components/postItem';

export const getServerSideProps = async (context) => {
  let res = null;
  const category = context.query.category
    ? context.query.category >= 0
      ? context.query.category
      : -1
    : -1;
  res = await fetch(`https://tech.dpot.xyz/api/post?category=${category}`);

  const posts = await res.json();

  if (posts.length == 0) {
    return {
      notFound: true,
    };
  }

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
              category={post.category}
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
