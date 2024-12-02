import React from 'react'
import { Button, notification } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import { jsPDF } from 'jspdf'

const generateTransactionReport = () => {
  const doc = new jsPDF()

  // Header
  doc.setFontSize(18)
  doc.text('BIÊN BẢN GIAO DỊCH ĐẤU GIÁ', 14, 20)
  doc.setFontSize(12)
  doc.text('Ngày lập biên bản: ' + new Date().toLocaleDateString(), 14, 30)
  doc.text('Số biên bản: AUC2023-01', 14, 35)

  // Bên A (Sàn đấu giá)
  doc.setFontSize(14)
  doc.text('Bên A: Sàn đấu giá ABC', 14, 50)
  doc.text('Địa chỉ: 123 Đường ABC, Thành phố XYZ', 14, 55)
  doc.text('Email: contact@sandaugiabc.com', 14, 60)
  doc.text('SĐT: 0909 123 456', 14, 65)

  // Bên B (Người gửi tài sản)
  doc.text('Bên B: Ông/Bà Nguyễn Văn A', 14, 75)
  doc.text('Địa chỉ: 456 Đường DEF, Thành phố XYZ', 14, 80)
  doc.text('Email: nguyenvana@gmail.com', 14, 85)
  doc.text('SĐT: 0987 654 321', 14, 90)

  // Thông tin sản phẩm
  doc.setFontSize(14)
  doc.text('Tên sản phẩm: Rare Painting', 14, 105)
  doc.text('Mô tả: Original artwork from a renowned artist', 14, 110)
  doc.text('Mã sản phẩm (AUC ID): AUC12345', 14, 115)
  doc.text('Giá khởi điểm: $1500', 14, 120)
  doc.text('Giá trúng đấu giá: $1800', 14, 125)

  // Điều khoản giao dịch
  doc.setFontSize(12)
  doc.text('Phương thức thanh toán: Chuyển khoản ngân hàng', 14, 140)
  doc.text('Ngày thanh toán: 2023-06-10', 14, 145)

  // Thông tin tài khoản ngân hàng (nếu có)
  doc.text('Thông tin tài khoản ngân hàng: ', 14, 160)
  doc.text('Ngân hàng: ABC Bank', 14, 165)
  doc.text('Số tài khoản: 123456789', 14, 170)
  doc.text('Chủ tài khoản: Nguyễn Văn A', 14, 175)

  // Cam kết của các bên
  doc.text('Cam kết của Bên A: Hoàn tất giao dịch đúng thời gian quy định.', 14, 190)
  doc.text('Cam kết của Bên B: Gửi tài sản đúng chất lượng và đúng thời gian.', 14, 195)

  // Điều khoản bảo hành
  doc.text('Bảo hành: Sản phẩm được bảo hành trong 12 tháng kể từ ngày giao hàng.', 14, 210)

  // Điều khoản về việc trả lại hàng (nếu có)
  doc.text('Trả lại hàng: Nếu sản phẩm không đúng mô tả, Bên B có quyền yêu cầu trả lại trong vòng 7 ngày.', 14, 215)

  // Ký xác nhận
  doc.text('Ký xác nhận Bên A: _______________________', 14, 230)
  doc.text('Ký xác nhận Bên B: _______________________', 14, 235)

  // Save PDF
  doc.save('auction_transaction_report.pdf')
}

const TransactionReportButton = () => {
  const handleDownload = () => {
    try {
      generateTransactionReport()
      notification.success({
        message: 'Download Successful',
        // description: 'Biên bản giao dịch đã được tạo thành công.',
      })
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Có lỗi xảy ra trong quá trình tạo biên bản.',
      })
    }
  }

  return (
    <Button 
      icon={<DownloadOutlined />} 
      onClick={handleDownload}
    //   type="primary"
      style={{ marginTop: 20 }}
    >
      Tải biên bản giao dịch
    </Button>
  )
}

export default TransactionReportButton
