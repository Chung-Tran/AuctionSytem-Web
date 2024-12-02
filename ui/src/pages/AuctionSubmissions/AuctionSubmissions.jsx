'use client'

import React, { useState } from 'react'
import { Layout, Typography, Input, Select, Button, Modal, Tag } from 'antd'
import { SearchOutlined, DownloadOutlined, BankOutlined } from '@ant-design/icons'
import BankInfoForm from './BankInfoForm'
import TransactionReportButton from './AuctionSubmissionReport'

const { Header, Content, Footer } = Layout
const { Title, Text } = Typography
const { Option } = Select

// Mock data for demonstration
const products = [
  {
    id: 1,
    name: 'Vintage Watch',
    description: 'A beautiful antique timepiece',
    auctionId: 'AUC001',
    submissionDate: '2023-05-01',
    status: 'Active',
    startingPrice: 500,
    finalPrice: null,
    image: '/placeholder.svg',
    hasBankInfo: false,
    rejectionReason: null,  // Không có lý do từ chối
  },
  {
    id: 2,
    name: 'Rare Painting',
    description: 'Original artwork from a renowned artist',
    auctionId: 'AUC002',
    submissionDate: '2023-04-15',
    status: 'Successful',
    startingPrice: 1000,
    finalPrice: 1500,
    image: '/placeholder.svg',
    hasBankInfo: true,
    rejectionReason: null,
  },
  {
    id: 3,
    name: 'Antique Vase',
    description: 'Ming dynasty porcelain vase',
    auctionId: 'AUC003',
    submissionDate: '2023-04-20',
    status: 'Failed',
    startingPrice: 2000,
    finalPrice: null,
    image: '/placeholder.svg',
    hasBankInfo: false,
    rejectionReason: null,  // Không có lý do từ chối
  },
  {
    id: 4,
    name: 'Vintage Car',
    description: '1960s classic automobile',
    auctionId: 'AUC004',
    submissionDate: '2023-05-05',
    status: 'Pending',
    startingPrice: 15000,
    finalPrice: null,
    image: '/placeholder.svg',
    hasBankInfo: false,
    rejectionReason: null,  // Không có lý do từ chối
  },
  {
    id: 5,
    name: 'Rare Coin Collection',
    description: 'Set of ancient Roman coins',
    auctionId: 'AUC005',
    submissionDate: '2023-04-25',
    status: 'Rejected',
    startingPrice: 5000,
    finalPrice: null,
    image: '/placeholder.svg',
    hasBankInfo: false,
    rejectionReason: 'Product does not meet quality standards.',  // Lý do từ chối
  },
]

export default function AuctionSubmissions() {
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [isBankInfoModalVisible, setIsBankInfoModalVisible] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)

  const filteredProducts = products.filter(product => 
    (statusFilter === 'All' || product.status === statusFilter) &&
    (product.name.toLowerCase().includes(searchText.toLowerCase()) || 
     product.auctionId.toLowerCase().includes(searchText.toLowerCase()))
  )

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'text-yellow-600 bg-yellow-100'
      case 'Active': return 'text-blue-600 bg-blue-100'
      case 'Successful': return 'text-green-600 bg-green-100'
      case 'Failed': return 'text-red-600 bg-red-100'
      case 'Rejected': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const handleDownloadReport = (product) => {
    console.log(`Downloading report for ${product.name}`)
  }

  const handleBankInfoSubmit = (values) => {
    console.log('Bank info submitted:', values)
    setIsBankInfoModalVisible(false)
  }

  return (
    <Layout className="min-h-screen bg-gray-50 container max-w-[80%] mx-auto">
      <Header className="bg-white">
        <Title level={2} className="text-center py-4 border-0">My Auctioned Products</Title>
      </Header>
      <Content className="p-6">
        <div className="flex justify-between mb-6">
          <Input
            placeholder="Search by product name or auction ID"
            prefix={<SearchOutlined />}
            className="w-1/2"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Select 
            defaultValue="All" 
            className="w-1/4"
            onChange={(value) => setStatusFilter(value)}
          >
            <Option value="All">All Status</Option>
            <Option value="Pending">Pending</Option>
            <Option value="Active">Active</Option>
            <Option value="Successful">Successful</Option>
            <Option value="Failed">Failed</Option>
            <Option value="Rejected">Rejected</Option>
          </Select>
        </div>

        <div className="space-y-4">
          {filteredProducts.map(product => (
            <div 
              key={product.id} 
              className="bg-white rounded-lg shadow-md p-6 flex items-center space-x-6 hover:shadow-lg transition-shadow"
            >
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-24 h-24 object-cover rounded-md"
              />
              <div className="flex-grow">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">{product.name}</h3>
                  <Tag 
                    className={`px-2 py-1 rounded ${getStatusColor(product.status)}`}
                  >
                    {product.status}
                  </Tag>
                </div>
                <p className="text-gray-600 mt-2">{product.description}</p>
                <div className="mt-2 text-sm text-gray-500">
                  <span>Auction ID: {product.auctionId}</span>
                  <span className="ml-4">Submitted: {product.submissionDate}</span>
                </div>
                {product.status === 'Rejected' && (
                  <div className="mt-2 text-red-600 font-medium">
                    <span>Reason for rejection: {product.rejectionReason}</span>
                  </div>
                )}
                <div className="mt-2 flex justify-between items-center">
                  <div>
                    <span className="font-medium">Starting Price: </span>
                    <span>${product.startingPrice}</span>
                    {product.finalPrice && (
                      <>
                        <span className="ml-4 font-medium">Final Price: </span>
                        <span>${product.finalPrice}</span>
                      </>
                    )}
                  </div>
                  {product.status === 'Successful' && (
                    <div className="space-x-2">
                      {!product.hasBankInfo && (
                        <Button 
                          icon={<BankOutlined />} 
                          onClick={() => {
                            setSelectedProduct(product)
                            setIsBankInfoModalVisible(true)
                          }}
                        >
                          Update Bank Info
                        </Button>
                      )}
                                  <TransactionReportButton
                                       disabled={!product.hasBankInfo}
                                  />
                      {/* <Button 
                        icon={<DownloadOutlined />} 
                        disabled={!product.hasBankInfo}
                        onClick={() => handleDownloadReport(product)}
                      >
                        Download Report
                      </Button> */}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Content>

      <Modal
        title="Update Bank Information"
        visible={isBankInfoModalVisible}
        onCancel={() => setIsBankInfoModalVisible(false)}
        footer={null}
      >
        <BankInfoForm onSubmit={handleBankInfoSubmit} />
      </Modal>
    </Layout>
  )
}
