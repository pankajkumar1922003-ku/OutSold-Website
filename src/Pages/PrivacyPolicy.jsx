import { ArrowLeft, ShieldCheck, Mail } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-[#f8faf9] text-[#123331]">

      {/* Hero */}
      <section className="border-b border-[#123331]/10 bg-white">
        <div className="mx-auto max-w-5xl px-5 py-14 sm:px-8 sm:py-20">
          
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#007A78]/10 px-4 py-2 text-sm font-medium text-[#007A78]">
            <ShieldCheck size={16} />
            Your privacy matters to us
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Privacy Policy
          </h1>

          <p className="mt-6 max-w-3xl text-base leading-8 text-[#123331]/65 sm:text-lg">
            This Privacy Policy explains how OutSold collects, uses, stores,
            and protects your information when you use our website and
            platform.
          </p>

          <p className="mt-6 text-sm text-[#123331]/50">
            Last Updated: September 9, 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <main className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-[#123331]/5 sm:p-10 lg:p-14">
          
          <p className="leading-8 text-[#123331]/70">
            Welcome to OutSold. We respect your privacy and are committed to
            protecting your personal information. This Privacy Policy explains
            how we collect, use, store, and protect your information when you
            use our website, platform, and related services.
          </p>

          <p className="mt-5 leading-8 text-[#123331]/70">
            By accessing or using OutSold, you agree to the practices described
            in this Privacy Policy.
          </p>

          {/* Section 1 */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold">
              1. Information We Collect
            </h2>

            <p className="mt-5 leading-8 text-[#123331]/70">
              We may collect different types of information when you use our
              website and services.
            </p>

            <h3 className="mt-7 text-lg font-semibold">
              Personal Information
            </h3>

            <p className="mt-3 leading-8 text-[#123331]/70">
              When you create an account, contact us, register for an event, or
              use our services, we may collect:
            </p>

            <ul className="mt-4 list-disc space-y-2 pl-6 text-[#123331]/70">
              <li>Name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Profile information</li>
              <li>Billing or transaction-related information</li>
              <li>Any other information you voluntarily provide</li>
            </ul>

            <h3 className="mt-7 text-lg font-semibold">
              Event Information
            </h3>

            <ul className="mt-4 list-disc space-y-2 pl-6 text-[#123331]/70">
              <li>Event details</li>
              <li>Event registrations</li>
              <li>Ticket information</li>
              <li>Attendee details</li>
              <li>Event preferences</li>
              <li>Communication related to events</li>
            </ul>

            <h3 className="mt-7 text-lg font-semibold">
              Automatically Collected Information
            </h3>

            <p className="mt-3 leading-8 text-[#123331]/70">
              When you use our website or platform, certain technical
              information may be collected automatically, including:
            </p>

            <ul className="mt-4 list-disc space-y-2 pl-6 text-[#123331]/70">
              <li>IP address</li>
              <li>Browser type</li>
              <li>Device information</li>
              <li>Operating system</li>
              <li>Pages visited</li>
              <li>Usage activity</li>
              <li>Cookies and similar technologies</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold">
              2. How We Use Your Information
            </h2>

            <p className="mt-5 leading-8 text-[#123331]/70">
              We may use your information to:
            </p>

            <ul className="mt-4 list-disc space-y-2 pl-6 text-[#123331]/70">
              <li>Provide and improve our platform and services</li>
              <li>Create and manage user accounts</li>
              <li>Process event registrations and transactions</li>
              <li>Help organizers manage their events</li>
              <li>Communicate important updates</li>
              <li>Respond to customer support requests</li>
              <li>Improve website functionality and user experience</li>
              <li>Prevent fraud, abuse, and security issues</li>
              <li>Comply with applicable legal requirements</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold">
              3. How We Share Your Information
            </h2>

            <p className="mt-5 leading-8 text-[#123331]/70">
              OutSold does not sell your personal information. However, we may
              share information in certain situations.
            </p>

            <div className="mt-5 space-y-5 text-[#123331]/70">
              <p>
                <strong className="text-[#123331]">
                  With Event Organizers:
                </strong>{" "}
                Information provided during event registration may be shared
                with the relevant event organizer.
              </p>

              <p>
                <strong className="text-[#123331]">
                  With Service Providers:
                </strong>{" "}
                We may work with trusted third-party providers who help us
                operate our platform and services.
              </p>

              <p>
                <strong className="text-[#123331]">
                  For Legal Reasons:
                </strong>{" "}
                We may disclose information when required by law or when
                necessary to protect our users and platform.
              </p>

              <p>
                <strong className="text-[#123331]">
                  Business Transfers:
                </strong>{" "}
                In the event of a merger, acquisition, or sale of assets, user
                information may be transferred as part of the transaction.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold">
              4. Data Ownership and Control
            </h2>

            <p className="mt-5 leading-8 text-[#123331]/70">
              Users retain ownership of the information they submit to OutSold.
              Event organizers are responsible for ensuring they have the
              necessary rights and permissions to collect and use attendee
              information.
            </p>

            <p className="mt-5 leading-8 text-[#123331]/70">
              We process information only as necessary to provide and improve
              our services, comply with legal obligations, and maintain the
              security and functionality of our platform.
            </p>
          </section>

          {/* Section 5 */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold">
              5. Cookies and Similar Technologies
            </h2>

            <p className="mt-5 leading-8 text-[#123331]/70">
              OutSold may use cookies and similar technologies to improve your
              experience and understand how our platform is used.
            </p>

            <ul className="mt-4 list-disc space-y-2 pl-6 text-[#123331]/70">
              <li>Keep users logged in</li>
              <li>Remember user preferences</li>
              <li>Understand user interaction</li>
              <li>Improve website performance</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold">
              6. Data Security
            </h2>

            <p className="mt-5 leading-8 text-[#123331]/70">
              We take reasonable technical and organizational measures to
              protect your information from unauthorized access, misuse, loss,
              alteration, or disclosure.
            </p>

            <p className="mt-5 leading-8 text-[#123331]/70">
              However, no method of transmission or storage over the internet
              is completely secure. While we take appropriate measures to
              protect your information, absolute security cannot be guaranteed.
            </p>
          </section>

          {/* Section 7 */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold">
              7. Third-Party Links and Services
            </h2>

            <p className="mt-5 leading-8 text-[#123331]/70">
              Our platform may contain links to third-party websites or
              services. OutSold is not responsible for the privacy practices,
              content, or security of third-party services.
            </p>
          </section>

          {/* Section 8 */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold">
              8. Data Retention
            </h2>

            <p className="mt-5 leading-8 text-[#123331]/70">
              We retain personal and event-related information for as long as
              necessary to provide our services, comply with legal obligations,
              resolve disputes, and enforce our agreements.
            </p>
          </section>

          {/* Section 9 */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold">
              9. Your Rights
            </h2>

            <p className="mt-5 leading-8 text-[#123331]/70">
              Depending on applicable laws, you may have the right to:
            </p>

            <ul className="mt-4 list-disc space-y-2 pl-6 text-[#123331]/70">
              <li>Access your personal information</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Withdraw consent where applicable</li>
              <li>Request information about how your data is used</li>
            </ul>
          </section>

          {/* Section 10 */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold">
              10. Children's Privacy
            </h2>

            <p className="mt-5 leading-8 text-[#123331]/70">
              OutSold does not knowingly collect personal information from
              children without appropriate consent where required by applicable
              law.
            </p>
          </section>

          {/* Section 11 */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold">
              11. Changes to This Privacy Policy
            </h2>

            <p className="mt-5 leading-8 text-[#123331]/70">
              We may update this Privacy Policy from time to time. Any changes
              will be posted on this page along with an updated "Last Updated"
              date.
            </p>
          </section>

          {/* Section 12 */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold">
              12. Contact Us
            </h2>

            <p className="mt-5 leading-8 text-[#123331]/70">
              If you have any questions or concerns regarding this Privacy
              Policy, please contact us.
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

export default PrivacyPolicy;