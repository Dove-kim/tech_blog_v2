import Layout from '../components/layout';
import PostItem from '../components/postItem';
const fs = require('fs');
let rawdata = fs.readFileSync('config/config.json');
let setting = JSON.parse(rawdata);

export const getStaticProps = async () => {
  let res = null;
  if (setting.dev) {
    res = await fetch(`https://front.dpot.xyz/api/post/`);
  } else {
    res = await fetch(`https://tech.dpot.xyz/api/post/`);
  }

  const posts = await res.json();

  return {
    props: {
      posts,
    },
  };
};

const Index = ({ posts }) => {
  return (
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
  );
};

export default Index;
