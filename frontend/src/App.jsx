import { Routes, Route } from "react-router-dom";

// Components / Pages
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";

import Home from "./pages/Home";
import About from "./pages/About";
import MainPage from "./pages/MainPage";
import CreatePost from "./pages/CreatePost";
import SinglePost from "./pages/SinglePost";

import Profile from "./pages/Profile";
import Account from "./components/Account";

import Search from "./pages/Search";
import TagPosts from "./pages/TagPosts";
import Notifications from "./pages/Notifications";

function App() {
  return (
    <div className="min-h-screen w-screen bg-cover bg-no-repeat bg-center bg-fixed overflow-x-hidden overflow-y-auto">
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/reg" element={<Registration />} />

        {/* Protected routes wrapped by Navbar */}
        <Route element={<Navbar />}>
          <Route path="/" element={<Home />} />

          <Route
            path="/mainpage"
            element={
              <PrivateRoute>
                <MainPage />
              </PrivateRoute>
            }
          />


          <Route
            path="/about"
            element={
              <PrivateRoute>
                <About />
              </PrivateRoute>
            }
          />

          <Route
            path="/posts/new"
            element={
              <PrivateRoute>
                <CreatePost />
              </PrivateRoute>
            }
          />

          <Route
            path="/posts/edit/:id"
            element={
              <PrivateRoute>
                <CreatePost />
              </PrivateRoute>
            }
          />

          <Route
            path="/posts/:id"
            element={
              <PrivateRoute>
                <SinglePost />
              </PrivateRoute>
            }
          />

          {/* ✅ Account page for updating avatar */}
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />

          {/* ✅ Profile page for viewing user profiles */}
          <Route
            path="/profile/:userId"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />

          {/* Search page */}
          <Route
            path="/search"
            element={
              <PrivateRoute>
                <Search />
              </PrivateRoute>
            }
          />

          {/* Tag page */}
          <Route
            path="/tags/:tag"
            element={
              <PrivateRoute>
                <TagPosts />
              </PrivateRoute>
            }
          />

          {/* Notifications */}
          <Route
            path="/notifications"
            element={
              <PrivateRoute>
                <Notifications />
              </PrivateRoute>
            }
          />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
