"use client";

import React from "react";

const CheckCircleIcon = () =>{

return(
    <svg xmlns="http://www.w3.org/2000/svg" width={12} height={12} viewBox="0 0 1024 1024"><path fill="currentColor" d="M512 0C229.232 0 0 229.232 0 512c0 282.784 229.232 512 512 512c282.784 0 512-229.216 512-512C1024 229.232 794.784 0 512 0m0 961.008c-247.024 0-448-201.984-448-449.01c0-247.024 200.976-448 448-448s448 200.977 448 448s-200.976 449.01-448 449.01m204.336-636.352L415.935 626.944l-135.28-135.28c-12.496-12.496-32.752-12.496-45.264 0c-12.496 12.496-12.496 32.752 0 45.248l158.384 158.4c12.496 12.48 32.752 12.48 45.264 0c1.44-1.44 2.673-3.009 3.793-4.64l318.784-320.753c12.48-12.496 12.48-32.752 0-45.263c-12.512-12.496-32.768-12.496-45.28 0"></path></svg>
)
}
const AboutUs = () => {
  return (
    <div className="max-w-[1280px] mx-auto p-6 space-y-8">
      <header className="text-center">
        <h1 className="text-4xl font-extrabold text-primary mb-4">About Us</h1>
        <p className="text-lg text-gray-600">
          Empowering farmers, enriching lives, and delivering fresh produce directly to consumers.
        </p>
      </header>

      {/* Benefits Section */}
<section className="space-y-6">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    {/* Benefits for Farmers */}
    <div className="bg-gray-100 p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
      <h3 className="text-2xl font-semibold text-primary mb-4">Benefits for Farmers</h3>
      <ul className="list-none space-y-2">
        <li className="flex items-center space-x-2">
          <CheckCircleIcon />
          <span>Earn a fair price for their produce</span>
        </li>
        <li className="flex items-center space-x-2">
          <CheckCircleIcon />
          <span>Avoid the hassle of marketing and shipping</span>
        </li>
        <li className="flex items-center space-x-2">
          <CheckCircleIcon />
          <span>Reach a wider audience of consumers</span>
        </li>
        <li className="flex items-center space-x-2">
          <CheckCircleIcon />
          <span>Improve their bottom line</span>
        </li>
      </ul>
    </div>

    {/* Benefits for Consumers */}
    <div className="bg-gray-100 p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
      <h3 className="text-2xl font-semibold text-primary mb-4">Benefits for Consumers</h3>
      <ul className="list-none space-y-2">
        <li className="flex items-center space-x-2">
          <CheckCircleIcon />
          <span>Get fresh, high-quality food</span>
        </li>
        <li className="flex items-center space-x-2">
          <CheckCircleIcon />
          <span>Save money on groceries</span>
        </li>
        <li className="flex items-center space-x-2">
          <CheckCircleIcon />
          <span>Support local farmers</span>
        </li>
        <li className="flex items-center space-x-2">
          <CheckCircleIcon />
          <span>Eat healthier</span>
        </li>
      </ul>
    </div>
  </div>
</section>

    </div>
  );
};

export default AboutUs;
