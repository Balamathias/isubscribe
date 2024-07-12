import React from 'react';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const ContactTab = () => {
  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md w-full mx-auto mt-1">
      <h2 className="text-lg font-semibold mb-6 text-cente text-gray-800">Contact Us</h2>
      <div className="flex items-center mb-4">
        <Mail className="w-9 h-9 text-red-400 mr-4" />
        <div>
          <h3 className="font-semibold text-gray-800">Email Us</h3>
          <p className="text-gray-600">info@isubscribe.ng</p>
        </div>
      </div>
      <div className="flex items-center mb-4">
        <Phone className="w-9 h-9 text-green-400  mr-4" />
        <div>
          <h3 className="font-semibold text-gray-800">Call Us</h3>
          <p className="text-gray-600">+234 915 402 9723</p>
        </div>
      </div>
      <div className="flex items-center mb-4">
        <MapPin className="w-9 h-9 text-red-600 mr-4" />
        <div>
          <h3 className="font-semibold text-gray-800">Visit Us</h3>
          <p className="text-gray-600">Ajami Plaza, Garki, Abuja.</p>
        </div>
      </div>
      <form className="mt-6">
        <div className="mb-4">
          <label className="block text-gray-800 font-medium mb-2" htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-800 font-medium mb-2" htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-800 font-medium mb-2" htmlFor="message">Message</label>
          <textarea
            id="message"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full bg-violet-500 text-white py-2 rounded-md hover:bg-violet-600 transition-colors duration-300"
        >
          Send Message
        </button>
      </form>
      <div className="mt-6 text-center">
        <h3 className="text-gray-800 font-semibold mb-2">Follow Us</h3>
        <div className="flex justify-center space-x-4">
          <a href="#" className="text-gray-600 hover:text-violet-500 transition-colors duration-300">
            <Facebook className="w-6 h-6" />
          </a>
          <a href="#" className="text-gray-600 hover:text-violet-400 transition-colors duration-300">
            <Twitter className="w-6 h-6" />
          </a>
          <a href="#" className="text-gray-600 hover:text-pink-500 transition-colors duration-300">
            <Instagram className="w-6 h-6" />
          </a>
          <a href="#" className="text-gray-600 hover:text-violet-700 transition-colors duration-300">
            <Linkedin className="w-6 h-6" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default ContactTab;
