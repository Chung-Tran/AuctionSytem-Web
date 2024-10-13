import React, { useEffect, useState } from 'react'
import Breadcrumb from '../../components/BreadCrumb/BreadCrumb';
import AuctioningItem from '../../components/Auctions/AuctioningItem';
import AuctionService from '../../services/AuctionService';

const AuctioningPage = () => {
    const [auctions, setAuctions] = useState([]);
    const [searchOptions, setSearchOptions] = useState({
        limit: 8,
        page: 1,
        // status:'active'
    });
    useEffect(() => {
        const fetchData = async () => {
            const auctionList = await AuctionService.getList(searchOptions);
            if (auctionList) {
                setAuctions(auctionList.docs);
            }
        };
        fetchData();
    }, [searchOptions]);

    return (
        <div>
            <Breadcrumb
                items={[
                    { label: "Home", href: "/" },
                    { label: "Upcoming Auctions", href: null },
                ]}
                title="Sản phẩm đấu giá"
            />
            <div className="w-full mx-auto p-12 container">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-center">Live Auction Rooms</h1>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {auctions.map((item) => (
                        <AuctioningItem 
                        key={item._id}
                        _id={item._id}
                        image={item.image}
                        name={item.productName}
                        slug={item.slug}
                        price={item.startingPrice}
                        highestBid={item.highestBid || 122222}
                        participants={item.participants || 1}
                        endsIn={item.registrationOpenDate || new Date(Date.now() + 24 * 60 * 60 * 1000)} //Thời gian còn lại để đăng ký
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default AuctioningPage
