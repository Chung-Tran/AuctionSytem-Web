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
        <div className='container relative mx-auto px-4'>
            <div className='w-full min-h-[90vh] h-auto flex justify-center'>
                <Banner />
            </div>
            <section className="py-12 ">
                <div className=" mx-auto px-4">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold">Live Auctions</h2>
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
        </div>
    )
}

export default Home
