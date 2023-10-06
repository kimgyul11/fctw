import { FiImage } from "react-icons/fi";

import { toast } from "react-toastify";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "firebaseApp";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PostProps } from "pages/home";

export default function PostEditForm() {
  const params = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<PostProps | null>(null);
  const [content, setContent] = useState<string>("");

  const getPost = useCallback(async () => {
    if (params.id) {
      const defRef = doc(db, "posts", params.id);
      const docSnap = await getDoc(defRef);
      setPost({ ...(docSnap?.data() as PostProps), id: docSnap.id });
      setContent(docSnap?.data()?.content);
    }
  }, [params.id]);

  useEffect(() => {
    if (params.id) {
      getPost();
    }
  }, []);
  const handleFileUpload = () => {};
  const onSubmit = async (e: any) => {
    e.preventDefault();
    try {
      if (post) {
        const postRef = doc(db, "posts", post?.id);
        await updateDoc(postRef, {
          content,
        });
        navigate(`/posts/${post?.id}`);
        toast.success("게시글 수정 완료!");
      }
    } catch (e: any) {}
  };
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const {
      target: { name, value },
    } = e;
    if (name === "content") {
      setContent(value);
    }
  };
  return (
    <form className="post-form" onSubmit={onSubmit}>
      <textarea
        className="post-form__textarea"
        name="content"
        id="content"
        placeholder="글입력해라"
        value={content}
        onChange={onChange}
      />
      <div className="post-form__submit-area">
        <label htmlFor="file-input" className="post-form__file">
          <FiImage className="post-form__file-icon" />
        </label>
        <input
          id="file-input"
          type="file"
          name="file-input"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
        <input type="submit" value="수정" className="post-form__submit-btn" />
      </div>
    </form>
  );
}
