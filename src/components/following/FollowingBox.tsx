import AuthContext from "context/AuthContext";
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
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

  //팔로우  버튼 클릭 이벤트
  const onClickFollow = async (e: any) => {
    e.preventDefault();
    try {
      if (user?.uid) {
        //현재 로그인한 유저uid를 기준으로 following 문서에 post.uid를 넣는다.
        const followingRef = doc(db, "following", user?.uid);
        await setDoc(
          followingRef,
          {
            users: arrayUnion({ id: post?.uid }),
          },
          { merge: true }
        );
        //현재 포스트의 유저 uid를 기준으로 follower에 로그인한 유저의 user.uid 넣는다.
        const followerRef = doc(db, "follower", post?.uid);
        await setDoc(
          followerRef,
          { users: arrayUnion({ id: user?.uid }) },
          { merge: true }
        );

        //팔로잉 알림 생성
        if (user?.uid !== post.uid) {
          await addDoc(collection(db, "notifications"), {
            createdAt: new Date()?.toLocaleString("ko", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }),
            content: `${user?.email || user?.displayName}가 팔로우를 했습니다.`,
            url: "#",
            isRead: false,
            uid: post?.uid,
          });
        }

        toast.success("팔로우 완료");
      }
    } catch {}
  };

  //팔로우 사용자를 가져온다.
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

  //팔로잉 취소
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
