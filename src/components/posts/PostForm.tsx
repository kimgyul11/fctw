import AuthContext from "context/AuthContext";
import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { db, storage } from "firebaseApp";
import { useContext, useState } from "react";
import { FiImage } from "react-icons/fi";

import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

export default function PostForm() {
  const [content, setContent] = useState<string>("");
  const [hashTag, setHashTag] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const { user } = useContext(AuthContext);

  //이미지 업로드 핸들러
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
    // 스토리지에 저장될 때 고유의 경로가 필요하므로 uuid를 사용한다.
    const key = `${user?.uid}/${uuidv4()}`;
    const storageRef = ref(storage, key);
    e.preventDefault();

    try {
      //이미지 업로드
      //1.이미지 업로드먼저 수행한다.
      let imageUrl = "";
      if (imageFile) {
        const data = await uploadString(storageRef, imageFile, "data_url");
        imageUrl = await getDownloadURL(data?.ref);
      }
      //2.업로드 된 이미지의 download url을 업데이트
      await addDoc(collection(db, "posts"), {
        content: content,
        createdAt: new Date()?.toLocaleDateString("ko", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
        uid: user?.uid,
        email: user?.email,
        hashTags: tags,
        imageUrl,
      });
      setTags([]);
      setHashTag("");
      setContent("");
      toast.success("게시글 업로드 완료!");
      setImageFile(null);
      setIsSubmitting(false);
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
  const handleDeleteImg = () => {
    setImageFile(null);
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
              <img src={imageFile} alt="attachment" width={100} height={100} />
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
          value="올리기"
          className="post-form__submit-btn"
          disabled={isSubmitting}
        />
      </div>
    </form>
  );
}
