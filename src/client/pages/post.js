import Layout from '../components/layout';
import { useRouter } from 'next/router';

export const getStaticProps = async () => {
  const text = 'DB데이터';
  return {
    props: {
      text: text,
    },
  };
};

const Post = ({ text }) => {
  const router = useRouter();
  const { no } = router.query;

  return (
    <Layout>
      <div className="Post_page">
        <div className="Title">
          {no}
          {text}
        </div>
      </div>
    </Layout>
  );
};

export default Post;
