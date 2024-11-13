import React from 'react';
import '../../scss/PendingAuctions.scss';

const PendingAuctions = ({ auctions }) => {
  return (
    <div className="pending-auctions">
      <h2>Phiên đấu giá đang chờ phê duyệt</h2>
      {auctions.length > 0 ? (
        <ul>
          {auctions.map((auction) => (
            <li key={auction.id} className="auction-item">
              <div>
                <strong>{auction.title}</strong>
                <p>Ngày tạo: {auction.createdDate}</p>
              </div>
              <button className="approve-button">Phê duyệt</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Không có phiên đấu giá nào đang chờ phê duyệt.</p>
      )}
    </div>
  );
};

export default PendingAuctions;