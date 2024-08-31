// Banner.js
import React from 'react';

const Banner = () => {
    return (
        <div className="flex p-8 w-full mx-auto justify-center items-center">
            <div className="w-1/2 pr-8 flex flex-col gap-4 h-fit ">
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl leading-4">Discover Unique Treasures at Our Auctions</h2>
                <p className="text-gray-600 mb-6 text-lg md:text-xl">Browse a curated selection of rare and valuable items up for auction. Register now to start bidding.</p>
                <div className="space-x-2 flex flex-col sm:flex-row gap-1">
                    <button className="bg-black text-white px-6 py-2 rounded-md font-medium h-10 inline-flex flex-1 items-center justify-center">Browse Auctions</button>
                    <button className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md font-medium h-10 inline-flex flex-1 items-center justify-center">Sell an item</button>
                </div>
            </div>
            <div className="w-1/2 h-full">
                <div className="h-full rounded-lg overflow-hidden relative flex items-center justify-center">
                    <div className='relative h-full w-full'>
                    <img src="https://static.automotor.vn/w640/images/upload/2022/06/01/2021-lamborghini-sian-automotor.jpeg" alt="Rare Antique Vase" className="object-cover w-full h-full" />
                   </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
                        <h3 className="text-xl font-semibold">Rare Antique Vase</h3>
                        <p>Current Bid: $2,500</p>
                        <p>Ends in 2 days</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Banner;
