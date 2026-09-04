import { Link } from "react-router-dom";

function Privacy() {
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
          Privacy Policy
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-gray-600">
          Your privacy matters to us. This page explains how Dsquare Web
          handles information when you use our website.
        </p>

        <p className="mt-4 text-sm text-gray-500">
          Last updated: September 2, 2026
        </p>
      </section>

      {/* CONTENT */}
      <main className="mx-auto max-w-4xl px-6 py-16">

        <div className="space-y-10 leading-8 text-gray-700">

          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              1. Introduction
            </h2>

            <p>
              Welcome to Dsquare Web. We respect your privacy and are
              committed to protecting any information that may be collected
              when you use our website.
            </p>

            <p className="mt-4">
              This Privacy Policy explains what information we may collect,
              how we may use it, and how we protect it.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              2. Information We May Collect
            </h2>

            <p>
              Depending on how you interact with the website, we may collect
              information such as your name, email address, and any other
              information you voluntarily provide through our contact forms
              or other features.
            </p>

            <p className="mt-4">
              We may also collect basic technical information such as browser
              type, device information, approximate location, pages visited,
              and general website usage information.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              3. How We Use Information
            </h2>

            <p>Information may be used to:</p>

            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>Respond to messages and enquiries.</li>
              <li>Improve our website and content.</li>
              <li>Understand how visitors use the website.</li>
              <li>Provide requested services or information.</li>
              <li>Maintain website security and functionality.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              4. Cookies
            </h2>

            <p>
              Dsquare Web may use cookies and similar technologies to improve
              website functionality and understand how visitors interact
              with the website.
            </p>

            <p className="mt-4">
              Cookies are small files stored on your device. You can usually
              control or disable cookies through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              5. Analytics
            </h2>

            <p>
              We may use analytics services in the future to understand
              website traffic, visitor behaviour, and content performance.
              These services may collect information such as pages visited,
              device type, and general geographic information.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              6. Advertising
            </h2>

            <p>
              Dsquare Web may display advertisements in the future. Third-party
              advertising providers may use cookies or similar technologies to
              provide relevant advertisements and measure advertising
              performance.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              7. Third-Party Links
            </h2>

            <p>
              Our articles or website may contain links to third-party
              websites. We are not responsible for the privacy practices,
              content, or security of websites operated by third parties.
            </p>

            <p className="mt-4">
              We encourage you to review the privacy policies of external
              websites before providing them with personal information.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              8. Data Security
            </h2>

            <p>
              We take reasonable measures to protect information submitted
              through our website. However, no method of transmission or
              storage over the internet can be guaranteed to be completely
              secure.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              9. Children's Privacy
            </h2>

            <p>
              Dsquare Web is not intentionally designed to collect personal
              information from children. If you believe that a child has
              provided personal information through our website, please
              contact us so that appropriate action can be taken.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              10. Changes to This Privacy Policy
            </h2>

            <p>
              We may update this Privacy Policy from time to time as our
              website, services, or legal requirements change. Any updates
              will be published on this page with a new revision date.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              11. Contact Us
            </h2>

            <p>
              If you have questions about this Privacy Policy or how your
              information is handled, you can contact us at:
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
            <Link to="/privacy" className="text-gray-600 hover:text-blue-600">
              Privacy
            </Link>

            <Link to="/terms" className="text-gray-600 hover:text-blue-600">
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

export default Privacy;