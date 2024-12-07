// import { Button } from "@/components/ui/button";

import { useContext } from "react";
import { countdown, formatCurrency } from "../../commons/MethodsCommons";
import { AppContext } from "../../AppContext";
import { useNavigate } from 'react-router-dom';

export default function AuctioningItem(item) {
  const { user, toggleLoginModal } = useContext(AppContext);
  const navigate = useNavigate();
  const handleNavigate = (_id) => {
    if (!user)
    {
      toggleLoginModal(true)
    } else {
      navigate(`/auctions/room/${_id}`);
    }
  }
  return (
    <div className="bg-card rounded-lg overflow-hidden shadow-lg">
      <div className="relative">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-48 object-cover"
          style={{ aspectRatio: "400/300", objectFit: "cover" }}
        />
        <div className="absolute bottom-4 right-4 bg-background/80 px-2 py-1 rounded-md text-sm text-muted-foreground">
          Time Remaining: {countdown(item.timeRemaining)}
        </div>
        <div className="absolute top-4 left-4 bg-background/80 px-2 py-1 rounded-md text-sm text-muted-foreground">
          Status: <span className="font-medium">Ongoing</span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-medium mb-2">{item.name}</h3>
        <div className="flex items-center justify-between mb-4">
          <div className="text-primary font-medium">${formatCurrency(item.price)}</div>
          <div className="text-primary font-medium">Highest Bid: {formatCurrency(item.highestBid)}</div>
        </div>
        <div className="flex items-center justify-between mb-4">
          <div className="text-muted-foreground font-medium">Participants: { item.participants}</div>
        </div>
        <button
          onClick={()=>handleNavigate(item._id)}
          size="sm"
          className='w-full inline-flex items-center justify-center whitespace-nowrap text-sm font-medium bg-primary h-11 rounded-md px-8 text-white'>
          <span >Join Auction</span>
        </button>
      </div>
    </div>
  );
}
