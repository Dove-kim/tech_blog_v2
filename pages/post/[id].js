import Layout from '../../components/layout';
import './post.scss';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import Loading from '../../components/loading';

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
    props: { postNo, post: post.post },
  };
};

const Post = ({ postNo, post }) => {
  return (
    <Layout>
      <Head>
        <title>{post.title}</title>
        <meta
          name="description"
          content={post.body
            .replace(/<[^>]*>?/gm, '')
            .replace(/&nbsp;?/gm, '')
            .slice(0, 200)}
        />
        <link rel="icon" href="/pngegg.png"></link>
      </Head>
      <Loading />
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
        <time dateTime={post.createdAt.substring(0, 10)}>
          {post.createdAt.substring(0, 10)}
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
        <ins
          className="kakao_ad_area"
          style={{ display: 'none' }}
          data-ad-unit="DAN-mJJ9zuJ0dgoJ1w2v"
          data-ad-width="320"
          data-ad-height="100"
        ></ins>
        <Comments />
      </footer>
    </Layout>
  );
};

export default Post;
