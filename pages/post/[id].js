import Layout from '../../components/layout';
import './post.scss';
import dynamic from 'next/dynamic';
import moment from 'moment';
import Head from 'next/head';

const EditerView = dynamic(() => import('../../components/post'), {
  ssr: false,
});
const Comments = dynamic(() => import('../../components/comments'), {
  ssr: false,
});

export const getServerSideProps = async (context) => {
  const postNo = context.params.id;
  let res = null;

  res = await fetch(`https://front.dpot.xyz/api/post/${postNo}`);

  const post = await res.json();

  if (post.result == false) {
    return {
      notFound: true,
    };
  }
  //console.log(post);
  return {
    props: { postNo, post: post.post },
  };
};

const Post = ({ postNo, post }) => {
  return (
    <Layout>
      <Head>
        <title>{post.title}</title>
        <link rel="icon" href="/pngegg.png"></link>
      </Head>
      <div className="Post_page">
        <header>
          <hi className="Title">{post.title}</hi>
        </header>
        <div className="post_tag_list">
          {post.tag.map((data) => (
            <div className="post_tag_item" key={data}>
              {data}
            </div>
          ))}
        </div>
        <time dateTime={moment(post.createdAt).format('YYYY-MM-DD')}>
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
