import Loader from "components/loader/Loader";
import PostBox from "components/posts/PostBox";
import { doc, getDoc } from "firebase/firestore";
import { db } from "firebaseApp";
import { PostProps } from "pages/home";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
export default function PostDetail() {
  const params = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<PostProps | null>(null);

  const getPost = useCallback(async () => {
    if (params.id) {
      const docRef = doc(db, "posts", params.id);
      const docSnap = await getDoc(docRef);

      setPost({ ...(docSnap?.data() as PostProps), id: docSnap?.id });
    }
  }, [params.id]);
  useEffect(() => {
    getPost();
  }, []);

  return (
    <>
      <div className="post__header">
        <button type="button" onClick={() => navigate(-1)}>
          <BiArrowBack className="post__header-btn" />
        </button>
      </div>
      <div className="post">{post ? <PostBox post={post} /> : <Loader />}</div>
    </>
  );
}
