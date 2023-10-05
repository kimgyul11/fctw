import PostForm from "components/posts/PostForm";
import PostBox from "components/posts/PostBox";

export interface PostProps {
  id: string;
  email: string;
  content: string;
  createAt: string;
  uid: string;
  profileUrl?: string;
  likes?: string[];
  likeCounte?: number;
  coments?: any;
}

const posts: PostProps[] = [
  {
    id: "1",
    email: "coloo@naver.com",
    content: "내용입니다",
    createAt: "2023-08-30",
    uid: "123123",
  },
  {
    id: "2",
    email: "coloo@naver.com",
    content: "내용입니다",
    createAt: "2023-08-30",
    uid: "123123",
  },
  {
    id: "3",
    email: "coloo@naver.com",
    content: "내용입니다",
    createAt: "2023-08-30",
    uid: "123123",
  },
  {
    id: "4",
    email: "coloo@naver.com",
    content: "내용입니다",
    createAt: "2023-08-30",
    uid: "123123",
  },
];

export default function HomePage() {
  return (
    <div className="home">
      <div className="home__title">Home</div>
      <div className="home__tabs">
        <div className="home__tab home__tab--active">For you</div>
        <div className="home__tab home__tab">Following</div>
      </div>
      {/* Post Form */}
      <PostForm />
      {/* Tweet Posts */}
      <div className="post">
        {posts.map((post) => (
          <PostBox post={post} key={post.id} />
        ))}
      </div>
    </div>
  );
}
