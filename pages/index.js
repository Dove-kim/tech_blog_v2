import Layout from '../components/layout';
import PostItem from '../components/postItem';

export const getServerSideProps = async (context) => {
  let res = null;
  const tag = context.query.tag
    ? context.query.tag >= 0
      ? context.query.tag
      : -1
    : -1;
  res = await fetch(`https://tech.dpot.xyz/api/post?tag=${tag}`);

  const posts = await res.json();

  if (posts.length == 0) {
    return {
      notFound: true,
    };
  }
  //날짜순으로 오름차순
  posts.sort(function (a, b) {
    if (a.createdAt > b.createdAt) {
      return -1;
    }
    if (a.createdAt < b.createdAt) {
      return 1;
    }
    return 0;
  });

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
