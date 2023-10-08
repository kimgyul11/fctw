import { FiImage } from "react-icons/fi";

import { toast } from "react-toastify";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, storage } from "firebaseApp";
import { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PostProps } from "pages/home";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadString,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import AuthContext from "context/AuthContext";
import PostHeader from "./PostHeader";

export default function PostEditForm() {
  const params = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<PostProps | null>(null);
  const [imageFile, setImageFile] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [content, setContent] = useState<string>("");
  const [hashTag, setHashTag] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const { user } = useContext(AuthContext);

  //포스트 데이터 가져오기
  const getPost = useCallback(async () => {
    if (params.id) {
      const defRef = doc(db, "posts", params.id);
      const docSnap = await getDoc(defRef);
      setPost({ ...(docSnap?.data() as PostProps), id: docSnap.id });
      setContent(docSnap?.data()?.content);
      setTags(docSnap?.data()?.hashTags);
      setImageFile(docSnap.data()?.imageUrl);
    }
  }, [params.id]);

  useEffect(() => {
    if (params.id) {
      getPost();
    }
  }, []);

  const handleFileUpload = (e: any) => {
    const {
      target: { files },
    } = e;
    const file = files?.[0];
    const fileReader = new FileReader();
    fileReader?.readAsDataURL(file);

    fileReader.onloadend = (e: any) => {
      const { result } = e?.currentTarget;
      setImageFile(result);
    };
  };
  const onSubmit = async (e: any) => {
    setIsSubmitting(true);
    const key = `${user?.uid}/${uuidv4()}`;
    const storageRef = ref(storage, key);

    e.preventDefault();
    try {
      if (post) {
        //이미지가 있다면 기존사진 삭제한다.
        if (post?.imageUrl) {
          let imageRef = ref(storage, post?.imageUrl);
          await deleteObject(imageRef).catch((error) => {
            console.log(error);
          });
        }

        //새로운 이미지가 있다면 업로드
        let imageUrl = "";
        if (imageFile) {
          const data = await uploadString(storageRef, imageFile, "data_url");
          imageUrl = await getDownloadURL(data?.ref);
        }

        //사진이 없다면 스토리지에 이미지 삭제
        const postRef = doc(db, "posts", post?.id);
        await updateDoc(postRef, {
          content,
          hashTags: tags,
          imageUrl,
        });
        navigate(`/posts/${post?.id}`);
        toast.success("게시글 수정 완료!");
      }
    } catch (e: any) {
    } finally {
      setImageFile(null);
      setIsSubmitting(false);
    }
  };
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const {
      target: { name, value },
    } = e;
    if (name === "content") {
      setContent(value);
    }
  };

  //키보드를 눌렀을때 이벤트
  const handleKeyUp = (e: any) => {
    //키코드가 32(스페이스) 이고, 값이 비어있지 않을때 로직을 수행한다.
    if (e.keyCode === 32 && e.target.value.trim() !== "") {
      //만약 같은 태그가 있다면 중복된 태그임을 알려주고 아니면 tags에 저장해준다.
      if (tags.includes(e.target.value.trim())) {
        toast.error("이미 존재하는 태그입니다.");
      } else {
        setTags((prev) => (prev?.length > 0 ? [...prev, hashTag] : [hashTag]));
        setHashTag("");
      }
    }
  };
  const onChangeHashTag = (e: any) => {
    setHashTag(e?.target?.value?.trim());
  };
  //추가된 해시태그를 눌렀을때 삭제되는 이벤트
  const removeTag = (tag: string) => {
    setTags(tags?.filter((val) => val !== tag));
  };

  const handleDeleteImg = () => {
    setImageFile(null);
  };
  return (
    <div className="post">
      <PostHeader />
      <form className="post-form" onSubmit={onSubmit}>
        <textarea
          className="post-form__textarea"
          name="content"
          id="content"
          placeholder="글입력해라"
          value={content}
          onChange={onChange}
        />
        <div className="post-form__hashtags">
          <span className="post-form__hashtags-outputs">
            {tags?.map((tag, idx) => (
              <span
                className="post-form__hashtags-tag"
                key={idx}
                onClick={() => removeTag(tag)}
              >
                #{tag}
              </span>
            ))}
          </span>
          <input
            className="post-form__input"
            name="hashtag"
            placeholder="해시태그 + 스페이스 입력"
            onChange={onChangeHashTag}
            onKeyUp={handleKeyUp}
            value={hashTag}
          />
        </div>

        <div className="post-form__submit-area">
          <div className="post-form__image-area">
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
            {imageFile && (
              <div className="post-form__attachment">
                <img
                  src={imageFile}
                  alt="attachment"
                  width={100}
                  height={100}
                />
                <button
                  className="post-form__clear-btn"
                  type="button"
                  onClick={handleDeleteImg}
                >
                  삭제
                </button>
              </div>
            )}
          </div>

          <input
            type="submit"
            value="수정"
            className="post-form__submit-btn"
            disabled={isSubmitting}
          />
        </div>
      </form>
    </div>
  );
}
