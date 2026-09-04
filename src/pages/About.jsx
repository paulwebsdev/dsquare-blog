import { Link } from "react-router-dom";

function About() {
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

            <Link to="/about" className="font-medium text-blue-600">
              About
            </Link>

            <Link to="/contact" className="font-medium hover:text-blue-600">
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

      {/* HERO */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-5xl px-6 py-20 text-center">

          <p className="font-semibold text-blue-600">
            ABOUT DSQUARE WEB
          </p>

          <h1 className="mt-4 text-4xl font-bold md:text-5xl">
            Helping People Understand Technology
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-600">
            Dsquare Web is a technology and web development platform created
            to share practical knowledge about websites, technology, AI,
            freelancing and building online businesses.
          </p>

        </div>
      </section>

      {/* WHO WE ARE */}
      <section className="mx-auto max-w-5xl px-6 py-16">

        <div className="grid gap-12 md:grid-cols-2 md:items-center">

          <div>
            <p className="font-semibold text-blue-600">
              WHO WE ARE
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              More Than Just a Blog
            </h2>

            <p className="mt-5 leading-8 text-gray-600">
              Dsquare Web is focused on making technology easier to
              understand. We publish useful articles that explain real-world
              topics in a simple and practical way.
            </p>

            <p className="mt-4 leading-8 text-gray-600">
              Whether you're learning web development, trying to start a
              business online, exploring AI or looking for ways to build
              digital skills, our goal is to provide information you can
              actually use.
            </p>
          </div>

          <div className="rounded-2xl bg-gray-900 p-10 text-white">

            <div className="text-5xl">
              💡
            </div>

            <h3 className="mt-6 text-2xl font-bold">
              Learn. Build. Grow.
            </h3>

            <p className="mt-4 leading-7 text-gray-300">
              We believe technology becomes more powerful when people
              understand how to use it.
            </p>

          </div>

        </div>

      </section>

      {/* WHAT WE WRITE ABOUT */}
      <section className="bg-gray-50">

        <div className="mx-auto max-w-7xl px-6 py-16">

          <div className="text-center">

            <p className="font-semibold text-blue-600">
              OUR CONTENT
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              What You'll Find Here
            </h2>

          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

            <div className="rounded-xl border bg-white p-6">
              <div className="text-3xl">🌐</div>

              <h3 className="mt-4 text-xl font-bold">
                Websites
              </h3>

              <p className="mt-3 text-gray-600">
                Guides about websites, hosting, domains and online business.
              </p>
            </div>

            <div className="rounded-xl border bg-white p-6">
              <div className="text-3xl">💻</div>

              <h3 className="mt-4 text-xl font-bold">
                Development
              </h3>

              <p className="mt-3 text-gray-600">
                Tutorials and explanations for developers and beginners.
              </p>
            </div>

            <div className="rounded-xl border bg-white p-6">
              <div className="text-3xl">🤖</div>

              <h3 className="mt-4 text-xl font-bold">
                AI & Technology
              </h3>

              <p className="mt-3 text-gray-600">
                Articles about artificial intelligence and emerging technology.
              </p>
            </div>

            <div className="rounded-xl border bg-white p-6">
              <div className="text-3xl">💰</div>

              <h3 className="mt-4 text-xl font-bold">
                Digital Income
              </h3>

              <p className="mt-3 text-gray-600">
                Freelancing, digital skills and online opportunities.
              </p>
            </div>

          </div>

        </div>

      </section>

      {/* WHY DSQUARE WEB */}
      <section className="mx-auto max-w-5xl px-6 py-16">

        <div className="text-center">

          <p className="font-semibold text-blue-600">
            OUR APPROACH
          </p>

          <h2 className="mt-3 text-3xl font-bold">
            Practical Information, Not Just Theory
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-8 text-gray-600">
            We aim to create content that answers real questions and helps
            readers make better decisions about technology and their online
            projects.
          </p>

        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">

          <div className="rounded-xl border p-6">
            <h3 className="text-xl font-bold">
              Simple
            </h3>

            <p className="mt-3 text-gray-600">
              Complex technology explained in a way that's easy to understand.
            </p>
          </div>

          <div className="rounded-xl border p-6">
            <h3 className="text-xl font-bold">
              Practical
            </h3>

            <p className="mt-3 text-gray-600">
              Guides focused on things you can actually apply.
            </p>
          </div>

          <div className="rounded-xl border p-6">
            <h3 className="text-xl font-bold">
              Useful
            </h3>

            <p className="mt-3 text-gray-600">
              Content designed to help readers solve real problems.
            </p>
          </div>

        </div>

      </section>

      {/* CONTACT CTA */}
      <section className="bg-gray-900 text-white">

        <div className="mx-auto max-w-4xl px-6 py-16 text-center">

          <h2 className="text-3xl font-bold">
            Have a Question?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-gray-400">
            If you have a question about our content, technology or anything
            related to Dsquare Web, we'd love to hear from you.
          </p>

          <a
            href="mailto:dsquareweb.contact@gmail.com"
            className="mt-7 inline-block rounded-lg bg-blue-600 px-7 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Email Us
          </a>

        </div>

      </section>

      {/* FOOTER */}
      <footer className="bg-black text-white">

        <div className="mx-auto max-w-7xl px-6 py-10">

          <div className="flex flex-col justify-between gap-6 md:flex-row">

            <div>
              <h2 className="text-2xl font-bold">
                Dsquare<span className="text-blue-400">Web</span>
              </h2>

              <p className="mt-3 text-gray-500">
                Learn. Build. Grow. With Technology.
              </p>
            </div>

            <div className="flex flex-wrap gap-6 text-gray-500">

              <Link to="/blog" className="hover:text-white">
                Blog
              </Link>

              <Link to="/contact" className="hover:text-white">
                Contact
              </Link>

              <Link to="/privacy" className="hover:text-white">
                Privacy
              </Link>

              <Link to="/terms" className="hover:text-white">
                Terms
              </Link>

            </div>

          </div>

          <div className="mt-8 border-t border-gray-800 pt-6 text-center text-sm text-gray-600">
            © 2026 Dsquare Web. All rights reserved.
          </div>

        </div>

      </footer>

    </div>
  );
}

export default About;