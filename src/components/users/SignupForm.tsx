import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { app } from "firebaseApp";
import { toast } from "react-toastify";

export default function SignupForm() {
  const [error, setError] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>("");
  const navigate = useNavigate();
  const onSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const auth = getAuth(app);
      createUserWithEmailAndPassword(auth, email, password);
      navigate("/");
      toast.success("🎉 성공적으로 가입되었습니다. ");
    } catch (error: any) {
      toast.error(error?.code);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;
    console.log(name, value);

    if (name === "email") {
      setEmail(value);
      const validRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
      if (!value?.match(validRegex)) {
        setError("이메일 형식이 올바르지 않습니다.");
      } else {
        setError("");
      }
    }
    if (name === "password") {
      setPassword(value);
      if (value?.length < 8) {
        setError("비밀번호는 8자리 이상 입력해주세요");
      } else if (value !== password) {
        setError("비밀번호가 일치하지 않습니다.");
      } else {
        setError("");
      }
    }
    if (name === "passwordConfirmation") {
      setPasswordConfirmation(value);
      if (value?.length < 8) {
        setError("비밀번호는 8자리 이상 입력해주세요");
      } else if (value !== password) {
        setError("비밀번호가 일치하지 않습니다.");
      } else {
        setError("");
      }
    }
  };
  return (
    <form className="form form--lg" onSubmit={onSubmit}>
      <div className="form__title">회원가입</div>
      <div className="form__block">
        <label htmlFor="email">이메일</label>
        <input
          type="text"
          name="email"
          id="email"
          value={email}
          onChange={onChange}
          required
        />
      </div>
      <div className="form__block">
        <label htmlFor="password">비밀번호</label>
        <input
          type="password"
          name="password"
          id="password"
          value={password}
          onChange={onChange}
          required
        />
      </div>
      <div className="form__block">
        <label htmlFor="passwordConfirmation">비밀번호 확인</label>
        <input
          type="password"
          name="passwordConfirmation"
          id="passwordConfirmation"
          value={passwordConfirmation}
          onChange={onChange}
          required
        />
      </div>
      {error && error?.length > 0 && (
        <div className="form__block">
          <div className="form__error">{error}</div>
        </div>
      )}
      <div className="form__block">
        계정이 있으신가요?
        <Link to="/login" className="form__link">
          로그인하기
        </Link>
      </div>
      <div className="form__block">
        <button
          type="submit"
          className="form__btn-submit"
          disabled={error?.length > 0}
        >
          회원가입
        </button>
      </div>
    </form>
  );
}
