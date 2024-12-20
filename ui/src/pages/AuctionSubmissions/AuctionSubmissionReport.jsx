import { jsPDF } from 'jspdf';
import { Button, notification } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { openNotify } from '../../commons/MethodsCommons';

const generateTransactionReport = (transactionDetails) => {
  const doc = new jsPDF();

  // Tiêu đề
  doc.setFontSize(18);
  doc.text('AUCTION TRANSACTION REPORT', 105, 20, { align: 'center' });

  // Thông tin chung
  doc.setFontSize(12);
  doc.text(`Report Date: ${new Date().toLocaleDateString()}`, 14, 30);
  doc.text(`Report Number: ${transactionDetails.reportId}`, 14, 35);

  // Side A - Auction Platform
  doc.setFontSize(14);
  doc.text('Side A: Auction Platform', 14, 50);
  doc.setFontSize(12);
  doc.text(`Name: ${transactionDetails.platform.name}`, 14, 60);
  doc.text(`Address: ${transactionDetails.platform.address}`, 14, 65);
  doc.text(`Email: ${transactionDetails.platform.email}`, 14, 70);
  doc.text(`Phone: ${transactionDetails.platform.phone}`, 14, 75);

  // Side B - Seller
  doc.setFontSize(14);
  doc.text('Side B: Seller', 14, 90);
  doc.setFontSize(12);
  doc.text(`Name: ${transactionDetails.seller.name}`, 14, 100);
  doc.text(`Address: ${transactionDetails.seller.address}`, 14, 105);
  doc.text(`Email: ${transactionDetails.seller.email}`, 14, 110);
  doc.text(`Phone: ${transactionDetails.seller.phone}`, 14, 115);

  // Product Information
  doc.setFontSize(14);
  doc.text('Product Information', 14, 130);
  doc.setFontSize(12);
  doc.text(`Product Name: ${transactionDetails.product.name}`, 14, 140);
  doc.text(`Description: ${transactionDetails.product.description}`, 14, 145);
  doc.text(`Auction ID: ${transactionDetails.product.auctionId}`, 14, 150);
  doc.text(`Starting Price: ${transactionDetails.product.startingPrice} USD`, 14, 155);
  doc.text(`Final Price: ${transactionDetails.product.finalPrice} USD`, 14, 160);

  // Bank Information (if available)
  if (transactionDetails.bankInfo) {
    doc.setFontSize(14);
    doc.text('Bank Account Information', 14, 175);
    doc.setFontSize(12);
    doc.text(`Bank: ${transactionDetails.bankInfo.bankName}`, 14, 185);
    doc.text(`Account Holder: ${transactionDetails.bankInfo.accountHolderName}`, 14, 190);
    doc.text(`Account Number: ${transactionDetails.bankInfo.accountNumber}`, 14, 195);
  }

  // Commitments and Terms
  doc.setFontSize(14);
  doc.text('Commitments and Terms', 14, 210);
  doc.setFontSize(12);
  doc.text('1. Side A commits to complete the transaction within the stipulated time.', 14, 220);
  doc.text('2. Side B commits to deliver the product with the correct quality and within the agreed time.', 14, 225);
  doc.text('3. Product warranty: 12 months from the delivery date.', 14, 230);
  doc.text('4. If the product does not match the description, Side B may return it within 7 days.', 14, 235);

  // Signature section
  doc.text('Signature of Side A: _______________________', 14, 250);
  doc.text('Signature of Side B: _______________________', 120, 250);

  // Save PDF
  doc.save('auction_transaction_report.pdf');
};

// Sample transaction data
const transactionDetails = {
  reportId: 'AUC2023-01',
  platform: {
    name: 'ABC Auction Platform',
    address: '123 ABC Street, XYZ City',
    email: 'contact@abcauction.com',
    phone: '0909 123 456',
  },
  seller: {
    name: 'John Doe',
    address: '456 DEF Street, XYZ City',
    email: 'johndoe@gmail.com',
    phone: '0987 654 321',
  },
  product: {
    name: 'Rare Painting',
    description: 'Original artwork by a renowned artist',
    auctionId: 'AUC12345',
    startingPrice: 1500,
    finalPrice: 1800,
  },
  bankInfo: {
    bankName: 'Sacombank',
    accountHolderName: 'John Doe',
    accountNumber: '123456789',
  },
};

// Transaction Report Button
const TransactionReportButton = () => {
  const handleDownload = () => {
    try {
      generateTransactionReport(transactionDetails);
      openNotify('success','Transaction Report downloaded successfully!')
      // notification.success({ message: 'Transaction Report downloaded successfully!' });
    } catch (error) {
      openNotify('error','Failed to download transaction report.!')
      // notification.error({ message: 'Failed to download transaction report.' });
    }
  };

  return (
    <Button icon={<DownloadOutlined />} onClick={handleDownload} >
      Download Transaction Report
    </Button>
  );
};

export default TransactionReportButton;
