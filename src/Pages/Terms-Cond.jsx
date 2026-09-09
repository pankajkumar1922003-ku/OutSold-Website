import { ArrowLeft, FileText, Mail } from "lucide-react";

const TermsConditions = () => {
  return (
    <div className="min-h-screen bg-[#f8faf9] text-[#123331]">
      
      {/* Header */}
      <div className="border-b border-[#123331]/10 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5 sm:px-8">
          
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-sm font-medium text-[#123331]/70 transition hover:text-[#007A78]"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#007A78]/10 text-[#007A78]">
              <FileText size={22} />
            </div>

            <span className="text-xl font-bold">
              Out<span className="text-[#007A78]">Sold</span>
            </span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="border-b border-[#123331]/10 bg-white">
        <div className="mx-auto max-w-5xl px-5 py-14 sm:px-8 sm:py-20">
          
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#007A78]/10 px-4 py-2 text-sm font-medium text-[#007A78]">
            <FileText size={16} />
            Please read these terms carefully
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Terms & Conditions
          </h1>

          <p className="mt-6 max-w-3xl text-base leading-8 text-[#123331]/65 sm:text-lg">
            These Terms and Conditions govern your access to and use of the
            OutSold website, platform, and related services.
          </p>

          <p className="mt-6 text-sm text-[#123331]/50">
            Last Updated: September 9, 2026
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-[#123331]/5 sm:p-10 lg:p-14">
          
          <p className="leading-8 text-[#123331]/70">
            Welcome to OutSold. By accessing or using our website, platform,
            or related services, you agree to be bound by these Terms and
            Conditions. If you do not agree with any part of these terms,
            please do not use our services.
          </p>

          {/* Section 1 */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold">
              1. Acceptance of Terms
            </h2>

            <p className="mt-5 leading-8 text-[#123331]/70">
              By accessing or using OutSold, you confirm that you have read,
              understood, and agree to comply with these Terms and Conditions
              and our Privacy Policy.
            </p>
          </section>

          {/* Section 2 */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold">
              2. Use of Our Platform
            </h2>

            <p className="mt-5 leading-8 text-[#123331]/70">
              OutSold provides tools and services designed to help users
              discover, create, manage, and participate in events.
            </p>

            <p className="mt-5 leading-8 text-[#123331]/70">
              You agree to use our platform only for lawful purposes and in
              accordance with these Terms and applicable laws.
            </p>
          </section>

          {/* Section 3 */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold">
              3. User Accounts
            </h2>

            <p className="mt-5 leading-8 text-[#123331]/70">
              Certain features of our platform may require you to create an
              account. You are responsible for providing accurate and complete
              information and for maintaining the confidentiality of your
              account credentials.
            </p>

            <p className="mt-5 leading-8 text-[#123331]/70">
              You are responsible for all activities that occur under your
              account. Please notify us immediately if you believe that your
              account has been accessed without authorization.
            </p>
          </section>

          {/* Section 4 */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold">
              4. Event Organizers
            </h2>

            <p className="mt-5 leading-8 text-[#123331]/70">
              Event organizers are responsible for ensuring that the events
              they create and manage through OutSold comply with all applicable
              laws and regulations.
            </p>

            <p className="mt-5 leading-8 text-[#123331]/70">
              Organizers are responsible for the accuracy of event details,
              ticket information, pricing, schedules, venue details, and all
              other information provided to attendees.
            </p>

            <p className="mt-5 leading-8 text-[#123331]/70">
              OutSold is not responsible for the cancellation, postponement,
              quality, safety, or execution of events organized by third
              parties.
            </p>
          </section>

          {/* Section 5 */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold">
              5. Event Attendees and Registrations
            </h2>

            <p className="mt-5 leading-8 text-[#123331]/70">
              Users who register for events are responsible for providing
              accurate information during the registration process.
            </p>

            <p className="mt-5 leading-8 text-[#123331]/70">
              Event-specific rules, requirements, cancellation policies, and
              refund policies may be established by individual event
              organizers. Users should review these policies before completing
              a registration or purchase.
            </p>
          </section>

          {/* Section 6 */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold">
              6. Payments and Transactions
            </h2>

            <p className="mt-5 leading-8 text-[#123331]/70">
              Certain events or services may require payment. Payments may be
              processed through third-party payment providers.
            </p>

            <p className="mt-5 leading-8 text-[#123331]/70">
              OutSold does not guarantee that all payment transactions will be
              completed successfully and may not be responsible for issues
              arising from third-party payment services.
            </p>
          </section>

          {/* Section 7 */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold">
              7. Prohibited Activities
            </h2>

            <p className="mt-5 leading-8 text-[#123331]/70">
              You agree not to:
            </p>

            <ul className="mt-4 list-disc space-y-2 pl-6 text-[#123331]/70">
              <li>Use the platform for unlawful or fraudulent purposes</li>
              <li>Provide false or misleading information</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with the security or functionality of the platform</li>
              <li>Upload malicious software or harmful content</li>
              <li>Violate the rights of other users or third parties</li>
              <li>Use the platform to distribute spam or unauthorized advertising</li>
            </ul>
          </section>

          {/* Section 8 */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold">
              8. Intellectual Property
            </h2>

            <p className="mt-5 leading-8 text-[#123331]/70">
              The OutSold website, platform, branding, design, software,
              graphics, and other content are protected by applicable
              intellectual property laws.
            </p>

            <p className="mt-5 leading-8 text-[#123331]/70">
              You may not copy, reproduce, distribute, modify, or use our
              intellectual property without prior written permission.
            </p>
          </section>

          {/* Section 9 */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold">
              9. Third-Party Services
            </h2>

            <p className="mt-5 leading-8 text-[#123331]/70">
              Our platform may integrate with or contain links to third-party
              websites and services. OutSold is not responsible for the
              content, availability, security, or practices of third-party
              services.
            </p>
          </section>

          {/* Section 10 */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold">
              10. Limitation of Liability
            </h2>

            <p className="mt-5 leading-8 text-[#123331]/70">
              To the maximum extent permitted by applicable law, OutSold shall
              not be liable for any indirect, incidental, special,
              consequential, or punitive damages arising from your use of or
              inability to use our platform.
            </p>

            <p className="mt-5 leading-8 text-[#123331]/70">
              OutSold is not responsible for losses, damages, injuries, or
              other issues arising from events organized or managed by
              independent event organizers.
            </p>
          </section>

          {/* Section 11 */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold">
              11. Suspension or Termination
            </h2>

            <p className="mt-5 leading-8 text-[#123331]/70">
              We may suspend or terminate access to our platform if we believe
              that a user has violated these Terms, engaged in fraudulent
              activity, or created a risk to the platform or other users.
            </p>
          </section>

          {/* Section 12 */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold">
              12. Changes to These Terms
            </h2>

            <p className="mt-5 leading-8 text-[#123331]/70">
              We may update these Terms and Conditions from time to time.
              Updated terms will be posted on this page along with a revised
              "Last Updated" date.
            </p>
          </section>

          {/* Section 13 */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold">
              13. Contact Us
            </h2>

            <p className="mt-5 leading-8 text-[#123331]/70">
              If you have any questions regarding these Terms and Conditions,
              please contact us.
            </p>

            <a
              href="mailto:hello@outsold.com"
              className="mt-6 flex w-fit items-center gap-3 rounded-xl bg-[#007A78]/10 px-5 py-4 font-medium text-[#007A78] transition hover:bg-[#007A78] hover:text-white"
            >
              <Mail size={20} />
              hello@outsold.com
            </a>
          </section>
        </div>
      </main>
    </div>
  );
};

export default TermsConditions;