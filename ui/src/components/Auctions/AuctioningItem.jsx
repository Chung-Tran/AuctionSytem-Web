// import { Button } from "@/components/ui/button";

export default function AuctioningItem({ item }) {
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
          Time Remaining: {item.timeRemaining}
        </div>
        <div className="absolute top-4 left-4 bg-background/80 px-2 py-1 rounded-md text-sm text-muted-foreground">
          Status: <span className="font-medium">{item.status}</span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-medium mb-2">{item.name}</h3>
        <div className="flex items-center justify-between mb-4">
          <div className="text-primary font-medium">${item.price}</div>
          <div className="text-primary font-medium">Highest Bid: ${item.highestBid}</div>
        </div>
        <div className="flex items-center justify-between mb-4">
          <div className="text-muted-foreground font-medium">Participants: {item.participants}</div>
        </div>
        <button size="sm" className='w-full inline-flex items-center justify-center whitespace-nowrap text-sm font-medium bg-primary h-11 rounded-md px-8 text-white'>
          <a href="/auctions/room/roomId">Join Auction</a>
        </button>
      </div>
    </div>
  );
}
