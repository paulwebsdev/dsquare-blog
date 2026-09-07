import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import NewsletterPopup from "../components/NewsletterPopup";

function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />

      <NewsletterPopup />
    </div>
  );
}

export default PublicLayout;