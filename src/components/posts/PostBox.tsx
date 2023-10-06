import AuthContext from "context/AuthContext";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "firebaseApp";
import { PostProps } from "pages/home";
import { useContext } from "react";
import { AiOutlineHeart } from "react-icons/ai";
import { FaRegComment, FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface PostBoxProps {
  post: PostProps;
}

export default function PostBox({ post }: PostBoxProps) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleDelete = async () => {
    const confirm = window.confirm("해당 게시글을 삭제하시겠습니까?");
    if (confirm) {
      await deleteDoc(doc(db, "posts", post.id));
      toast.success("게시글을 삭제했습니다.");
      navigate("/");
    }
  };
  return (
    <div className="post__box" key={post?.id}>
      <Link to={`/posts/${post?.id}`}>
        <div className="post__box-profile">
          <div className="post__flex">
            {post?.profileUrl ? (
              <img
                src={post?.profileUrl}
                alt="profile"
                className="post__box-profile-img"
              />
            ) : (
              <FaUserCircle className="post__box-profile-img" />
            )}
            <div className="post__email">{post?.email}</div>
            <div className="post__createdAt">{post?.createAt}</div>
          </div>
          <div className="post__box-content">{post?.content}</div>
        </div>
      </Link>
      <div className="post__box-footer">
        {/* post.uid === user.uid일 때 */}

        <>
          {user?.uid === post.uid && (
            <>
              <button
                type="button"
                className="post__delete"
                onClick={handleDelete}
              >
                Delete
              </button>
              <button type="button" className="post__edit">
                <Link to={`/posts/edit/${post.id}`}>Edit</Link>
              </button>
            </>
          )}
          <button type="button" className="post__likes">
            <AiOutlineHeart />
            {post?.likes || 0}
          </button>
          <button type="button" className="post__comments">
            <FaRegComment />
            {post?.coments?.length || 0}
          </button>
        </>
      </div>
    </div>
  );
}
