import React from 'react'
import Banner from '../../components/Home/Banner'
import { Filter, SortAsc } from 'lucide-react';
import ProductItem from '../../components/Product/ProductItem';
import logo from '../../assets/logo192.png'
const Home = () => {
    const products = [
        { id: 1, name: "Antique Pocket Watch", price: 1250, endsIn: "3 days", image: logo },
        { id: 2, name: "Vintage Typewriter", price: 450, endsIn: "1 day", image: logo },
        { id: 3, name: "Rare Porcelain Vase", price: 3800, endsIn: "5 days", image: logo },
        { id: 4, name: "Vintage Rolex Watch", price: 12500, endsIn: "2 days", image: logo },
    ];
    return (
        <div className=' relative mx-auto'>
            <div className='w-full min-h-[90vh] h-auto flex justify-center '>
                <Banner />
            </div>
            <section className="py-12 ">
                <div className=" mx-auto px-4 container">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold">Featured Products</h2>
                        <div className="flex space-x-4">
                            <button className="flex items-center space-x-2  hover:text-gray-900 border border-[#E6E6E6] py-1.5 px-2 rounded">
                                <Filter size={18} />
                                <span className='text-medium text-sm'>Filters</span>
                            </button>
                            <button className="flex items-center space-x-2  hover:text-gray-900 border border-[#E6E6E6] py-1.5 px-2 rounded">
                                <SortAsc size={20} />
                                <span className='text-medium text-sm'>Sort</span>
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <ProductItem
                                key={product.id}
                                image={product.image}
                                name={product.name}
                                price={product.price}
                                endsIn={product.endsIn}
                            />
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-muted py-12">
                <div className="container mx-auto px-4 md:px-6">
                    <h2 className="text-2xl font-bold mb-6">Product Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className='h-[600px]'>
                            <img
                                src="/placeholder.svg"
                                alt="Product Image"
                                width={600}
                                height={600}
                                className="w-full rounded-lg"
                                style={{ aspectRatio: "600/600", objectFit: "cover" }}
                            />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold mb-4">Vintage Typewriter</h3>
                            <p className="text-muted-foreground mb-6">
                                This fully restored 1950s typewriter is a true piece of history. With its classic design and smooth
                                typing action, it's a must-have for any vintage enthusiast or writer looking to add a touch of
                                nostalgia to their workspace.
                            </p>
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <p className="text-muted-foreground">Time Remaining:</p>
                                    <p className="text-2xl font-bold">2 days 12 hours</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Current Bid:</p>
                                    <p className="text-2xl font-bold">$150</p>
                                </div>
                            </div>
                            <button size="lg" className="w-full inline-flex items-center justify-center whitespace-nowrap text-sm font-medium bg-primary h-11 rounded-md px-8 text-white">
                                Place Bid
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-muted py-12">
                <div className="container mx-auto px-4 md:px-6">
                    <h2 className="text-2xl font-bold mb-6">Sold Items</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        <div className="bg-background rounded-lg shadow-lg overflow-hidden">
                            <img
                                src="/placeholder.svg"
                                alt="Sold Item 1"
                                width={400}
                                height={300}
                                className="w-full h-48 object-cover"
                                style={{ aspectRatio: "400/300", objectFit: "cover" }}
                            />
                            <div className="p-4">
                                <h3 className="text-xl font-bold mb-2">Vintage Typewriter</h3>
                                <p className="text-muted-foreground mb-4">Sold for $250 on June 1, 2023</p>
                            </div>
                        </div>
                        <div className="bg-background rounded-lg shadow-lg overflow-hidden">
                            <img
                                src="/placeholder.svg"
                                alt="Sold Item 2"
                                width={400}
                                height={300}
                                className="w-full h-48 object-cover"
                                style={{ aspectRatio: "400/300", objectFit: "cover" }}
                            />
                            <div className="p-4">
                                <h3 className="text-xl font-bold mb-2">Antique Vase</h3>
                                <p className="text-muted-foreground mb-4">Sold for $500 on May 15, 2023</p>
                            </div>
                        </div>
                        <div className="bg-background rounded-lg shadow-lg overflow-hidden">
                            <img
                                src="/placeholder.svg"
                                alt="Sold Item 3"
                                width={400}
                                height={300}
                                className="w-full h-48 object-cover"
                                style={{ aspectRatio: "400/300", objectFit: "cover" }}
                            />
                            <div className="p-4">
                                <h3 className="text-xl font-bold mb-2">Retro Camera</h3>
                                <p className="text-muted-foreground mb-4">Sold for $150 on April 30, 2023</p>
                            </div>
                        </div>
                        <div className="bg-background rounded-lg shadow-lg overflow-hidden">
                            <img
                                src="/placeholder.svg"
                                alt="Sold Item 4"
                                width={400}
                                height={300}
                                className="w-full h-48 object-cover"
                                style={{ aspectRatio: "400/300", objectFit: "cover" }}
                            />
                            <div className="p-4">
                                <h3 className="text-xl font-bold mb-2">Vintage Vinyl</h3>
                                <p className="text-muted-foreground mb-4">Sold for $300 on March 20, 2023</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="bg-muted py-12">
                <div className="container mx-auto px-4 md:px-6">
                    <h2 className="text-2xl font-bold mb-6">About Auction House</h2>
                    <p className="text-muted-foreground mb-6">
                        Auction House is a premier destination for collectors and vintage enthusiasts to discover unique and rare
                        items. Our team of experts carefully curates each item, ensuring authenticity and quality. Whether you're
                        looking for a one-of-a-kind piece or a timeless classic, Auction House is the place to find your next
                        treasure.
                    </p>
                    <div className="flex justify-center">
                        <button size="lg" className='w-fit inline-flex items-center justify-center whitespace-nowrap text-sm font-medium bg-primary h-11 rounded-md px-8 text-white'>Explore Our Collection</button>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Home
