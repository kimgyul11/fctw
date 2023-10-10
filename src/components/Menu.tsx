import { BsFillHouseFill } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { AiOutlineLogin, AiOutlineLogout } from "react-icons/ai";
import { BsSearch, BsBell } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "context/AuthContext";
import { getAuth, signOut } from "firebase/auth";
import { app } from "firebaseApp";
import { toast } from "react-toastify";
import useTranslation from "hooks/useTranslation";

export default function MenuList() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const t = useTranslation();
  return (
    <div className="footer">
      <div className="footer__grid">
        <button type="button" onClick={() => navigate("/")}>
          <BsFillHouseFill />
          {t("MENU_HOME")}
        </button>
        <button type="button" onClick={() => navigate("/profile")}>
          <CgProfile />
          {t("MENU_PROFILE")}
        </button>
        <button type="button" onClick={() => navigate("/search")}>
          <BsSearch />
          {t("MENU_SEARCH")}
        </button>
        <button type="button" onClick={() => navigate("/notifications")}>
          <BsBell />
          {t("MENU_NOTIFICATIONS")}
        </button>

        {user === null ? (
          <button type="button" onClick={() => navigate("/users/login")}>
            <AiOutlineLogin />
            {t("MENU_LOGIN")}
          </button>
        ) : (
          <button
            type="button"
            onClick={async () => {
              const auth = getAuth(app);
              await signOut(auth);
              alert("로그아웃 하실건가요?");
              toast.success("로그아웃 되었습니다!");
            }}
          >
            <AiOutlineLogout />
            {t("MENU_LOGOUT")}
          </button>
        )}
      </div>
    </div>
  );
}
