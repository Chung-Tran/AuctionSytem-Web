import React from 'react'
import Breadcrumb from '../../components/BreadCrumb/BreadCrumb'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import ProductItem from '../../components/Product/ProductItem';
import logo from '../../assets/logo192.png';
import ImageGallery from "react-image-gallery";
const ProductDetail = () => {
    const products = [
        { id: 1, name: "Antique Pocket Watch", price: 1250, endsIn: "3 days", image: logo },
        { id: 2, name: "Vintage Typewriter", price: 450, endsIn: "1 day", image: logo },
        { id: 3, name: "Rare Porcelain Vase", price: 3800, endsIn: "5 days", image: logo },
        { id: 4, name: "Vintage Rolex Watch", price: 12500, endsIn: "2 days", image: logo },
    ];
    const images = [
        {
          original: "https://picsum.photos/id/1018/1000/600/",
          thumbnail: "https://picsum.photos/id/1018/250/150/",
        },
        {
          original: "https://picsum.photos/id/1015/1000/600/",
          thumbnail: "https://picsum.photos/id/1015/250/150/",
        },
        {
          original: "https://picsum.photos/id/1019/1000/600/",
          thumbnail: "https://picsum.photos/id/1019/250/150/",
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
            <section className='px-6'>
                <div className="grid md:grid-cols-2 gap-6 lg:gap-6 items-start container px-4 mx-auto py-6 flex-1">
                    <div className="grid gap-4 md:gap-10 items-start h-[90vh] relative image-gallery-wrapper">
                        <ImageGallery
                            items={images}
                            showNav={false}
                            showPlayButton={false}
                        />
                    </div>
                    <div className="grid gap-4 md:gap-10 items-start">
                        <div className='grid gap-2'>
                            <h3 className='text-muted-foreground text-base'>Countdown time starts returning:</h3>
                            <div className='border border-[#E6E6E6] p-[15px] shadow-md'>
                                <div class="mb-2.5">
                                    <div id="timestamp" class="flex justify-around">
                                        <div id="day-div-count ">
                                            <p id="days" class="timecount-style mb-0 text-center font-semibold text-xl ">09</p>
                                            <p class="time-description mb-0 text-center uppercase text-sm">Ngày</p>
                                        </div>
                                        <div>
                                            <p id="hours" class="timecount-style mb-0 text-center font-semibold text-xl ">10</p>
                                            <p class="time-description mb-0 text-center uppercase text-sm">Giờ</p>
                                        </div>
                                        <div>
                                            <p id="minutes" class="timecount-style mb-0 text-center font-semibold text-xl ">00</p>
                                            <p class="time-description mb-0 text-center uppercase text-sm">Phút</p>
                                        </div>
                                        <div>
                                            <p id="seconds" class="timecount-style mb-0 text-center font-semibold text-xl ">21</p>
                                            <p class="time-description mb-0 text-center uppercase text-sm">Giây</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='border border-[#E6E6E6] p-[15px] grid gap-6 rounded py-8'>
                            <div className="">
                                <div className="grid gap-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Starting Bid:</span>
                                        <div className="text-primary font-bold text-2xl">$99.99</div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Asset ID:</span>
                                        <div className=' font-semibold'>ABC123</div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Registration Open:</span>
                                        <div className=' font-semibold'>2024-09-01 00:00</div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Registration Close:</span>
                                        <div className=' font-semibold'>2024-09-15 23:59</div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Registration Fee:</span>
                                        <div className=' font-semibold'>$10.00</div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Bid Increment:</span>
                                        <div className=' font-semibold'>$1.00</div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Max Bid Increments:</span>
                                        <div className=' font-semibold'>20</div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Deposit:</span>
                                        <div className=' font-semibold'>$50.00</div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Auction Type:</span>
                                        <div className=' font-semibold'>Online</div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Asset Owner:</span>
                                        <div className=' font-semibold'>ABC Company</div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Asset Viewing Location:</span>
                                        <div className=' font-semibold'>123 ABC Street, XYZ District, City</div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Auction Start:</span>
                                        <div className=' font-semibold'>2024-09-16 09:00</div>
                                    </div>
                                </div>
                            </div>
                            <button size="lg" className='w-full inline-flex items-center justify-center whitespace-nowrap text-sm font-medium bg-primary h-11 rounded-md px-8 text-white'>Register for Auction</button>
                        </div>

                    </div>
                </div>
            </section>

            <section className='px-6 mt-10 mb-4'>
                <div className=" container w-full mx-auto mt-8">
                    <Tabs>
                        <TabList className="flex space-x-4">
                            <Tab selectedClassName="bg-primary text-white" className="px-4 py-2 border rounded cursor-pointer">Mô tả tài sản</Tab>
                            <Tab selectedClassName="bg-primary text-white" className="px-4 py-2 border rounded cursor-pointer">Thông tin đấu giá</Tab>
                            <Tab selectedClassName="bg-primary text-white" className="px-4 py-2 border rounded cursor-pointer">Tài liệu liên quan</Tab>
                        </TabList>

                        <TabPanel>
                            <div className="p-4 border mt-4">
                                <h2>Mô tả tài sản</h2>
                                <p>Đây là nội dung mô tả tài sản.</p>
                            </div>
                        </TabPanel>
                        <TabPanel>
                            <div className="p-4 border mt-4">
                                <h2 className="text-lg font-bold">Thông tin tổ chức đấu giá</h2>
                                <p><span className="font-bold">Tổ chức đấu giá tài sản:</span> <span className="text-red-600">Công ty đấu giá hợp danh Lạc Việt</span></p>
                                <p><span className="font-bold">Đấu giá viên:</span> <span className="text-red-600">Nguyễn Thùy Giang</span></p>
                                <p><span className="font-bold">Địa chỉ:</span> Số 49 Văn Cao, phường Liễu Giai, quận Ba Đình, TP. Hà Nội.</p>
                            </div>
                        </TabPanel>
                        <TabPanel>
                            <div className="p-4 border mt-4">
                                <h2>Tài liệu liên quan</h2>
                                <p>Đây là nội dung tài liệu liên quan.</p>
                            </div>
                        </TabPanel>
                    </Tabs>
                </div>
            </section>

            <section className=" py-12 mt-10 px-6">
                <div className='container mx-auto'>
                    <h2 className="text-2xl font-bold mb-4">Latest News</h2>
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
                </div>
            </section>
        </div>
    )
}

export default ProductDetail
