import React from "react";

export default function About() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-red-950 to-black">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-center text-red-500">
            About Our Marketplace
          </h1>
          <p className="text-xl text-gray-300 text-center max-w-3xl mx-auto">
            Connecting car owners with renters seamlessly. We're revolutionizing the way people access vehicles, making car rental more flexible, affordable, and convenient than ever before.
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="bg-gray-900 p-8 rounded-2xl border border-red-900 hover:border-red-500 transition-all duration-300 hover:scale-105">
            <div className="bg-red-950 w-16 h-16 rounded-full flex items-center justify-center mb-6">
              <span className="text-4xl">🚗</span>
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-red-400">Wide Selection</h3>
            <p className="text-gray-400">
              Access thousands of vehicles from trusted owners. From economy cars to luxury rides, find the perfect vehicle for any occasion.
            </p>
          </div>

          <div className="bg-gray-900 p-8 rounded-2xl border border-red-900 hover:border-red-500 transition-all duration-300 hover:scale-105">
            <div className="bg-red-950 w-16 h-16 rounded-full flex items-center justify-center mb-6">
              <span className="text-4xl">🛡️</span>
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-red-400">Secure & Safe</h3>
            <p className="text-gray-400">
              Every rental is protected with comprehensive insurance and verified user profiles for your peace of mind.
            </p>
          </div>

          <div className="bg-gray-900 p-8 rounded-2xl border border-red-900 hover:border-red-500 transition-all duration-300 hover:scale-105">
            <div className="bg-red-950 w-16 h-16 rounded-full flex items-center justify-center mb-6">
              <span className="text-4xl">⏰</span>
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-red-400">24/7 Support</h3>
            <p className="text-gray-400">
              Our dedicated team is always ready to assist you with bookings, questions, or any issues that may arise.
            </p>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-gradient-to-br from-gray-900 to-red-950 rounded-3xl border border-red-900 overflow-hidden">
          <div className="grid md:grid-cols-2">
            {/* Contact Info */}
            <div className="p-12">
              <h2 className="text-3xl font-bold mb-8 text-red-500">
                Get In Touch
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-red-950 p-3 rounded-lg">
                    <span className="text-2xl">📍</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-200 mb-1">Address</p>
                    <p className="text-gray-400">123 Tokyo Street, Shibuya<br />Tokyo, Japan</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-red-950 p-3 rounded-lg">
                    <span className="text-2xl">📞</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-200 mb-1">Phone</p>
                    <p className="text-gray-400">+81 90 1234 5678</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-red-950 p-3 rounded-lg">
                    <span className="text-2xl">✉️</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-200 mb-1">Email</p>
                    <p className="text-gray-400">support@carrentalmarket.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-red-950 p-3 rounded-lg">
                    <span className="text-2xl">🌐</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-200 mb-1">Social Media</p>
                    <p className="text-gray-400">facebook.com/carrentalmarket</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Image/Map Placeholder */}
            <div className="relative bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-12">
              <div className="relative w-full h-full min-h-96 bg-black rounded-2xl border-2 border-dashed border-red-900 overflow-hidden">
                <img
                  src="../src/assets/about.jpg"
                  alt="About"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-red-500 mb-2">10K+</div>
            <div className="text-gray-400">Active Users</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-red-600 mb-2">5K+</div>
            <div className="text-gray-400">Listed Cars</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-red-500 mb-2">50K+</div>
            <div className="text-gray-400">Completed Trips</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-red-600 mb-2">4.8★</div>
            <div className="text-gray-400">Average Rating</div>
          </div>
        </div>
      </div>
    </div>
  );
}