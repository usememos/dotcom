import { Metadata } from "next";
import React from "react";
import SectionContainer from "@/components/SectionContainer";
import { getMetadata } from "@/utils/metadata";

export const metadata: Metadata = getMetadata({
  title: "Privacy Policy - Memos",
  pathname: "/privacy",
  description: "Memos privacy policy - We never collect your personal data. Open source and privacy-first.",
});

const PrivacyPage = () => {
  return (
    <SectionContainer>
      <div className="w-full mx-auto sm:px-4">
        <div className="prose prose-gray max-w-none prose-lg">
          <h1 className="text-4xl font-bold text-gray-900 mt-8 mb-6">Privacy Policy</h1>

          <h2 className="text-3xl font-semibold text-gray-900 mt-8 mb-4">Our Commitment to Your Privacy</h2>

          <p className="text-gray-700 leading-relaxed my-4">
            Memos is a <strong>free, open-source</strong> note-taking application that puts your privacy first. We believe that your
            personal data belongs to you, and you alone.
          </p>

          <h2 className="text-3xl font-semibold text-gray-900 mt-8 mb-4">What We DON'T Collect</h2>

          <ul className="list-disc list-inside my-4 space-y-2 text-gray-700">
            <li>
              We do <strong>NOT</strong> collect any personal information
            </li>
            <li>
              We do <strong>NOT</strong> track your usage or behavior
            </li>
            <li>
              We do <strong>NOT</strong> store your notes or data on our servers
            </li>
            <li>
              We do <strong>NOT</strong> use cookies or analytics for tracking
            </li>
            <li>
              We do <strong>NOT</strong> share any data with third parties
            </li>
            <li>
              We do <strong>NOT</strong> monetize your data in any way
            </li>
          </ul>

          <h2 className="text-3xl font-semibold text-gray-900 mt-8 mb-4">How Memos Works</h2>

          <p className="text-gray-700 leading-relaxed my-4">
            Memos is designed to be <strong>self-hosted</strong>, meaning:
          </p>

          <ul className="list-disc list-inside my-4 space-y-2 text-gray-700">
            <li>
              <strong>Your data stays with you</strong> - All your notes and data are stored on your own server or device
            </li>
            <li>
              <strong>Complete control</strong> - You have full control over your data and who can access it
            </li>
            <li>
              <strong>No external dependencies</strong> - Your notes don't rely on our servers or services
            </li>
            <li>
              <strong>Open source transparency</strong> - Our code is publicly available for audit and review
            </li>
          </ul>

          <h2 className="text-3xl font-semibold text-gray-900 mt-8 mb-4">Open Source Guarantee</h2>

          <p className="text-gray-700 leading-relaxed my-4">
            Because Memos is <strong>open source</strong>:
          </p>

          <ul className="list-disc list-inside my-4 space-y-2 text-gray-700">
            <li>You can review our code to verify our privacy claims</li>
            <li>The community can audit and improve our privacy practices</li>
            <li>There are no hidden data collection mechanisms</li>
            <li>You can modify the software to meet your specific privacy needs</li>
          </ul>

          <h2 className="text-3xl font-semibold text-gray-900 mt-8 mb-4">Data Security</h2>

          <p className="text-gray-700 leading-relaxed my-4">Since your data never leaves your control when using Memos:</p>

          <ul className="list-disc list-inside my-4 space-y-2 text-gray-700">
            <li>Data security is entirely in your hands</li>
            <li>We recommend following standard security practices for your self-hosted instance</li>
            <li>Use HTTPS, regular backups, and secure authentication methods</li>
            <li>Keep your Memos installation updated for security patches</li>
          </ul>

          <h2 className="text-3xl font-semibold text-gray-900 mt-8 mb-4">Contact Us</h2>

          <p className="text-gray-700 leading-relaxed my-4">
            If you have any questions about this privacy policy or our privacy practices, please:
          </p>

          <ul className="list-disc list-inside my-4 space-y-2 text-gray-700">
            <li>
              Open an issue on our{" "}
              <a
                href="https://github.com/usememos/memos"
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-600 hover:text-teal-700 no-underline hover:underline"
              >
                GitHub repository
              </a>
            </li>
            <li>Join our community discussions</li>
            <li>Review our open-source code for transparency</li>
          </ul>
        </div>
      </div>
    </SectionContainer>
  );
};

export default PrivacyPage;
