import React, { useState } from 'react';
import { Steps, Button, message, Modal, Form, Input, Result, Card, Statistic, Radio, Row, Col } from 'antd';
import { CheckCircleOutlined, DollarCircleOutlined, SafetyOutlined } from '@ant-design/icons';

const { Step } = Steps;

const RegistrationSteps = ({ auction, onClose }) => {
  const [current, setCurrent] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('vnpay');

  const steps = [
    {
      title: 'Xác nhận thông tin',
      icon: <SafetyOutlined />,
      content: (
        <Card className="w-full shadow-lg rounded-lg p-6 mb-6">
          <Form layout="vertical">
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Form.Item label="Tên sản phẩm">
                  <Input value={auction.productName} disabled className="bg-gray-100" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Giá khởi điểm">
                  <Statistic 
                    value={auction.startingPrice} 
                    prefix="₫"
                    valueStyle={{ color: '#3f8600' }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Phí đăng ký">
                  <Statistic 
                    value={auction.registrationFee} 
                    prefix="₫"
                    valueStyle={{ color: '#cf1322' }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Tiền đặt cọc">
                  <Statistic 
                    value={auction.deposit} 
                    prefix="₫"
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      ),
    },
    {
      title: 'Thanh toán',
      icon: <DollarCircleOutlined />,
      content: (
        <Card className="w-full shadow-lg rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Chọn phương thức thanh toán:</h3>
          <Radio.Group onChange={(e) => setPaymentMethod(e.target.value)} value={paymentMethod} className="space-y-4">
            <Radio value="vnpay" className="w-full">
              <Card className="w-full hover:shadow-md transition-all duration-300 rounded-lg p-4">
                <div className="flex items-center">
                  <img src="/path-to-vnpay-logo.png" alt="VNPay" className="w-12 h-12 mr-4" />
                  <div>
                    <h4 className="font-semibold">VNPay</h4>
                    <p className="text-sm text-gray-500">Thanh toán an toàn qua VNPay</p>
                  </div>
                </div>
              </Card>
            </Radio>
            <Radio value="bank_transfer" className="w-full">
              <Card className="w-full hover:shadow-md transition-all duration-300 rounded-lg p-4">
                <div className="flex items-center">
                  <img src="/path-to-bank-transfer-icon.png" alt="Chuyển khoản ngân hàng" className="w-12 h-12 mr-4" />
                  <div>
                    <h4 className="font-semibold">Chuyển khoản ngân hàng</h4>
                    <p className="text-sm text-gray-500">Chuyển khoản trực tiếp đến tài khoản của chúng tôi</p>
                  </div>
                </div>
              </Card>
            </Radio>
          </Radio.Group>
        </Card>
      ),
    },
    {
      title: 'Hoàn thành',
      icon: <CheckCircleOutlined />,
      content: (
        <Result
          status="success"
          title="Đăng ký thành công!"
          subTitle="Bạn đã đăng ký tham gia đấu giá thành công. Chúng tôi sẽ thông báo cho bạn khi phiên đấu giá bắt đầu."
          extra={[
            <Button type="primary" key="console" onClick={onClose}>
              Đóng
            </Button>,
          ]}
        />
      ),
    },
  ];

  const next = () => setCurrent(current + 1);
  const prev = () => setCurrent(current - 1);

  return (
    <Modal
      title={<h2 className="text-2xl font-bold">Đăng ký tham gia đấu giá</h2>}
      visible={isModalVisible}
      onCancel={onClose}
      footer={null}
      width={800}
      className="custom-modal"
    >
      <Steps current={current} className="mb-8">
        {steps.map(item => (
          <Step key={item.title} title={item.title} icon={item.icon} />
        ))}
      </Steps>
      <div className="steps-content mb-8">{steps[current].content}</div>
      <div className="steps-action flex justify-between">
        {current > 0 && (
          <Button onClick={prev}>
            Quay lại
          </Button>
        )}
        {current < steps.length - 1 && (
          <Button type="primary" onClick={next}>
            {current === 1 ? 'Thanh toán' : 'Tiếp tục'}
          </Button>
        )}
      </div>
    </Modal>
  );
};

export default RegistrationSteps;
