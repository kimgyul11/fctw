import HomePage from "pages/home";
import NotificationPage from "pages/notification";
import PostListPage from "pages/posts";
import PostDetail from "pages/posts/detail";
import PostEdit from "pages/posts/edit";
import PostNew from "pages/posts/new";
import ProfilePage from "pages/profile";
import ProfileEdit from "pages/profile/edit";
import SearchPage from "pages/search";
import DetailSearch from "pages/search/detailSearch";
import LoginPage from "pages/users/login";
import SignupPage from "pages/users/signup";
import { Route, Routes, Navigate } from "react-router-dom";

interface RouterPorps {
  isAuthenticated: boolean;
}

export default function Router({ isAuthenticated }: RouterPorps) {
  return (
    <Routes>
      {isAuthenticated ? (
        <>
          <Route path="/" element={<HomePage />} />
          <Route path="/posts" element={<PostListPage />} />
          <Route path="/posts/:id" element={<PostDetail />} />
          <Route path="/posts/new" element={<PostNew />} />
          <Route path="/posts/edit/:id" element={<PostEdit />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/edit" element={<ProfileEdit />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/search/:id" element={<DetailSearch />} />
          <Route path="/notifications" element={<NotificationPage />} />
        </>
      ) : (
        <>
          <Route path="/users/login" element={<LoginPage />} />
          <Route path="/users/signup" element={<SignupPage />} />
          <Route path="*" element={<Navigate replace to="/users/login" />} />
        </>
      )}
    </Routes>
  );
}
