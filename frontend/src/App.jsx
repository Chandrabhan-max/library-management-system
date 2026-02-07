import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";

import Home from "./pages/Home/home";
import Resources from "./pages/Resources (Books)/Resources";
import MyBorrowedBooks from "./pages/User Books/MyBorrowedBooks";
import Profile from "./pages/Profile/Profile";

import Admin from "./pages/Admin Control/Admin";
import AdminBooks from "./pages/Admin Control/AdminBooks";
import AdminUsers from "./pages/Admin Control/AdminUsers";

import Login from "./auth/Login";
import Register from "./auth/Register";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/" element={<Navigate to="/home" />} />

        <Route path="/home" element={<Home />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/my-books" element={<MyBorrowedBooks />} />
        <Route path="/profile" element={<Profile />} />

        <Route path="/admin" element={<Admin />}>
          <Route index element={<Navigate to="books" />} />
          <Route path="books" element={<AdminBooks />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>

        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
