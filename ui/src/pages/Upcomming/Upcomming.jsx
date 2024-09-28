import React from 'react'
import Breadcrumb from '../../components/BreadCrumb/BreadCrumb'
import ProductItem from '../../components/Product/ProductItem';
import logo from '../../assets/logo192.png';
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
const Upcomming = () => {
    const buttonSelect = "bg-primary text-white ";
    const products = [
        { id: 1, name: "Antique Pocket Watch", price: 1250, endsIn: "3 days", image: logo },
        { id: 2, name: "Vintage Typewriter", price: 450, endsIn: "1 day", image: logo },
        { id: 3, name: "Rare Porcelain Vase", price: 3800, endsIn: "5 days", image: logo },
        { id: 4, name: "Vintage Rolex Watch", price: 12500, endsIn: "2 days", image: logo },
        { id: 1, name: "Antique Pocket Watch", price: 1250, endsIn: "3 days", image: logo },
        { id: 2, name: "Vintage Typewriter", price: 450, endsIn: "1 day", image: logo },
        { id: 3, name: "Rare Porcelain Vase", price: 3800, endsIn: "5 days", image: logo },
        { id: 4, name: "Vintage Rolex Watch", price: 12500, endsIn: "2 days", image: logo },
    ];
    return (
        <div>
            <Breadcrumb
                items={[
                    { label: "Home", href: "/" },
                    { label: "Upcoming Auctions", href: null },
                ]}
                title="Upcoming Auctions"
            />
            <section className='container mx-auto mt-6 px-6'>
                <h1 className="text-3xl font-bold mb-6">Upcoming</h1>
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <button variant="outline" size="sm" className={`${buttonSelect} p-2 rounded-md font-medium`}>
                            Upcoming
                        </button>
                        <button variant="outline" size="sm" className={` p-2 bg-[#F3F4F5] rounded`}>
                            Completed
                        </button>
                        <button variant="outline" size="sm" className={` p-2 bg-[#F3F4F5] rounded`}>
                            Featured
                        </button>
                    </div>
                    <input type="search" placeholder="Search auctions..." className="pl-8 pr-2 py-2 border rounded-md outline-none text-sm" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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
                <div className="flex justify-center mt-6">
                    <button className='flex p-2 hover:bg-[#F3F4F5] rounded items-center font-medium'><ChevronLeft /> &nbsp;Previous</button>
                    <button className='ml-1 flex p-2 hover:bg-[#F3F4F5] rounded items-center font-medium'>Next &nbsp;<ChevronRight /></button>
                </div>
            </section>
            <section className="bg-muted py-12 mt-10 px-6">
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
            <section className=" py-12 mt-10 px-6 ">
                <div className='container mx-auto'>
                    <h2 className="text-2xl font-bold">Related Assets</h2>
                    <div className="grid sm:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
                        <div className="bg-card rounded-lg overflow-hidden shadow-lg">
                            <img
                                src="/placeholder.svg"
                                alt="Auction Industry Trends"
                                width="400"
                                height="300"
                                className="w-full aspect-[4/3] object-cover"
                            />
                            <div className="p-4">
                                <h3 className="text-lg font-semibold">Auction Industry Trends</h3>
                                <p className="text-muted-foreground text-sm mt-1">
                                    Exploring the latest developments and insights in the world of auctions.
                                </p>
                                <div className="flex items-center justify-between mt-4">
                                    <div className="flex items-center gap-2">
                                        <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-muted-foreground text-sm">September 1, 2024</span>
                                    </div>
                                    <Link href="#" className="text-primary hover:underline" prefetch={false}>
                                        Read More
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="bg-card rounded-lg overflow-hidden shadow-lg">
                            <img
                                src="/placeholder.svg"
                                alt="Collector's Corner: Vintage Cameras"
                                width="400"
                                height="300"
                                className="w-full aspect-[4/3] object-cover"
                            />
                            <div className="p-4">
                                <h3 className="text-lg font-semibold">Collector's Corner: Vintage Cameras</h3>
                                <p className="text-muted-foreground text-sm mt-1">
                                    Dive into the world of vintage camera collecting and restoration.
                                </p>
                                <div className="flex items-center justify-between mt-4">
                                    <div className="flex items-center gap-2">
                                        <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-muted-foreground text-sm">August 15, 2024</span>
                                    </div>
                                    <Link href="#" className="text-primary hover:underline" prefetch={false}>
                                        Read More
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="bg-card rounded-lg overflow-hidden shadow-lg">
                            <img
                                src="/placeholder.svg"
                                alt="Collector's Corner: Vintage Cameras"
                                width="400"
                                height="300"
                                className="w-full aspect-[4/3] object-cover"
                            />
                            <div className="p-4">
                                <h3 className="text-lg font-semibold">Collector's Corner: Vintage Cameras</h3>
                                <p className="text-muted-foreground text-sm mt-1">
                                    Dive into the world of vintage camera collecting and restoration.
                                </p>
                                <div className="flex items-center justify-between mt-4">
                                    <div className="flex items-center gap-2">
                                        <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-muted-foreground text-sm">August 15, 2024</span>
                                    </div>
                                    <Link href="#" className="text-primary hover:underline" prefetch={false}>
                                        Read More
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="bg-card rounded-lg overflow-hidden shadow-lg">
                            <img
                                src="/placeholder.svg"
                                alt="Auction Industry Trends"
                                width="400"
                                height="300"
                                className="w-full aspect-[4/3] object-cover"
                            />
                            <div className="p-4">
                                <h3 className="text-lg font-semibold">Auction Industry Trends</h3>
                                <p className="text-muted-foreground text-sm mt-1">
                                    Exploring the latest developments and insights in the world of auctions.
                                </p>
                                <div className="flex items-center justify-between mt-4">
                                    <div className="flex items-center gap-2">
                                        <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-muted-foreground text-sm">September 1, 2024</span>
                                    </div>
                                    <Link href="#" className="text-primary hover:underline" prefetch={false}>
                                        Read More
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Upcomming
