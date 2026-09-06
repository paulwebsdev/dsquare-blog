import { BrowserRouter, Routes, Route } from "react-router-dom";

// Public pages
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import Post from "./pages/Post";
import Category from "./pages/Category";
import Search from "./pages/Search";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Disclaimer from "./pages/Disclaimer";
import Unsubscribe from "./pages/Unsubscribe";

// Layout
import PublicLayout from "./layouts/PublicLayout";

// Admin pages
import Login from "./admin/Login";
import Dashboard from "./admin/Dashboard";
import Posts from "./admin/Posts";
import Editor from "./admin/Editor";
import Categories from "./admin/Categories";
import Settings from "./admin/Settings";
import AdminProtectedRoute from "./admin/AdminProtectedRoute";
import Newsletter from "./admin/Newsletter";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC WEBSITE */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<Post />} />
          <Route path="/category/:slug" element={<Category />} />
          <Route path="/search" element={<Search />} />

          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/disclaimer" element={<Disclaimer />} />

          {/* Newsletter unsubscribe */}
          <Route
            path="/unsubscribe/:token"
            element={<Unsubscribe />}
          />
        </Route>

        {/* ADMIN LOGIN */}
        <Route path="/admin/login" element={<Login />} />

        {/* ADMIN DASHBOARD */}
        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <Dashboard />
            </AdminProtectedRoute>
          }
        />

        {/* ADMIN POSTS */}
        <Route
          path="/admin/posts"
          element={
            <AdminProtectedRoute>
              <Posts />
            </AdminProtectedRoute>
          }
        />

        {/* ADMIN EDITOR */}
        <Route
          path="/admin/editor"
          element={
            <AdminProtectedRoute>
              <Editor />
            </AdminProtectedRoute>
          }
        />

        {/* ADMIN CATEGORIES */}
        <Route
          path="/admin/categories"
          element={
            <AdminProtectedRoute>
              <Categories />
            </AdminProtectedRoute>
          }
        />

        {/* ADMIN SETTINGS */}
        <Route
          path="/admin/settings"
          element={
            <AdminProtectedRoute>
              <Settings />
            </AdminProtectedRoute>
          }
        />

        {/* ADMIN NEWSLETTER */}
        <Route
          path="/admin/newsletter"
          element={
            <AdminProtectedRoute>
              <Newsletter />
            </AdminProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

