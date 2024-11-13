import React from 'react';
import '../../scss/CompletedAuctions.scss';

const CompletedAuctions = ({ auctions }) => {
  return (
    <div className="completed-auctions">
      <h2>Tất cả các phiên đấu giá đã có</h2>
      {auctions.length > 0 ? (
        <ul>
          {auctions.map((auction) => (
            <li key={auction.id} className="completed-auction-item">
              <div>
                <strong>{auction.title}</strong>
                <p>Ngày kết thúc: {auction.endDate}</p>
                <p>Người thắng: {auction.winner}</p>
                <p>Giá cuối cùng: {auction.finalPrice} VNĐ</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>Không có phiên đấu giá nào đã xảy ra.</p>
      )}
    </div>
  );
};

export default CompletedAuctions;
