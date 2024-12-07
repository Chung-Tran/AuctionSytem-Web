'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import { Helmet } from 'react-helmet'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prevState => ({ ...prevState, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    alert("We've received your message and will get back to you soon!")
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-16 px-6">
      <Helmet>
        <title>Contact</title>
        <meta property="og:title" content="Contact" />
        <meta property="og:description" content="Contact" />
      </Helmet>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-extrabold text-gray-800 sm:text-5xl lg:text-6xl">
            Get in Touch with Us
          </h1>
          <p className="mt-6 text-lg text-gray-600">
            We're here to assist and answer any question you may have.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white shadow-md rounded-lg p-8"
          >
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Drop Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full mt-2 px-4 py-2 rounded-md shadow-sm bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition ease-in-out duration-150"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full mt-2 px-4 py-2 rounded-md shadow-sm bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition ease-in-out duration-150"
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full mt-2 px-4 py-2 rounded-md shadow-sm bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition ease-in-out duration-150"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full mt-2 px-4 py-2 rounded-md shadow-sm bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition ease-in-out duration-150"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-500 text-white py-3 rounded-md shadow-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 transition duration-200"
              >
                Send Message
              </button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white shadow-md rounded-lg p-8"
          >
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Contact Information</h2>
            <div className="space-y-6 text-gray-700">
              <div className="flex items-center">
                <MapPin className="h-6 w-6 text-indigo-500 mr-3" />
                <span>123 Auction Lane, Bidding City, AC 12345</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-6 w-6 text-indigo-500 mr-3" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-6 w-6 text-indigo-500 mr-3" />
                <span>support@auctionhouse.com</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-6 w-6 text-indigo-500 mr-3" />
                <span>Monday - Friday: 9am - 5pm</span>
              </div>
            </div>
            <div className="mt-6 h-56 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">Map Placeholder</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
