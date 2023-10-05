import { BsFillHouseFill } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { AiOutlineLogout } from "react-icons/ai";

import { useNavigate } from "react-router-dom";

export default function MenuList() {
  const navigate = useNavigate();
  return (
    <div className="footer">
      <div className="footer__grid">
        <button type="button" onClick={() => navigate("/")}>
          <BsFillHouseFill />
        </button>
        <button type="button" onClick={() => navigate("/profile")}>
          {/* 유저 프로필이 있다면 이미지 아니면 아이콘 */}
          <CgProfile />
        </button>
        <button type="button" onClick={() => navigate("/")}>
          <AiOutlineLogout />
        </button>
      </div>
    </div>
  );
}
