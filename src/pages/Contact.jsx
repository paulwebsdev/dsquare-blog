import { Link } from "react-router-dom";

function Contact() {
  return (
    <div className="min-h-screen bg-white text-gray-900">

      {/* NAVBAR */}
      <nav className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <Link to="/" className="text-2xl font-bold">
            Dsquare<span className="text-blue-600">Web</span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <Link to="/" className="font-medium hover:text-blue-600">
              Home
            </Link>

            <Link to="/blog" className="font-medium hover:text-blue-600">
              Blog
            </Link>

            <Link to="/about" className="font-medium hover:text-blue-600">
              About
            </Link>

            <Link to="/contact" className="font-medium text-blue-600">
              Contact
            </Link>
          </div>

          <Link
            to="/blog"
            className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700"
          >
            Read Blog
          </Link>

        </div>
      </nav>

      {/* HEADER */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-5xl px-6 py-16 text-center">

          <p className="font-semibold text-blue-600">
            GET IN TOUCH
          </p>

          <h1 className="mt-3 text-4xl font-bold md:text-5xl">
            Contact Dsquare Web
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-gray-600">
            Have a question, suggestion, feedback or business inquiry?
            We'd love to hear from you.
          </p>

        </div>
      </section>

      {/* CONTACT CONTENT */}
      <main className="mx-auto max-w-6xl px-6 py-16">

        <div className="grid gap-12 md:grid-cols-2">

          {/* CONTACT INFO */}
          <div>

            <p className="font-semibold text-blue-600">
              CONTACT INFORMATION
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              Let's Talk
            </h2>

            <p className="mt-5 leading-8 text-gray-600">
              Whether you have a question about an article, want to suggest
              a topic or want to discuss a website project, you can reach us
              through the information below.
            </p>

            <div className="mt-10 space-y-6">

              {/* EMAIL */}
              <div className="flex gap-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-xl">
                  📧
                </div>

                <div>
                  <h3 className="font-bold">
                    Email
                  </h3>

                  <a
                    href="mailto:dsquareweb.contact@gmail.com"
                    className="mt-1 block text-gray-600 hover:text-blue-600"
                  >
                    dsquareweb.contact@gmail.com
                  </a>
                </div>

              </div>

              {/* WEBSITE */}
              <div className="flex gap-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-xl">
                  🌐
                </div>

                <div>
                  <h3 className="font-bold">
                    Dsquare Web
                  </h3>

                  <p className="mt-1 text-gray-600">
                    Web development & digital solutions
                  </p>
                </div>

              </div>

              {/* RESPONSE */}
              <div className="flex gap-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-xl">
                  ⚡
                </div>

                <div>
                  <h3 className="font-bold">
                    Response Time
                  </h3>

                  <p className="mt-1 text-gray-600">
                    We aim to respond as soon as possible.
                  </p>
                </div>

              </div>

            </div>

          </div>

          {/* CONTACT FORM */}
          <div className="rounded-2xl border bg-white p-6 shadow-sm md:p-8">

            <h2 className="text-2xl font-bold">
              Send Us a Message
            </h2>

            <p className="mt-2 text-gray-600">
              Fill out the form and we'll get back to you.
            </p>

            <form className="mt-8 space-y-5">

              {/* NAME */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold"
                >
                  Your Name
                </label>

                <input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-600"
                />
              </div>

              {/* EMAIL */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold"
                >
                  Email Address
                </label>

                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-600"
                />
              </div>

              {/* SUBJECT */}
              <div>
                <label
                  htmlFor="subject"
                  className="mb-2 block text-sm font-semibold"
                >
                  Subject
                </label>

                <input
                  id="subject"
                  type="text"
                  placeholder="What is this about?"
                  className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-600"
                />
              </div>

              {/* MESSAGE */}
              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-semibold"
                >
                  Message
                </label>

                <textarea
                  id="message"
                  rows="6"
                  placeholder="Write your message..."
                  className="w-full resize-none rounded-lg border px-4 py-3 outline-none focus:border-blue-600"
                />
              </div>

              {/* BUTTON */}
              <button
                type="button"
                className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
              >
                Send Message
              </button>

            </form>

          </div>

        </div>

      </main>

      {/* CTA */}
      <section className="bg-gray-50">

        <div className="mx-auto max-w-4xl px-6 py-14 text-center">

          <h2 className="text-2xl font-bold">
            Looking for a Website?
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-gray-600">
            If you're a business owner looking for a professional website,
            Dsquare Web can help you build your online presence.
          </p>

          <a
            href="mailto:dsquareweb.contact@gmail.com"
            className="mt-6 inline-block rounded-lg bg-gray-900 px-6 py-3 font-semibold text-white hover:bg-gray-800"
          >
            Talk to Dsquare Web
          </a>

        </div>

      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white">

        <div className="mx-auto max-w-7xl px-6 py-12">

          <div className="flex flex-col justify-between gap-8 md:flex-row">

            <div>
              <h2 className="text-2xl font-bold">
                Dsquare<span className="text-blue-400">Web</span>
              </h2>

              <p className="mt-3 max-w-md text-gray-400">
                Learn. Build. Grow. With Technology.
              </p>
            </div>

            <div className="flex flex-wrap gap-6 text-gray-400">

              <Link to="/" className="hover:text-white">
                Home
              </Link>

              <Link to="/blog" className="hover:text-white">
                Blog
              </Link>

              <Link to="/about" className="hover:text-white">
                About
              </Link>

              <Link to="/privacy" className="hover:text-white">
                Privacy
              </Link>

              <Link to="/terms" className="hover:text-white">
                Terms
              </Link>

            </div>

          </div>

          <div className="mt-10 border-t border-gray-800 pt-6 text-center text-sm text-gray-500">
            © 2026 Dsquare Web. All rights reserved.
          </div>

        </div>

      </footer>

    </div>
  );
}

export default Contact;