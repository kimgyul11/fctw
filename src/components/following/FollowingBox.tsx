import AuthContext from "context/AuthContext";
import {
  arrayRemove,
  arrayUnion,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "firebaseApp";
import { PostProps } from "pages/home";
import { useCallback, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

interface FollowingProps {
  post: PostProps;
}

export default function FollowingBox({ post }: FollowingProps) {
  const { user } = useContext(AuthContext);
  const [postFollowers, setPostFolloweres] = useState<any>([]);
  const onClickFollow = async (e: any) => {
    e.preventDefault();
    try {
      if (user?.uid) {
        //팔로우 하는 사람의 컬렉션을 생성하거나 업데이트
        const followingRef = doc(db, "following", user?.uid);
        await setDoc(
          followingRef,
          {
            users: arrayUnion({ id: post?.uid }),
          },
          { merge: true }
        );
        //팔로우 당하는 사람의 컬렉션을 생성하거나 업데이트
        const followerRef = doc(db, "follower", post?.uid);
        await setDoc(
          followerRef,
          { users: arrayUnion({ id: user?.uid }) },
          { merge: true }
        );
        toast.success("팔로우 완료");
      }
    } catch {}
  };
  //팔로잉,팔로우를 가져온다.
  const getFollowers = useCallback(async () => {
    if (post.uid) {
      const ref = doc(db, "follower", post.uid);
      onSnapshot(ref, (doc) => {
        setPostFolloweres([]);
        doc
          ?.data()
          ?.users?.map((user: any) =>
            setPostFolloweres((prev: any) => (prev ? [...prev, user?.id] : []))
          );
      });
    }
  }, [post.uid]);
  useEffect(() => {
    getFollowers();
  }, [getFollowers, post.uid]);

  const onClickDeleteFollow = async (e: any) => {
    e.preventDefault();
    try {
      if (user?.uid) {
        const followingRef = doc(db, "following", user?.uid);
        await updateDoc(followingRef, {
          users: arrayRemove({ id: post?.uid }),
        });
        const followerRef = doc(db, "follower", post?.uid);
        await updateDoc(followerRef, {
          users: arrayRemove({ id: user.uid }),
        });
        toast.success("팔로우 취소");
      }
    } catch (e: any) {
      console.log(e);
    }
  };
  return (
    <>
      {user?.uid !== post?.uid && postFollowers?.includes(user?.uid) ? (
        <button
          type="button"
          className="post__following-btn"
          onClick={onClickDeleteFollow}
        >
          팔로잉 중..
        </button>
      ) : (
        <button
          type="button"
          className="post__following-btn"
          onClick={onClickFollow}
        >
          팔로우
        </button>
      )}
    </>
  );
}
