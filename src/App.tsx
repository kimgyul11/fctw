import "./App.css";
import { Route, Routes, Navigate } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<h1>HomePage</h1>} />
      <Route path="/posts" element={<h1>Post Page</h1>} />
      <Route path="/posts/:id" element={<h1>Post Detail Page</h1>} />
      <Route path="/posts/new" element={<h1>New Post Page</h1>} />
      <Route path="/posts/edit/:id" element={<h1>Post Edit Page</h1>} />
      <Route path="/profile" element={<h1>profile</h1>} />
      <Route path="/profile/edit" element={<h1>profile edit</h1>} />
      <Route path="/notifications" element={<h1>notifications</h1>} />
      <Route path="/search" element={<h1>Post Page</h1>} />
      <Route path="/login" element={<h1>login</h1>} />
      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  );
}

export default App;
