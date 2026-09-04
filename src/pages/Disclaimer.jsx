import { Link } from "react-router-dom";

function Disclaimer() {
  return (
    <div className="min-h-screen bg-white text-gray-900">

      {/* NAVBAR */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <Link to="/" className="text-2xl font-bold">
            Dsquare<span className="text-blue-600">Web</span>
          </Link>

          <div className="hidden gap-8 md:flex">
            <Link to="/" className="text-gray-600 hover:text-blue-600">
              Home
            </Link>

            <Link to="/blog" className="text-gray-600 hover:text-blue-600">
              Blog
            </Link>

            <Link to="/about" className="text-gray-600 hover:text-blue-600">
              About
            </Link>

            <Link to="/contact" className="text-gray-600 hover:text-blue-600">
              Contact
            </Link>
          </div>

        </div>
      </nav>

      {/* HEADER */}
      <section className="bg-gray-50 px-6 py-16 text-center">

        <h1 className="text-4xl font-bold md:text-5xl">
          Disclaimer
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-gray-600">
          Important information about the content, recommendations,
          links, and services published on Dsquare Web.
        </p>

        <p className="mt-4 text-sm text-gray-500">
          Last updated: September 2, 2026
        </p>

      </section>

      {/* CONTENT */}
      <main className="mx-auto max-w-4xl px-6 py-16">

        <div className="space-y-10 leading-8 text-gray-700">

          {/* 1 */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              1. General Information
            </h2>

            <p>
              The information published on Dsquare Web is provided for
              general informational and educational purposes only.
            </p>

            <p className="mt-4">
              While we aim to provide useful, accurate, and practical
              information, we do not guarantee that all information on the
              website is complete, accurate, or current at all times.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              2. No Professional Advice
            </h2>

            <p>
              Content published on Dsquare Web should not be considered
              professional, legal, financial, investment, business, or
              technical advice.
            </p>

            <p className="mt-4">
              You should conduct your own research and, where appropriate,
              consult a qualified professional before making important
              decisions.
            </p>
          </section>

          {/* 3 */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              3. Technology and Software
            </h2>

            <p>
              Technology, software, programming languages, platforms, prices,
              features, and services can change frequently.
            </p>

            <p className="mt-4">
              As a result, tutorials and technical information may become
              outdated or behave differently depending on the software
              version, operating system, hosting provider, or other
              circumstances.
            </p>
          </section>

          {/* 4 */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              4. Making Money and Business Content
            </h2>

            <p>
              Articles discussing freelancing, online businesses,
              entrepreneurship, websites, digital skills, or making money
              are educational in nature.
            </p>

            <p className="mt-4">
              We do not guarantee that following any strategy, method, or
              recommendation will result in a specific income or business
              outcome.
            </p>
          </section>

          {/* 5 */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              5. Artificial Intelligence
            </h2>

            <p>
              Information about artificial intelligence and AI tools is
              provided for educational and informational purposes.
            </p>

            <p className="mt-4">
              AI tools and their capabilities can change rapidly. Always
              verify important information and review AI-generated results
              before relying on them.
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              6. External Links
            </h2>

            <p>
              Dsquare Web may link to external websites, applications,
              products, services, or resources.
            </p>

            <p className="mt-4">
              We do not control these third-party websites and are not
              responsible for their content, availability, security, or
              privacy practices.
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              7. Affiliate Links
            </h2>

            <p>
              In the future, Dsquare Web may participate in affiliate
              programs. This means we may earn a commission if you purchase
              certain products or services through qualifying links.
            </p>

            <p className="mt-4">
              Affiliate relationships will not change the price you pay
              unless otherwise stated.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              8. Advertising
            </h2>

            <p>
              Dsquare Web may display advertisements from third-party
              advertising networks in the future.
            </p>

            <p className="mt-4">
              Advertisements may be selected or delivered by advertising
              providers based on factors such as content, browsing activity,
              or other permitted information.
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              9. Personal Responsibility
            </h2>

            <p>
              You are responsible for how you use information obtained from
              Dsquare Web.
            </p>

            <p className="mt-4">
              Before making financial, business, technical, or other
              significant decisions, you should independently verify
              information and consider your own circumstances.
            </p>
          </section>

          {/* 10 */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              10. Changes to This Disclaimer
            </h2>

            <p>
              We may update this Disclaimer from time to time as the website,
              services, content, or applicable requirements change.
            </p>
          </section>

          {/* 11 */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              11. Contact Us
            </h2>

            <p>
              If you have questions about this Disclaimer, you can contact
              Dsquare Web at:
            </p>

            <p className="mt-4 font-semibold text-blue-600">
              dsquareweb.contact@gmail.com
            </p>
          </section>

        </div>

        {/* BACK */}
        <div className="mt-12 border-t border-gray-200 pt-8">

          <Link
            to="/"
            className="font-semibold text-blue-600 hover:underline"
          >
            ← Back to Home
          </Link>

        </div>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-gray-200 bg-gray-50 px-6 py-10">

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 md:flex-row">

          <p className="text-sm text-gray-500">
            © 2026 Dsquare Web. All rights reserved.
          </p>

          <div className="flex gap-5 text-sm">

            <Link
              to="/privacy"
              className="text-gray-600 hover:text-blue-600"
            >
              Privacy
            </Link>

            <Link
              to="/terms"
              className="text-gray-600 hover:text-blue-600"
            >
              Terms
            </Link>

            <Link
              to="/disclaimer"
              className="text-gray-600 hover:text-blue-600"
            >
              Disclaimer
            </Link>

          </div>

        </div>

      </footer>

    </div>
  );
}

export default Disclaimer;

