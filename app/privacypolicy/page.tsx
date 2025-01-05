"use client";

import React, { useState } from "react";

const AccordionItem = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200">
      <button
        className="w-full flex justify-between items-center py-4 text-left text-xl font-semibold text-primary focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
        <svg
          className={`w-6 h-6 transform transition-transform duration-300 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && <div className="pb-4 text-lg text-gray-700">{children}</div>}
    </div>
  );
};

const PolicyPage = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <header className="text-center">
        <h1 className="text-5xl font-extrabold text-primary mb-4">Policies</h1>
        <p className="text-lg text-gray-600">
          We respect your privacy and are committed to providing a safe and secure experience on FarmersAngadi.com. Please read our policies carefully.
        </p>
      </header>

      {/* Privacy Policy */}
      <section>
        <AccordionItem title="Privacy Policy">
          <div className="space-y-4">
            <p>
              We respect the privacy of our users and your data. This Privacy Policy describes the types of information we collect from and about you when you visit our website and how we use that information.
            </p>
            <h2 className="text-2xl font-bold text-secondary">1. Information We Collect</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Personal Information:</strong> We may collect personal information from you, such as your name, email address, phone number, and mailing address, when you register for an account, subscribe to our newsletter, or contact us.
              </li>
              <li>
                <strong>Non-Personal Information:</strong> We may also collect non-personal information from you, such as your browsing history on the Website, your location (if you allow it), and your device information. This information is collected automatically and helps us improve the Website and your experience.
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-secondary">2. Use of Your Information</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>To provide you with the services offered on the Website, including allowing you to sell your agricultural products.</li>
              <li>To send you important information about the Website, such as changes to our terms and conditions or privacy policy.</li>
              <li>To personalize your experience on the Website, such as recommending products that may be of interest to you (based on your browsing history).</li>
              <li>To send you promotional emails about new products, features, or events on the Website (you can opt out of these emails at any time). We will not share your data with any third party for promotional purposes.</li>
              <li>To improve the Website and your experience.</li>
              <li>To comply with legal and regulatory requirements.</li>
            </ul>

            <h2 className="text-2xl font-bold text-secondary">3. Data Security</h2>
            <p>
              We take reasonable steps to protect the information you provide to us from loss, misuse, unauthorized access, disclosure, alteration, and destruction. However, no website or internet transmission is completely secure. We cannot guarantee the security of your information.
            </p>

            <h2 className="text-2xl font-bold text-secondary">4. Your Choices</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>You can opt out of receiving promotional emails from us by clicking the unsubscribe link in any promotional email you receive from us.</li>
              <li>You can deactivate your account at any time.</li>
            </ul>

            <h2 className="text-2xl font-bold text-secondary">5. Children’s Privacy</h2>
            <p>
              The Website is not intended for children under the age of 13. We do not knowingly collect personal information from children under the age of 13.
            </p>

            <h2 className="text-2xl font-bold text-secondary">6. Changes to this Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will post any changes to this Privacy Policy on the Website. We encourage you to review this Privacy Policy periodically for any updates.
            </p>

            <h2 className="text-2xl font-bold text-secondary">7. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at{" "}
              <a href="mailto:support@farmersangadi.com" className="text-blue-600 underline">
                support@farmersangadi.com
              </a>
              .
            </p>
          </div>
        </AccordionItem>
      </section>

      {/* Terms and Conditions */}
      <section>
        <AccordionItem title="Terms and Conditions">
          <div className="space-y-4">
            <p>
              These Terms and Conditions govern your use of the FarmersAngadi.com website. By using the Website, you agree to be bound by these Terms.
            </p>
            <h2 className="text-2xl font-bold text-secondary">1. User Conduct</h2>
            <p>
              You agree to use the Website in a lawful and responsible manner. You will not:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use the Website for any illegal or unauthorized purpose.</li>
              <li>Infringe on the intellectual property rights of others.</li>
              <li>Transmit any viruses or other harmful code.</li>
              <li>Disrupt the use of the Website by others.</li>
              <li>Collect or store personal information about other users without their consent.</li>
            </ul>

            <h2 className="text-2xl font-bold text-secondary">2. Account Creation and Usage</h2>
            <p>
              To use certain features of the Website, you may need to create an account. You are responsible for maintaining the confidentiality of your account information and for all activity that occurs under your account.
            </p>

            <h2 className="text-2xl font-bold text-secondary">3. Product Information</h2>
            <p>
              We strive to provide accurate information about the products offered on the Website. However, we cannot guarantee that all product descriptions or images are completely accurate, current, or error-free.
            </p>

            <h2 className="text-2xl font-bold text-secondary">4. Order Placement and Fulfillment</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>You can cancel your order before the package is packed.</li>
              <li>We use third-party courier services for delivery. You can choose your preferred courier service during checkout, subject to availability. Otherwise, we will choose a suitable service.</li>
              <li>We will share a delivery receipt with you once the order is shipped.</li>
            </ul>

            <h2 className="text-2xl font-bold text-secondary">5. Payment Methods</h2>
            <p>
              We accept various online payment methods for your convenience. Please see the payment options available during checkout.
            </p>

            <h2 className="text-2xl font-bold text-secondary">6. Promotions and Discounts</h2>
            <p>
              We may offer promotions and discounts from time to time. These promotions and discounts may have specific terms and conditions that apply.
            </p>

            <h2 className="text-2xl font-bold text-secondary">7. Intellectual Property</h2>
            <p>
              The content of the Website, including the design, text, graphics, logos, and images, is the property of FarmersAngadi or its licensors and is protected by copyright and other intellectual property laws.
            </p>
          </div>
        </AccordionItem>
      </section>

      {/* Cancellation and Refund Policy */}
      <section>
        <AccordionItem title="Cancellation and Refund Policy">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-secondary">1. Cancellation</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Cancellations are not accepted once the package is in courier services.</li>
              <li>You can cancel your order before the package is packed.</li>
            </ul>

            <h2 className="text-2xl font-bold text-secondary">2. Refund</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Refunds will be issued only for the value of the product, not including courier charges.</li>
              <li>Handling charges may be deducted from the refund amount.</li>
            </ul>
          </div>
        </AccordionItem>
      </section>

      {/* Shipping and Delivery */}
      <section>
        <AccordionItem title="Shipping and Delivery">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-secondary">1. Courier Services</h2>
            <p>
              We use third-party courier services for shipping.
            </p>

            <h2 className="text-2xl font-bold text-secondary">2. Choosing Courier Service</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>You can choose your preferred courier service at the time of checkout.</li>
              <li>If your preferred service is unavailable, we will use an alternative courier.</li>
            </ul>

            <h2 className="text-2xl font-bold text-secondary">3. Delivery Confirmation</h2>
            <p>
              A delivery challan will be shared with you, allowing you to track when the package will arrive.
            </p>
          </div>
        </AccordionItem>
      </section>

      {/* Cash on Delivery (COD) Policy */}
      <section>
        <AccordionItem title="Cash on Delivery (COD) Policy">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-secondary">Payment Process</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Courier Charges:</strong> Customers are required to pay the courier charges upfront at the time of placing the order.
              </li>
              <li>
                <strong>Product Payment:</strong> The payment for the product(s) will be collected by the courier service at the time of delivery.
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-secondary">Important Points</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Upfront Courier Charges:</strong> The courier charges must be paid in advance and are non-refundable in case of order cancellation.
              </li>
              <li>
                <strong>Product Payment at Delivery:</strong> Ensure you have the exact amount ready as the courier personnel will collect the payment for the product(s) upon delivery.
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-secondary">Customer Responsibilities</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Provide Accurate Address:</strong> Please provide an accurate and complete address to avoid any delays in delivery.
              </li>
              <li>
                <strong>Availability at Delivery Time:</strong> Ensure someone is available to receive and pay for the product(s) at the delivery address.
              </li>
            </ul>
          </div>
        </AccordionItem>
      </section>

      {/* Return and Refund Policy */}
      <section>
        <AccordionItem title="Return and Refund Policy">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-secondary">1. Return Policy</h2>
            <p>
              If the product does not meet your expectations, you may return it.
            </p>

            <h2 className="text-2xl font-bold text-secondary">2. Return Process</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>We do not offer return courier service. You must pack and return the product at your own expense.</li>
              <li>Once the product reaches our facility, we will process your refund.</li>
            </ul>

            <h2 className="text-2xl font-bold text-secondary">3. Refund</h2>
            <p>
              Refunds will be issued for the product value only.
            </p>
          </div>
        </AccordionItem>
      </section>

      {/* Footer */}
      <footer className="text-center mt-8">
        <p className="text-sm text-gray-500">
          We aim to make your shopping experience smooth and hassle-free. If you have any questions or need further assistance, please contact our customer support team at{" "}
          <a href="mailto:support@farmersangadi.com" className="text-blue-600 underline">
            support@farmersangadi.com
          </a>
          .
        </p>
      </footer>
    </div>
  );
};

export default PolicyPage;
