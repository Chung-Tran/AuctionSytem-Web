import React from 'react'
import Breadcrumb from '../../components/BreadCrumb/BreadCrumb';
import AuctioningItem from '../../components/Auctions/AuctioningItem';

const AuctioningPage = () => {
    const auctionItems = [
        {
            id: 1,
            name: "Vintage Typewriter",
            image: "/placeholder.svg",
            price: 250,
            highestBid: 300,
            timeRemaining: "2h 15m",
            status: "Open",
            participants: 15,
        },
        {
            id: 2,
            name: "Antique Vase",
            image: "/placeholder.svg",
            price: 450,
            highestBid: 500,
            timeRemaining: "1h 45m",
            status: "Open",
            participants: 22,
        },
        {
            id: 3,
            name: "Luxury Watch",
            image: "/placeholder.svg",
            price: 1200,
            highestBid: 1500,
            timeRemaining: "3h 30m",
            status: "Closed",
            participants: 18,
        },
        {
            id: 4,
            name: "Vintage Camera",
            image: "/placeholder.svg",
            price: 800,
            highestBid: 850,
            timeRemaining: "4h 10m",
            status: "Open",
            participants: 12,
        },
    ];
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
                    {auctionItems.map((item) => (
                        <AuctioningItem key={item.id} item={item} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default AuctioningPage
