import { PostProps } from "pages/home";
import styles from "./Comment.module.scss";
import AuthContext from "context/AuthContext";
import { useContext } from "react";
import { arrayRemove, doc, updateDoc } from "firebase/firestore";
import { db } from "firebaseApp";
import { toast } from "react-toastify";

export interface CommentProps {
  comment: string;
  uid: string;
  email: string;
  createdAt: string;
}

interface CommentBoxProps {
  data: CommentProps;
  post: PostProps;
}

export default function CommentBox({ data, post }: CommentBoxProps) {
  const { user } = useContext(AuthContext);
  const handleDeleteComment = async () => {
    if (post) {
      try {
        const postRef = doc(db, "posts", post?.id);
        await updateDoc(postRef, {
          comment: arrayRemove(data),
        });
        toast.success("댓글이 삭제되었습니다.");
      } catch (e: any) {
        console.log(e);
      }
    }
  };
  console.log(data.email);
  return (
    <div key={data?.createdAt} className={styles.comment}>
      <div className={styles.comment__borderBox}>
        <div className={styles.comment__imgBox}>
          <div className={styles.comment__flexBox}>
            <img src={`/logo192.png`} alt="profile" />
            <div className={styles.comment__email}>{data?.email}</div>
            <div className={styles.comment__createdAt}>{data?.createdAt}</div>
          </div>
        </div>
        <div className={styles.comment__content}>{data?.comment}</div>
        <div className={styles.comment__submitDiv}>
          {data?.uid === user?.uid && (
            <button
              type="button"
              className="comment__delete-btn"
              onClick={handleDeleteComment}
            >
              삭제
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
