import { BsFillHouseFill } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { AiOutlineLogin, AiOutlineLogout } from "react-icons/ai";

import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "context/AuthContext";

export default function MenuList() {
  const { user } = useContext(AuthContext);
  console.log(user);
  const navigate = useNavigate();
  return (
    <div className="footer">
      <div className="footer__grid">
        <button type="button" onClick={() => navigate("/")}>
          <BsFillHouseFill />
          Home
        </button>
        <button type="button" onClick={() => navigate("/profile")}>
          <CgProfile />
          Profile
        </button>
        {user === null ? (
          <button type="button" onClick={() => navigate("/users/login")}>
            <AiOutlineLogin />
            Login
          </button>
        ) : (
          <button type="button" onClick={() => navigate("/")}>
            <AiOutlineLogout />
            Logout
          </button>
        )}
      </div>
    </div>
  );
}
