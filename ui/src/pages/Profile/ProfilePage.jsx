'use client'

import React, { useState } from 'react'
import { Upload, message, Table } from 'antd'
import { UploadOutlined } from '@ant-design/icons'

const ProfilePage = () => {
  const [fileList, setFileList] = useState([])
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    username: '',
    address: '',
    idNumber: '',
  })

  const onFinish = (e) => {
    e.preventDefault()
    console.log('Success:', formData)
    message.success('Profile updated successfully')
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList)
  }

  const columns = [
    {
      title: 'Item Name',
      dataIndex: 'itemName',
      key: 'itemName',
    },
    {
      title: 'Auction Date',
      dataIndex: 'auctionDate',
      key: 'auctionDate',
    },
    {
      title: 'Winning Bid',
      dataIndex: 'winningBid',
      key: 'winningBid',
      render: (text) => `$${text.toFixed(2)}`,
    },
  ]

  const data = [
    {
      key: '1',
      itemName: 'Antique Vase',
      auctionDate: '2023-09-15',
      winningBid: 1500.0,
    },
    {
      key: '2',
      itemName: 'Vintage Watch',
      auctionDate: '2023-09-20',
      winningBid: 2300.5,
    },
    {
      key: '3',
      itemName: 'Rare Coin Collection',
      auctionDate: '2023-09-25',
      winningBid: 5000.0,
    },
  ]

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Edit User Profile</h1>
      
      <form onSubmit={onFinish} className="space-y-6">
        {/* Upload Avatar */}
        <div className="mb-6">
          <label className="block text-lg font-bold mb-2">Upload Avatar</label>
          <Upload
            listType="picture-card"
            fileList={fileList}
            onChange={handleUploadChange}
            maxCount={1}
          >
            {fileList.length < 1 && (
              <div>
                <UploadOutlined style={{ fontSize: '24px' }} />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            )}
          </Upload>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-lg font-bold">Full Name</label>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              className="w-full px-3 py-2 border rounded-lg"
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-lg font-bold">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full px-3 py-2 border rounded-lg"
              onChange={handleChange}
              required
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-lg font-bold">Phone Number</label>
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              className="w-full px-3 py-2 border rounded-lg"
              onChange={handleChange}
              required
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-lg font-bold">Username</label>
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="w-full px-3 py-2 border rounded-lg"
              onChange={handleChange}
              required
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-lg font-bold">Address</label>
            <textarea
              name="address"
              placeholder="Address"
              className="w-full px-3 py-2 border rounded-lg"
              onChange={handleChange}
              required
            />
          </div>

          {/* ID Number */}
          <div>
            <label className="block text-lg font-bold">ID Number</label>
            <input
              type="text"
              name="idNumber"
              placeholder="ID Number"
              className="w-full px-3 py-2 border rounded-lg"
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-200"
        >
          Update Profile
        </button>
      </form>

      {/* Auctioned Items Table */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Successfully Auctioned Items</h2>
        <Table columns={columns} dataSource={data} pagination={false} />
      </div>
    </div>
  )
}

export default ProfilePage
