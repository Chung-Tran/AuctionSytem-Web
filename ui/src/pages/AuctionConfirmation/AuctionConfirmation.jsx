import React, { useState } from 'react'
import { HeatMapOutlined, CheckCircleOutlined } from '@ant-design/icons'
import { Layout, Typography, Space, Radio, Input, Button, Select, Checkbox, Card, Row, Col, Form } from 'antd'
import productTemplate from '../../assets/productTemplate.jpg'
import AuctionService from '../../services/AuctionService'

const { Header, Content } = Layout
const { Title, Text } = Typography
const { Option } = Select

export default function AuctionConfirmation() {
    const [paymentMethod, setPaymentMethod] = useState('vnpay')
    const [receiveMethod, setReceiveMethod] = useState('delivery')

    const auction = {
        productName: 'Vintage Watch',
        winningBid: 1500,
        registrationFee: 100,
        deposit: 400,
        transactionId: 'AUC12345'
    }

    const handleVnpayPayment = () => {
        const paymentData = {
            amount: auction.registrationFee + auction.deposit,
            bankCode: "",
            auctionId: auction.transactionId
        }

        AuctionService.getURlPayment(paymentData)
            .then(response => {
                if (response.paymentUrl) {
                    window.location.href = response.paymentUrl
                }
            })
            .catch(error => {
                console.error('Payment initialization error:', error)
            })
    }

    return (
        <Layout className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
            <Content className="py-12 !px-10">
                <Card 
                    className="max-w-3xl mx-auto shadow-2xl rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300"
                    style={{ borderRadius: '16px' }}
                >
                    <Header className="bg-gradient-to-r from-blue-600 to-blue-500 p-6 mb-6 text-center my-auto">
                        <Title level={2} className="text-white m-0 tracking-wide my-auto h-auto">
                            <CheckCircleOutlined className="mr-3 text-white" />
                            Auction Confirmation
                        </Title>
                    </Header>

                    <Space direction="vertical" size="large" className="w-full p-6">
                        {/* Product Details */}
                        <Row gutter={16} align="top" className="bg-gray-50 p-4 rounded-lg">
                            <Col>
                                <img
                                    src={productTemplate}
                                    alt="Product Image"
                                    width={120}
                                    height={120}
                                    className="rounded-xl border-2 border-blue-100 shadow-md"
                                />
                            </Col>
                            <Col flex={1}>
                                <Title level={3} className="mb-2">{auction.productName}</Title>
                                <Text className="text-green-600 text-lg font-bold block">Winning Bid: ${auction.winningBid}</Text>
                                <Text type="secondary" className="text-sm block mt-1">Transaction ID: {auction.transactionId}</Text>
                            </Col>
                        </Row>

                        {/* Payment Methods */}
                        <Space direction="vertical" className="w-full">
                            <Title level={4} className="mb-4">Payment Method</Title>
                            <Radio.Group 
                                onChange={(e) => setPaymentMethod(e.target.value)} 
                                value={paymentMethod}
                                className="w-full"
                                buttonStyle="solid"
                            >
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Radio.Button value="vnpay" className="w-full text-center">
                                            VNPay
                                        </Radio.Button>
                                    </Col>
                                    <Col span={12}>
                                        <Radio.Button value="bank" className="w-full text-center">
                                            Bank Transfer
                                        </Radio.Button>
                                    </Col>
                                </Row>
                            </Radio.Group>

                            {paymentMethod === 'vnpay' && (
                                <Card 
                                    className="mt-4 bg-blue-50 border-blue-200" 
                                    bordered={false}
                                >
                                    <Space direction="vertical" className="w-full">
                                        <div className="bg-white p-4 rounded-lg shadow-sm">
                                            <Text strong className="block mb-2">Payment Summary:</Text>
                                            <Text className="block">Registration Fee: ${auction.registrationFee}</Text>
                                            <Text className="block">Deposit: ${auction.deposit}</Text>
                                            <Text className="block font-bold">Total: ${auction.registrationFee + auction.deposit}</Text>
                                        </div>
                                        <Button 
                                            type="primary" 
                                            block 
                                            onClick={handleVnpayPayment}
                                            className="mt-4"
                                        >
                                            Proceed to VNPay
                                        </Button>
                                    </Space>
                                </Card>
                            )}
                        </Space>

                        {/* Shipping Details */}
                        <Space direction="vertical" className="w-full">
                            <Title level={4} className="mb-4">Shipping/Receiving Details</Title>
                            <Select
                                placeholder="Select delivery method"
                                onChange={(value) => setReceiveMethod(value)}
                                className="w-full"
                            >
                                <Option value="delivery">Delivery</Option>
                                <Option value="pickup">Pick-up</Option>
                            </Select>

                            {receiveMethod === 'delivery' && (
                                <Space direction="vertical" className="w-full mt-4">
                                    <Form layout="vertical">
                                        <Form.Item label="Delivery Address">
                                            <Input 
                                                placeholder="Enter your delivery address" 
                                                className="rounded-lg"
                                            />
                                        </Form.Item>
                                        <Form.Item label="Contact Number">
                                            <Input 
                                                placeholder="Enter your contact number" 
                                                className="rounded-lg"
                                            />
                                        </Form.Item>
                                    </Form>
                                </Space>
                            )}

                            {receiveMethod === 'pickup' && (
                                <div className="mt-4 bg-gray-100 rounded-lg h-48 flex items-center justify-center">
                                    <HeatMapOutlined className="text-4xl text-gray-400 mr-2" />
                                    <Text className="text-gray-600">Map showing pick-up location</Text>
                                </div>
                            )}
                        </Space>

                        {/* Terms and Confirmation */}
                        <Space direction="vertical" className="w-full">
                            <Checkbox className="text-sm">
                                I agree to the <a href="#" className="text-blue-600 hover:underline">terms and conditions</a>
                            </Checkbox>
                        </Space>
                    </Space>
                </Card>
            </Content>
        </Layout>
    )
}