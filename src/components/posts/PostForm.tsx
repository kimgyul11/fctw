import { FiImage } from "react-icons/fi";

export default function PostForm() {
  const handleFileUpload = () => {};
  return (
    <form className="post-form">
      <textarea
        className="post-form__textarea"
        name="content"
        id="content"
        placeholder="글입력해라"
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
        <input type="submit" value="올리기" className="post-form__submit-btn" />
      </div>
    </form>
  );
}
