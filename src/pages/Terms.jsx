import { Link } from "react-router-dom";

function Terms() {
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
          Terms & Conditions
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-gray-600">
          These terms explain the rules and conditions for using the
          Dsquare Web website.
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
              1. Acceptance of Terms
            </h2>

            <p>
              By accessing or using Dsquare Web, you agree to be bound by
              these Terms & Conditions. If you do not agree with these terms,
              please do not use the website.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              2. About Dsquare Web
            </h2>

            <p>
              Dsquare Web is a technology-focused platform that publishes
              articles, tutorials, guides, opinions, and other educational
              content relating to websites, web development, artificial
              intelligence, technology, digital skills, and online
              opportunities.
            </p>
          </section>

          {/* 3 */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              3. Use of Our Content
            </h2>

            <p>
              The content published on Dsquare Web is provided for
              informational and educational purposes.
            </p>

            <p className="mt-4">
              You may read, share, and reference our content for personal or
              educational purposes, provided that you do not misrepresent our
              content as your own.
            </p>
          </section>

          {/* 4 */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              4. Intellectual Property
            </h2>

            <p>
              Unless otherwise stated, the original text, branding, design,
              graphics, logos, and other materials created for Dsquare Web
              belong to Dsquare Web or their respective owners.
            </p>

            <p className="mt-4">
              You may not reproduce, modify, distribute, or commercially
              exploit our original content without appropriate permission.
            </p>
          </section>

          {/* 5 */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              5. Accuracy of Information
            </h2>

            <p>
              We make reasonable efforts to provide useful and accurate
              information. However, technology, software, prices, services,
              laws, and other information may change over time.
            </p>

            <p className="mt-4">
              We do not guarantee that every piece of information published
              on the website will always be complete, current, or error-free.
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              6. External Links
            </h2>

            <p>
              Our website may contain links to websites, tools, products,
              services, or resources operated by third parties.
            </p>

            <p className="mt-4">
              These links are provided for convenience or additional
              information. Dsquare Web does not control third-party websites
              and is not responsible for their content, availability, or
              policies.
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              7. Website Availability
            </h2>

            <p>
              We aim to keep Dsquare Web available and functioning properly.
              However, we cannot guarantee that the website will always be
              available, uninterrupted, or free from technical problems.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              8. Limitation of Liability
            </h2>

            <p>
              Dsquare Web will not be responsible for losses, damages, or
              consequences resulting from reliance on information published
              on the website.
            </p>

            <p className="mt-4">
              Visitors are responsible for evaluating information and
              deciding how to apply it to their individual circumstances.
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              9. Prohibited Activities
            </h2>

            <p>
              When using Dsquare Web, you agree not to use the website for
              unlawful, abusive, fraudulent, harmful, or malicious purposes.
            </p>
          </section>

          {/* 10 */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              10. Changes to These Terms
            </h2>

            <p>
              We may update these Terms & Conditions from time to time.
              Changes will become effective when the updated terms are
              published on this page.
            </p>
          </section>

          {/* 11 */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              11. Contact
            </h2>

            <p>
              If you have questions about these Terms & Conditions, you can
              contact Dsquare Web at:
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

export default Terms;
