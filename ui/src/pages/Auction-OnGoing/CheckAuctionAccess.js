// src/components/CheckAuctionAccess.js
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { openNotify } from '../../commons/MethodsCommons';
import { AppContext } from '../../AppContext';
import AuctionService from '../../services/AuctionService';
import AuctionRoomOnlyView from './AuctionRoomOnlyView';

const CheckAuctionAccess = ({ children, roomId }) => {
    const navigate = useNavigate();
    const { user } = useContext(AppContext);
    const [hasRegistered, setHasRegistered] = useState(null);
    useEffect(() => {
        const checkAccess = async () => {
            if (!user) {
                openNotify('error', 'Must be login.')
                return;
            }

            const registered = await AuctionService.checkUserRegistration(roomId);
            setHasRegistered(registered);
            if (!registered) {
                navigate(`/auctions/room/${roomId}/view-only`);
            }
        };

        checkAccess();
    }, [roomId, navigate]);

    if (!hasRegistered) {
        return <AuctionRoomOnlyView roomId={roomId} />;
    }
    return <>{children}</>;
};

export default CheckAuctionAccess;

// Bạn sẽ cần định nghĩa checkLogin và checkUserRegistration là các hàm API phù hợp
