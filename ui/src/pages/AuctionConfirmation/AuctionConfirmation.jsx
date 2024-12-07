import React, { useState } from 'react';
import { CheckCircleOutlined } from '@ant-design/icons';
import {
    Layout,
    Typography,
    Space,
    Radio,
    Button,
    Card,
    Row,
    Col,
    Form,
    Checkbox,
    Spin,
    message,
} from 'antd';
import productTemplate from '../../assets/productTemplate.jpg';
import mastercardLogo from '../../assets/mastercardLogo.png';
import vnpaylogo from '../../assets/vnpaylogo.jpg';
import { usePaymentPolling } from '../ProductDetail/RegistrationSteps';
import { formatCurrency, openNotify } from '../../commons/MethodsCommons';
import { Helmet } from 'react-helmet';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

export default function AuctionConfirmation() {
    const [paymentMethod, setPaymentMethod] = useState('pickup');
    const [paymentType, setPaymentType] = useState('pickup');
    const [isPaid, setIsPaid] = useState(false);
    const [isConfirm, setIsConfirm] = useState(false);
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [termsChecked, setTermsChecked] = useState(false);
    const { handleVnpayPayment, paymentStatus, error, isPolling } = usePaymentPolling(
        (response) => {
            setIsPaid(true);
        },
        (error) => {
            openNotify('error', 'Payment failed. Try again!!')
        }
    );

    const handleStartPayment = () => {
        handleVnpayPayment({ _id: '67022c2571559f5b1150a8c6', userId: '66f836c4c2f85b1bc07d369f', amount: 70000 }, 'confirm');
        setPaymentLoading(true);
    };

    const auction = {
        productName: 'Vintage Watch',
        winningBid: 1500,
        registrationFee: 100,
        deposit: 400,
        transactionId: 'AUC12345',
        pickupLocation: '123 Auction St, City Center, Ho Chi Minh City',
        paymentDeadline: '2024-12-10',
    };

    // Hàm render card phương thức thanh toán
    const renderPaymentMethodCard = (value, title, description, logo = null, event) => (
        <Radio value={value} className="w-full">
            <Card
                className="w-full h-full hover:shadow-md transition-all duration-300 rounded-lg p-4 flex items-center"
                bodyStyle={{ display: 'flex', alignItems: 'center', width: '100%' }}
                onClick={() => setPaymentMethod(value)}
            >
                {logo && <img src={logo} alt={title} className="w-12 h-12 mr-4" />}
                <div className="flex-grow">
                    <h4 className="font-semibold text-base">{title}</h4>
                    <p className="text-sm text-gray-500">{description}</p>
                </div>
            </Card>
        </Radio>
    );
    const handleConfirm = () => {
        if (!termsChecked) {
            message.error('You must agree to the terms and conditions.');
            return;
        }

        if (paymentMethod === 'payment_methods' && !isPaid) {
            message.error('Please complete the payment before confirming.');
            return;
        }

        setIsConfirm(true);
        message.success('Confirmation submitted.');
    };
    return (
        <>
            <Helmet>
                <title>Auction Confirm</title>
                <meta property="og:title" content="Auction Confirm" />
                <meta property="og:description" content="Auction Confirm" />
            </Helmet>
            <Layout className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">

                <Content className="py-12 px-4 lg:px-10">

                    <Card
                        className="max-w-3xl mx-auto shadow-2xl rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300"
                        style={{ borderRadius: '16px' }}
                    >
                        {/* Header */}
                        <Header className="bg-gradient-to-r from-blue-600 to-blue-500 text-center mb-3 ">
                            <Title level={2} className="text-white mt-1 tracking-wide flex items-center justify-center">
                                <div><CheckCircleOutlined className="mr-3 text-white" />
                                    Auction Confirmation</div>
                            </Title>
                            <Text className="text-black text-sm">
                                Please confirm payment by <strong>{auction.paymentDeadline}</strong>
                            </Text>
                        </Header>

                        <Space direction="vertical" size="large" className="w-full p-6">
                            {/* Product Details */}
                            <Row gutter={16} align="middle" className="bg-gray-50 p-4 rounded-lg">
                                <Col xs={24} sm={6} className="text-center mb-4 sm:mb-0">
                                    <img
                                        src={productTemplate}
                                        alt="Product Image"
                                        className="mx-auto rounded-xl border-2 border-blue-100 shadow-md max-w-[120px] max-h-[120px] object-cover"
                                    />
                                </Col>
                                <Col xs={24} sm={18}>
                                    <Title level={3} className=" text-center sm:text-left">
                                        {auction.productName}
                                    </Title>
                                    <div className="text-center sm:text-left">
                                        {/* <Text className="text-green-600 text-lg font-bold block">
                                        Winning Bid: ${auction.winningBid}
                                    </Text> */}
                                        <Text type="secondary" className="text-sm block ">
                                            Transaction ID: {auction.transactionId}
                                        </Text>
                                        <div className="flex justify-between">
                                            <span className="font-medium w-28 mr-4">Winning Bid:</span>
                                            <span className="font-normal text-left w-1/2">{formatCurrency(7000000)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-medium w-28 mr-4">Deposit:</span>
                                            <span className="font-normal text-left w-1/2">- {formatCurrency(7000000)}</span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span className="font-medium w-28 mr-4">Total Receiving:</span>
                                            <span className=" text-left w-1/2 font-bold"> {formatCurrency(
                                                auction.winningPrice - auction.deposit + auction.registrationFee
                                            )}</span>
                                        </div>

                                    </div>
                                </Col>
                            </Row>

                            {/* Payment Methods */}
                            <Space direction="vertical" className="w-full">
                                <Title level={4} className="mb-4">Payment Method</Title>
                                {isPaid ? (
                                    <Card className="bg-green-50 border-green-200 p-4 text-center">
                                        <Text strong className="text-green-600 text-lg">Payment Completed</Text>
                                        <Text className="block mt-1">Thank you for your payment!</Text>
                                    </Card>
                                ) : (
                                    <>
                                        <Radio.Group
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            value={paymentMethod}
                                            className="w-full"
                                        >
                                            <Row gutter={[16, 16]} className="w-full">
                                                <Col xs={24} sm={12}>
                                                    {renderPaymentMethodCard(
                                                        'pickup',
                                                        'Thanh toán khi nhận hàng',
                                                        'Thanh toán trực tiếp tại địa điểm nhận hàng'
                                                    )}
                                                </Col>
                                                <Col xs={24} sm={12}>
                                                    {renderPaymentMethodCard(
                                                        'payment_methods',
                                                        'Chọn phương thức thanh toán',
                                                        'Thanh toán trước khi nhận hàng'
                                                    )}
                                                </Col>
                                            </Row>
                                        </Radio.Group>

                                        {paymentMethod === 'payment_methods' && (
                                            <Radio.Group
                                                onChange={(e) => setPaymentType(e.target.value)}
                                                className="w-full mt-4"
                                            >
                                                <Row gutter={[16, 16]} className="w-full">
                                                    <Col xs={24} sm={12}>
                                                        {renderPaymentMethodCard(
                                                            'vnpay',
                                                            'VNPay',
                                                            'Thanh toán an toàn qua VNPay',
                                                            vnpaylogo,
                                                            handleStartPayment
                                                        )}
                                                        {paymentType === 'vnpay' && (
                                                            <div className="mt-4 text-center">
                                                                {paymentLoading ? (
                                                                    <Spin />
                                                                ) : (
                                                                    <Button type="primary" onClick={handleStartPayment}>
                                                                        Thanh toán
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        )}
                                                    </Col>
                                                    <Col xs={24} sm={12}>
                                                        {renderPaymentMethodCard(
                                                            'bank_transfer',
                                                            'Chuyển khoản ngân hàng',
                                                            'Thanh toán qua liên ngân hàng',
                                                            mastercardLogo
                                                        )}
                                                    </Col>
                                                </Row>
                                            </Radio.Group>
                                        )}
                                    </>
                                )}
                            </Space>

                            {/* Pickup Details */}
                            <Space direction="vertical" className="w-full">
                                <Title level={4} className="mb-4">Pickup Location</Title>
                                <Card className="bg-gray-100 rounded-lg p-4">
                                    <Text strong className="block mb-2">Pickup Address:</Text>
                                    <Text className="block">{auction.pickupLocation}</Text>
                                </Card>
                            </Space>

                            {/* Terms and Confirmation */}
                            <Space direction="vertical" className="w-full">

                                <Checkbox checked={termsChecked} onClick={(e) => setTermsChecked(!termsChecked)}>
                                    I agree to the <a href="#" className="text-blue-600 hover:underline">terms and conditions</a>
                                </Checkbox>
                                {!isConfirm ? (
                                    <Button type="primary" block onClick={handleConfirm}>
                                        Confirm & Proceed
                                    </Button>
                                )
                                    : (
                                        <Button type="primary" disabled block onClick={handleConfirm}>
                                            Confirmed
                                        </Button>
                                    )}
                            </Space>
                        </Space>
                    </Card>
                </Content>
            </Layout>
        </>

    );
}