import { useState } from 'react'
import { motion } from 'framer-motion'
import { Gavel, Shield, Book, HeartHandshake, Users, History, Trophy, HelpCircle } from 'lucide-react'

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState('about')

  const tabs = [
    { id: 'about', icon: Users, title: 'About Us' },
    { id: 'rules', icon: Book, title: 'Rules & Regulations' },
    { id: 'process', icon: Gavel, title: 'Auction Process' },
    { id: 'legal', icon: Shield, title: 'Legal Terms' },
    { id: 'values', icon: HeartHandshake, title: 'Our Values' },
    { id: 'history', icon: History, title: 'Our History' },
    { id: 'achievements', icon: Trophy, title: 'Achievements' },
    { id: 'faq', icon: HelpCircle, title: 'FAQ' },
  ]

  const content = {
    about: (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Welcome to Auction House</h3>
        <p>
          Auction House is a premier online auction platform connecting enthusiasts, collectors, and bargain hunters with unique items from around the world. Founded in 2010, we've grown to become one of the most trusted names in online auctions.
        </p>
        <p>
          Our mission is to provide a secure, transparent, and exciting environment for buyers and sellers alike. Whether you're a seasoned collector or a first-time bidder, Auction House offers an unparalleled experience in online auctions.
        </p>
        <h4 className="text-lg font-semibold mt-4">What Sets Us Apart</h4>
        <ul className="list-disc pl-5 space-y-2">
          <li>Wide range of categories: From antiques to modern art, electronics to rare collectibles</li>
          <li>Verified sellers: We ensure all our sellers are vetted for authenticity and reliability</li>
          <li>Secure transactions: State-of-the-art security measures to protect your data and finances</li>
          <li>Expert support: Our team of auction specialists is always ready to assist you</li>
          <li>Global reach: Connect with buyers and sellers from over 50 countries</li>
        </ul>
      </div>
    ),
    rules: (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Rules & Regulations</h3>
        <p>At Auction House, we maintain a fair and transparent environment for all users. Please adhere to the following rules:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Register with accurate and complete information</li>
          <li>Maintain the confidentiality of your account credentials</li>
          <li>Comply with all auction and payment regulations</li>
          <li>Do not use fraudulent methods to manipulate bids or auctions</li>
          <li>Respect intellectual property rights of others</li>
          <li>Communicate respectfully with other users and our staff</li>
          <li>Report any suspicious activity or violations of our policies</li>
          <li>Pay for won items promptly as per the specified timeline</li>
          <li>Provide accurate item descriptions and images if you're a seller</li>
          <li>Abide by our return and refund policies</li>
        </ul>
        <p>Failure to comply with these rules may result in account suspension or termination.</p>
      </div>
    ),
    process: (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Auction Process</h3>
        <p>Understanding our auction process ensures a smooth experience for both buyers and sellers:</p>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Browse Listings: Explore our wide range of items across various categories</li>
          <li>Register for Auction: Sign up or log in to participate in an auction</li>
          <li>Place a Deposit: Some auctions may require a refundable deposit to participate</li>
          <li>Bidding: Place your bids during the specified auction timeframe</li>
          <li>Automatic Bidding: Set a maximum bid and let our system bid for you</li>
          <li>Live Auctions: Some special items feature live auction events</li>
          <li>Winning: The highest bidder at the end of the auction wins</li>
          <li>Payment: Complete the payment for your won items within 48 hours</li>
          <li>Shipping: Sellers will ship items to winners within 5 business days</li>
          <li>Feedback: Leave feedback for the transaction to build our community trust</li>
        </ol>
        <p>For more detailed information on each step, please refer to our comprehensive Auction Guide in the Help Center.</p>
      </div>
    ),
    legal: (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Legal Terms</h3>
        <p>Auction House operates in full compliance with e-commerce and online auction laws. Our legal commitments include:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>User Privacy Protection: We safeguard your personal information as per our Privacy Policy</li>
          <li>Transparent Auctions: All our processes are designed to ensure fair and transparent bidding</li>
          <li>Dispute Resolution: We offer a structured process for handling complaints and disputes</li>
          <li>Financial Compliance: We adhere to all relevant tax and financial reporting regulations</li>
          <li>Intellectual Property Rights: We respect and protect intellectual property rights</li>
          <li>Terms of Service: All users must agree to our Terms of Service before participating</li>
          <li>Age Restrictions: Users must be of legal age in their jurisdiction to use our services</li>
          <li>Anti-Fraud Measures: We employ advanced systems to prevent fraudulent activities</li>
        </ul>
        <p>For the full legal documentation, please visit our Terms of Service and Privacy Policy pages.</p>
      </div>
    ),
    values: (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Our Values</h3>
        <p>At Auction House, our values guide every decision we make and every action we take:</p>
        <ul className="space-y-4">
          <li>
            <strong className="text-lg">Integrity:</strong>
            <p>We uphold the highest standards of honesty and fairness in all our operations. Trust is the foundation of our business, and we strive to earn and maintain it every day.</p>
          </li>
          <li>
            <strong className="text-lg">Innovation:</strong>
            <p>We continuously improve our platform, introducing new features and technologies to provide the best auction experience for our users.</p>
          </li>
          <li>
            <strong className="text-lg">Community:</strong>
            <p>We foster a vibrant community of collectors, enthusiasts, and sellers. We believe in the power of connecting people through their shared passions.</p>
          </li>
          <li>
            <strong className="text-lg">Excellence:</strong>
            <p>We strive for excellence in customer service, user experience, and operational efficiency. We're not satisfied until our users are delighted.</p>
          </li>
          <li>
            <strong className="text-lg">Transparency:</strong>
            <p>We believe in clear, open communication with our users. From our fees to our processes, we aim to be transparent in everything we do.</p>
          </li>
        </ul>
      </div>
    ),
    history: (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Our History</h3>
        <p>Auction House has come a long way since its inception. Here's a brief timeline of our journey:</p>
        <ul className="space-y-2">
          <li><strong>2010:</strong> Founded by John Doe and Jane Smith in San Francisco</li>
          <li><strong>2012:</strong> Launched our first mobile app, bringing auctions to smartphones</li>
          <li><strong>2014:</strong> Expanded operations to Europe, opening an office in London</li>
          <li><strong>2016:</strong> Introduced live video auctions for premium items</li>
          <li><strong>2018:</strong> Reached 1 million registered users milestone</li>
          <li><strong>2020:</strong> Launched AI-powered authentication system for luxury goods</li>
          <li><strong>2022:</strong> Expanded to Asia with a new office in Singapore</li>
          <li><strong>2023:</strong> Introduced blockchain technology for provenance tracking</li>
        </ul>
        <p>Today, we continue to grow and innovate, always with our users at the heart of everything we do.</p>
      </div>
    ),
    achievements: (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Our Achievements</h3>
        <p>We're proud of the recognition we've received over the years:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>"Best Online Auction Platform" - E-commerce Awards, 2022</li>
          <li>"Top 10 Innovative Companies in Retail" - Fast Company, 2021</li>
          <li>"Customer Service Excellence" - National Retail Federation, 2020</li>
          <li>Over 5 million successful auctions completed</li>
          <li>Trusted by more than 2 million active users worldwide</li>
          <li>Featured in Forbes, TechCrunch, and The Wall Street Journal</li>
          <li>Achieved carbon-neutral operations in 2022</li>
        </ul>
        <p>These achievements motivate us to continue improving and providing the best service to our users.</p>
      </div>
    ),
    faq: (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Frequently Asked Questions</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold">How do I start bidding?</h4>
            <p>Register for an account, browse our listings, and click "Place Bid" on items you're interested in.</p>
          </div>
          <div>
            <h4 className="font-semibold">Is there a fee to join Auction House?</h4>
            <p>Registration is free. We charge a small commission on successful sales.</p>
          </div>
          <div>
            <h4 className="font-semibold">How do I know if an item is authentic?</h4>
            <p>We have a team of experts who verify items. Look for the "Verified Authentic" badge on listings.</p>
          </div>
          <div>
            <h4 className="font-semibold">What payment methods do you accept?</h4>
            <p>We accept major credit cards, PayPal, and bank transfers for most auctions.</p>
          </div>
          <div>
            <h4 className="font-semibold">How is shipping handled?</h4>
            <p>Sellers are responsible for shipping items to winners. Shipping costs and methods are listed in each auction.</p>
          </div>
        </div>
        <p>For more FAQs, please visit our comprehensive Help Center.</p>
      </div>
    ),
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            About Auction House
          </h1>
          <p className="mt-5 text-xl text-gray-500">
            Your premier destination for online auctions
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-white shadow-xl rounded-lg overflow-hidden"
        >
          <div className="flex flex-wrap border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-4 px-1 text-center text-sm font-medium ${
                  activeTab === tab.id
                    ? 'text-indigo-600 border-b-2 border-indigo-500'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="mx-auto h-6 w-6 mb-1" />
                {tab.title}
              </button>
            ))}
          </div>
          <div className="p-6">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {content[activeTab]}
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-8 text-center"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Help?</h2>
          <p className="text-gray-600">
            Contact us at{' '}
            <a href="mailto:support@auctionhouse.com" className="text-indigo-600 hover:text-indigo-500">
              support@auctionhouse.com
            </a>{' '}
            or call our 24/7 hotline at 1-800-AUCTION
          </p>
        </motion.div>
      </div>
    </div>
  )
}