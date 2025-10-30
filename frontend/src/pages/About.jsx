import React from "react";

export default function About() {
  return (
    <div className="min-h-screen text-white flex flex-col items-center py-16 px-6">
      {/* Title */}
      <h1 className="text-4xl font-bold mb-8 text-center">About me</h1>

      {/* Description lines */}
      <div className="text-gray-300 max-w-3xl mb-16">
        <p className="border-t border-gray-500 w-full my-2"></p>
        <p className="border-t border-gray-500 w-full my-2"></p>
        <p className="border-t border-gray-500 w-full my-2"></p>
        <p className="border-t border-gray-500 w-full my-2"></p>
      </div>

      {/* Contact and Image */}
      <div className="bg-white rounded-2xl flex flex-col md:flex-row w-full max-w-5xl shadow-lg overflow-hidden">
        {/* Contact section */}
        <div className="flex-1 p-8 text-black">
          <h2 className="text-xl font-semibold text-red-700 mb-6">Contact us</h2>

          <ul className="space-y-6 text-gray-800">
            <li className="flex items-center gap-4">
              <span className="text-2xl">📍</span>
              <span>123 Tokyo Street, Japan</span>
            </li>
            <li className="flex items-center gap-4">
              <span className="text-2xl">📞</span>
              <span>+81 90 1234 5678</span>
            </li>
            <li className="flex items-center gap-4">
              <span className="text-2xl">✉️</span>
              <span>info@example.com</span>
            </li>
            <li className="flex items-center gap-4">
              <span className="text-2xl">🌐</span>
              <span>facebook.com/example</span>
            </li>
          </ul>
        </div>

        {/* Image section */}
        <div className="flex-1 bg-gray-300 flex items-center justify-center">
          <div className="w-4/5 h-4/5 bg-gray-200 border-2 border-gray-400 rounded-xl flex items-center justify-center">
            <span className="text-gray-500 text-lg">[ Your Image Here ]</span>
          </div>
        </div>
      </div>
    </div>
  );
}
