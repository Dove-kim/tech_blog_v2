import Layout from '../../components/layout';
const fs = require('fs');
let rawdata = fs.readFileSync('config/config.json');
let setting = JSON.parse(rawdata);
import './post.scss';

export async function getStaticPaths() {
  let res = null;
  if (setting.dev) {
    res = await fetch(`https://front.dpot.xyz/api/post/`);
  } else {
    res = await fetch(`https://tech.dpot.xyz/api/post/`);
  }
  const postData = await res.json();
  const postsList = [];
  postData.forEach((element) => {
    postsList.push({
      params: {
        id: element.no.toString(),
        title: element.title,
        body: element.body,
        category: element.category,
        createdAt: element.createdAt,
      },
    });
  });
  console.log(postsList);
  return {
    paths: postsList,
    fallback: false,
  };
}

export const getStaticProps = async ({ params }) => {
  const postNo = params.id;
  console.log(params);
  let res = null;
  if (setting.dev) {
    res = await fetch(`https://front.dpot.xyz/api/post/${postNo}`);
  } else {
    res = await fetch(`https://tech.dpot.xyz/api/post/${postNo}`);
  }
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
    </Layout>
  );
};

export default Post;
