// components/Footer/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-black text-white py-6 px-6">
    <div className="container mx-auto flex justify-between items-center">
      <p>&copy; 2023 Auction Site. All rights reserved.</p>
      <div className="flex items-center gap-4">
        <Link href="#" className="hover:text-accent" prefetch={false}>
          About
        </Link>
        <Link href="#" className="hover:text-accent" prefetch={false}>
          Contact
        </Link>
        <Link href="#" className="hover:text-accent" prefetch={false}>
          Terms of Service
        </Link>
      </div>
    </div>
  </footer>
  );
};

export default Footer;