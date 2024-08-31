import React from 'react';

const ProductItem = ({ image, name, price, endsIn }) => {
  return (
    <div className="rounded-lg shadow-md overflow-hidden border border-[#E6E6E6]">
      <div className="aspect-w-1 aspect-h-1">
        <img src={image} alt={name} className="object-cover w-full h-full" />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{name}</h3>
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold">${price.toLocaleString()}</span>
          <span className="text-sm text-gray-500">Ends in {endsIn}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;