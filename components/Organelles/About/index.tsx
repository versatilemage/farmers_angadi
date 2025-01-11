"use client";

import React from "react";

const CheckCircleIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={12}
      height={12}
      viewBox="0 0 1024 1024"
      className="text-green-500 flex-shrink-0"
    >
      <path
        fill="currentColor"
        d="M512 0C229.232 0 0 229.232 0 512c0 282.784 229.232 512 512 512c282.784 0 512-229.216 512-512C1024 229.232 794.784 0 512 0m0 961.008c-247.024 0-448-201.984-448-449.01c0-247.024 200.976-448 448-448s448 200.977 448 448s-200.976 449.01-448 449.01m204.336-636.352L415.935 626.944l-135.28-135.28c-12.496-12.496-32.752-12.496-45.264 0c-12.496 12.496-12.496 32.752 0 45.248l158.384 158.4c12.496 12.48 32.752 12.48 45.264 0c1.44-1.44 2.673-3.009 3.793-4.64l318.784-320.753c12.48-12.496 12.48-32.752 0-45.263c-12.512-12.496-32.768-12.496-45.28 0z"
      ></path>
    </svg>
  );
};

const AboutUs = () => {
  return (
    <div className="max-w-[1280px] mx-auto p-6 space-y-8">
      <header className="text-center">
        <h1 className="text-4xl font-extrabold text-primary mb-4">About Us</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Connecting Farmers and Consumers
        </h2>
        <p className="text-lg text-gray-600">
          Welcome to Farmer’s Angadi, your trusted marketplace dedicated to bridging the gap between farmers and consumers. At Farmers Angadi, we are committed to ensuring that farmers receive fair and premium prices for their products, while consumers enjoy quality goods at reasonable prices.
        </p>
      </header>

      {/* Our Mission Section */}
      <section className="space-y-6">
        <h2 className="text-3xl font-semibold text-primary">Our Mission</h2>
        <p className="text-lg text-gray-600">
          Our mission is to create a sustainable ecosystem where farmers are empowered, consumers benefit from quality products, and traditional agricultural practices are preserved. We believe in fostering a community where everyone thrives through mutual support and fair trade.
        </p>
      </section>

      {/* Our Values Section */}
      <section className="space-y-6">
        <h2 className="text-3xl font-semibold text-primary">Our Values</h2>
        <ul className="list-none space-y-4">
          <li className="flex items-baseline space-x-2">
            <CheckCircleIcon />
            <div>
              <h3 className="text-xl font-medium text-gray-800">Empowerment</h3>
              <p className="text-gray-600">
                We are dedicated to empowering farmers by providing them with a platform that offers better prices and greater market access.
              </p>
            </div>
          </li>
          <li className="flex items-baseline space-x-2">
            <CheckCircleIcon />
            <div>
              <h3 className="text-xl font-medium text-gray-800">Sustainability</h3>
              <p className="text-gray-600">
                We prioritize sustainable farming practices that respect the environment and promote long-term agricultural health.
              </p>
            </div>
          </li>
          <li className="flex items-baseline space-x-2">
            <CheckCircleIcon />
            <div>
              <h3 className="text-xl font-medium text-gray-800">Transparency</h3>
              <p className="text-gray-600">
                Our transparent pricing ensures that both farmers and consumers understand the value of the products they are buying and selling.
              </p>
            </div>
          </li>
          <li className="flex items-baseline space-x-2">
            <CheckCircleIcon />
            <div>
              <h3 className="text-xl font-medium text-gray-800">Community</h3>
              <p className="text-gray-600">
                We are committed to building a strong community of farmers and consumers who support each other and share a passion for quality and tradition.
              </p>
            </div>
          </li>
        </ul>
      </section>

      {/* Why Choose Farmers Angadi Section */}
      <section className="space-y-6">
        <h2 className="text-3xl font-semibold text-primary">Why Choose Farmers Angadi?</h2>
        <ul className="list-none space-y-4">
          <li className="flex items-baseline space-x-2">
            <CheckCircleIcon />
            <div>
              <h3 className="text-xl font-medium text-gray-800">Empowering Farmers</h3>
              <p className="text-gray-600">
                We provide a platform that empowers farmers by offering them better prices for their hard work and dedication.
              </p>
            </div>
          </li>
          <li className="flex items-baseline space-x-2">
            <CheckCircleIcon />
            <div>
              <h3 className="text-xl font-medium text-gray-800">Fair Pricing for Consumers</h3>
              <p className="text-gray-600">
                Our commitment to fair pricing ensures that you receive the best value for your money.
              </p>
            </div>
          </li>
          <li className="flex items-baseline space-x-2">
            <CheckCircleIcon />
            <div>
              <h3 className="text-xl font-medium text-gray-800">Quality Products</h3>
              <p className="text-gray-600">
                We take pride in offering high-quality, traditional rice varieties and value-added products that are both nutritious and delicious.
              </p>
            </div>
          </li>
          <li className="flex items-baseline space-x-2">
            <CheckCircleIcon />
            <div>
              <h3 className="text-xl font-medium text-gray-800">Health and Wellness</h3>
              <p className="text-gray-600">
                Our health mixes and skincare products are crafted to support your well-being, using natural and traditional ingredients.
              </p>
            </div>
          </li>
          <li className="flex items-baseline space-x-2">
            <CheckCircleIcon />
            <div>
              <h3 className="text-xl font-medium text-gray-800">Customer Satisfaction</h3>
              <p className="text-gray-600">
                We prioritize customer satisfaction and strive to provide an exceptional shopping experience with excellent customer service.
              </p>
            </div>
          </li>
        </ul>
      </section>

      {/* Our Products Section */}
      <section className="space-y-6">
        <h2 className="text-3xl font-semibold text-primary">Our Products</h2>
        <p className="text-lg text-gray-600">
          We offer a diverse range of agricultural products, including but not limited to:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-600">
          <li>Traditional rice varieties</li>
          <li>Millets (e.g., pearl millet, finger millet)</li>
          <li>Pulses and lentils (e.g., green gram, black gram)</li>
          <li>Spices (e.g., turmeric, coriander, black pepper)</li>
          <li>Health mixes made from natural ingredients</li>
          <li>Skincare products crafted with traditional ingredients</li>
        </ul>
      </section>

      {/* Our Commitment Section */}
      <section className="space-y-6">
        <h2 className="text-3xl font-semibold text-primary">Our Commitment</h2>
        <p className="text-lg text-gray-600">
          At Farmer’s Angadi, we are committed to continuous improvement and innovation. We actively seek feedback from our customers and farmers to enhance our offerings and services. Our goal is to create a marketplace that not only meets but exceeds your expectations.
        </p>
      </section>

      {/* Join Us Section */}
      <section className="space-y-6">
        <h2 className="text-3xl font-semibold text-primary">Join Us</h2>
        <p className="text-lg text-gray-600">
          Join us in our mission to create a sustainable and fair marketplace for all. Together, we can make a difference in the lives of farmers and contribute to a healthier, more equitable world.
        </p>
      </section>
    </div>
  );
};

export default AboutUs;
