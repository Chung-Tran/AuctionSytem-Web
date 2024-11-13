import React from 'react';
import '../../scss/ActiveAuctionRooms.scss';

const ActiveAuctionRooms = ({ rooms }) => {
  return (
    <div className="active-auction-rooms">
      <h2>Phòng đấu giá đang diễn ra</h2>
      {rooms.length > 0 ? (
        <ul>
          {rooms.map((room) => (
            <li key={room.id} className="room-item">
              <div>
                <strong>{room.name}</strong>
                <p>Người tạo: {room.sellerName}</p>
                <p>Thời gian kết thúc: {room.productImages}</p>
              </div>
              <button className="join-button">Tham gia</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Không có phòng đấu giá nào đang diễn ra.</p>
      )}
    </div>
  );
};

export default ActiveAuctionRooms;
