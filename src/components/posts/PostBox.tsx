import FollowingBox from "components/following/FollowingBox";
import AuthContext from "context/AuthContext";
import {
  arrayRemove,
  arrayUnion,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { db, storage } from "firebaseApp";
import { PostProps } from "pages/home";
import { useContext } from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { FaRegComment, FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface PostBoxProps {
  post: PostProps;
}

export default function PostBox({ post }: PostBoxProps) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const imageRef = ref(storage, post?.imageUrl);

  const toggleLike = async () => {
    //가져올 포스트 ref
    const postRef = doc(db, "posts", post.id);

    //사용자가 좋아요를 눌렀을 경우 이미 좋아요가 눌려있다면 좋아요를 취소한다.
    if (user?.uid && post?.likes?.includes(user?.uid)) {
      await updateDoc(postRef, {
        likes: arrayRemove(user?.uid),
        likeCount: post?.likeCount ? post?.likeCount - 1 : 0,
      });
    } else {
      //사용자가 좋아요를 하지 않은 경우 좋아요를 추가
      await updateDoc(postRef, {
        likes: arrayUnion(user?.uid),
        likeCount: post?.likeCount ? post?.likeCount + 1 : 1,
      });
    }
  };

  const handleDelete = async () => {
    const confirm = window.confirm("해당 게시글을 삭제하시겠습니까?");
    if (confirm) {
      //--1.이미지를 삭제한다.
      if (post?.imageUrl) {
        deleteObject(imageRef).catch((error) => {
          console.log(error);
        });
      }
      //--2.게시글을 삭제한다.
      await deleteDoc(doc(db, "posts", post.id));
      toast.success("게시글을 삭제했습니다.");
      navigate("/");
    }
  };

  return (
    <div className="post__box" key={post?.id}>
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
          <div className="post__flex--between">
            <div className="post__flex">
              <div className="post__email">{post?.email}</div>
              <div className="post__createdAt">{post?.createdAt}</div>
            </div>
            <FollowingBox post={post} />
          </div>
        </div>
        <Link to={`/posts/${post?.id}`}>
          <div className="post__box-content">{post?.content}</div>
          {post?.imageUrl && (
            <div className="post__image-div">
              <img
                src={post?.imageUrl}
                alt="post img"
                className="post__image"
                width={100}
                height={100}
              />
            </div>
          )}
        </Link>

        <div className="post-form__hashtags-outputs">
          {post?.hashTags?.map((tag, idx) => (
            <span
              className="post-form__hashtags-tag"
              onClick={() => {
                navigate(`/search/${tag}`);
              }}
              key={idx}
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

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
          <button type="button" className="post__likes" onClick={toggleLike}>
            {user && post?.likes?.includes(user.uid) ? (
              <AiFillHeart />
            ) : (
              <AiOutlineHeart />
            )}
            {post?.likeCount || 0}
          </button>
          <button type="button" className="post__comments">
            <FaRegComment />
            {post?.comment?.length || 0}
          </button>
        </>
      </div>
    </div>
  );
}
