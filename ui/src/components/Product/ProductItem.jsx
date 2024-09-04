import { ClockIcon, EyeIcon } from 'lucide-react';
import React from 'react';

const ProductItem = ({ image, name, price, endsIn }) => {
  return (
    // <div className="rounded-lg shadow-md overflow-hidden border border-[#E6E6E6]">
    //   <div className="aspect-w-1 aspect-h-1 max-h-[300px]">
    //     <img src={image} alt={name} className="object-cover w-full h-full" />
    //   </div>
    //   <div className="p-4">
    //     <h3 className="text-lg font-semibold mb-2">{name}</h3>
    //     <div className="flex justify-between items-center">
    //       <span className="text-xl font-bold">${price.toLocaleString()}</span>
    //       <span className="text-sm text-gray-500">Ends in {endsIn}</span>
    //     </div>
    //   </div>
    // </div>
    <div className="bg-card rounded-lg overflow-hidden shadow-lg">
      <img
        src="/placeholder.svg"
        alt="Product Image"
        width={600}
        height={400}
        className="w-full aspect-[3/2] object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold">Vintage Typewriter</h3>
        <p className="text-muted-foreground text-sm mt-1">
          Fully restored 1950s typewriter in excellent condition.
        </p>
        <div className="flex items-center justify-between mt-4">
          <div>
            <span className="text-primary font-semibold text-lg">$150</span>
            <span className="text-muted-foreground text-sm ml-2">Current Bid</span>
          </div>
          <div className="flex items-center gap-2">
            <ClockIcon className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground text-sm">2d 12h 34m</span>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <EyeIcon className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground text-sm">24 watching</span>
          </div>
          <button size="sm" className="bg-primary text-white p-2 rounded-md font-medium">Place Bid</button>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;