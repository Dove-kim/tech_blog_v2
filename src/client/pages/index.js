import Layout from '../components/layout';
import PostItem from '../components/postItem';

const Index = () => {
  const posts = [
    {
      key: 1,
      post_no: 1,
      title: '테스트1',
      description: '설명',
      createdAt: '2020-12-09',
    },
    {
      key: 2,
      post_no: 2,
      title: '테스트2',
      description: '설명',
      createdAt: '2020-12-09',
    },
    {
      key: 3,
      post_no: 3,
      title: '테스트3',
      description: '설명',
      createdAt: '2020-12-09',
    },
    {
      key: 4,
      post_no: 4,
      title: '테스트4',
      description: '설명',
      createdAt: '2020-12-09',
    },
    {
      key: 1,
      post_no: 1,
      title: '테스트1',
      description: '설명',
      createdAt: '2020-12-09',
    },
    {
      key: 2,
      post_no: 2,
      title: '테스트2',
      description: '설명',
      createdAt: '2020-12-09',
    },
    {
      key: 3,
      post_no: 3,
      title: '테스트3',
      description: '설명',
      createdAt: '2020-12-09',
    },
    {
      key: 4,
      post_no: 4,
      title: '테스트4',
      description: '설명',
      createdAt: '2020-12-09',
    },
  ];
  return (
    <Layout>
      <div className="PostList">
        {posts.map((post) => (
          <PostItem
            key={post.key}
            postNo={post.post_no}
            title={post.title}
            text={post.description}
            date={post.createdAt}
          />
        ))}
      </div>
    </Layout>
  );
};

export default Index;
