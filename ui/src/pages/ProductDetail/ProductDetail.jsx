import React, { useEffect, useState, useMemo, useCallback, useContext } from 'react'
import Breadcrumb from '../../components/BreadCrumb/BreadCrumb'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import 'react-tabs/style/react-tabs.css'
import ProductItem from '../../components/Product/ProductItem'
import ImageGallery from "react-image-gallery"
import AuctionService from '../../services/AuctionService'
import { useParams } from 'react-router-dom'
import { formatCurrency, formatDate } from '../../commons/MethodsCommons'
import LoadingSpinner from '../LoadingSpinner'
import RegistrationSteps from './RegistrationSteps';
import { AppContext } from '../../AppContext';
import productTemplate from '../../assets/productTemplate.jpg';
const REGISTER_STATUS = {
    NOT_REGISTERED: 1,//User chưa đăng ký
    REGISTERED: 2, //Đã nằm trong list đăng ký
    EXPIRED: 3, //Quá hạn cho phép đăng ký
}
const ProductDetail = () => {
    const { slug } = useParams()
    const { user, toggleLoginModal } = useContext(AppContext)
    const [auction, setAuction] = useState(null)
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
    const [auctionRelate, setAuctionRelate] = useState([]);
    const [isRegistrationModalVisible, setIsRegistrationModalVisible] = useState(false);
    const [registerStatus, setRegisterStatus] = useState(REGISTER_STATUS.ALLOW)
    useEffect(() => {
        const fetchData = async () => {
            try {
                
                const auctionData = await AuctionService.getDetail(slug);
                const auctionList = await AuctionService.getList({
                    limit: 4,
                    page: 1,
                    // status:'active'
                });

                setAuction(auctionData);
                if (auctionData.registrationOpenDate && new Date() > new Date(auctionData.registrationOpenDate)) {
                    setRegisterStatus(REGISTER_STATUS.EXPIRED);
                } else if (user && auctionData.registeredUsers?.includes(user.userId)) {
                    setRegisterStatus(REGISTER_STATUS.REGISTERED);
                } else {
                    setRegisterStatus(REGISTER_STATUS.NOT_REGISTERED);
                }
                setAuctionRelate(auctionList)
            } catch (error) {
                console.error('Error fetching auction data:', error)
            }
        }

        if (slug) {
            fetchData()
        }
    }, [slug])

    const calculateTimeLeft = useCallback((targetDate) => {
        const now = new Date()
        const difference = targetDate - now

        if (difference > 0) {
            const days = Math.floor(difference / (1000 * 60 * 60 * 24))
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
            const seconds = Math.floor((difference % (1000 * 60)) / 1000)

            setTimeLeft({ days, hours, minutes, seconds })
        } else {
            setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        }
    }, []);

    useEffect(() => {
        if (auction) {
            const fakeTime = new Date('2024-10-08T14:00:00')
            const interval = setInterval(() => calculateTimeLeft(fakeTime), 1000)
            return () => clearInterval(interval)
        }
    }, [auction, calculateTimeLeft])

    const images = auction?.productImages.map(item => ({
        original: item,
        thumbnail: item,
    })) || [productTemplate]

    if (!auction) {
        return <LoadingSpinner />
    }
    const handleRegister = () => {
        if (!user)
            toggleLoginModal(true);
        else {
            setIsRegistrationModalVisible(true)
        }
    }
    return !!auction && (
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
                                <div className="mb-2.5">
                                    <div id="timestamp" className="flex justify-around">
                                        <div id="day-div-count ">
                                            <p id="days" className="timecount-style mb-0 text-center font-semibold text-xl">{String(timeLeft.days).padStart(2, '0')}</p>
                                            <p className="time-description mb-0 text-center uppercase text-sm">Ngày</p>
                                        </div>
                                        <div>
                                            <p id="hours" className="timecount-style mb-0 text-center font-semibold text-xl">{String(timeLeft.hours).padStart(2, '0')}</p>
                                            <p className="time-description mb-0 text-center uppercase text-sm">Giờ</p>
                                        </div>
                                        <div>
                                            <p id="minutes" className="timecount-style mb-0 text-center font-semibold text-xl">{String(timeLeft.minutes).padStart(2, '0')}</p>
                                            <p className="time-description mb-0 text-center uppercase text-sm">Phút</p>
                                        </div>
                                        <div>
                                            <p id="seconds" className="timecount-style mb-0 text-center font-semibold text-xl">{String(timeLeft.seconds).padStart(2, '0')}</p>
                                            <p className="time-description mb-0 text-center uppercase text-sm">Giây</p>
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
                                        <div className="text-primary font-bold text-2xl">{formatCurrency(auction.startingPrice)}</div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Asset ID:</span>
                                        <div className=' font-semibold'>{auction._id}</div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Registration Open:</span>
                                        <div className=' font-semibold'>{formatDate(auction.registrationOpenDate)}</div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Registration Close:</span>
                                        <div className=' font-semibold'>{formatDate(auction.registrationCloseDate)}</div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Registration Fee:</span>
                                        <div className=' font-semibold'>{formatCurrency(auction.registrationFee)}</div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Bid Increment:</span>
                                        <div className=' font-semibold'>{formatCurrency(auction.bidIncrement)}</div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Max Bid Increments:</span>
                                        <div className=' font-semibold'>20</div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Deposit:</span>
                                        <div className=' font-semibold'>{formatCurrency(auction.deposit)}</div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Auction Type:</span>
                                        <div className=' font-semibold'>Online</div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Asset Owner:</span>
                                        <div className=' font-semibold'>{auction.sellerName}</div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Asset Viewing Location:</span>
                                        <div className=' font-semibold'>{auction.productAddress}</div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Auction Start:</span>
                                        <div className=' font-semibold'>{formatDate(auction.startTime)}</div>
                                    </div>
                                </div>
                            </div>
                            <button
                                size="lg"
                                className={`w-full inline-flex items-center justify-center whitespace-nowrap text-sm font-medium 
                                ${registerStatus === REGISTER_STATUS.EXPIRED ? 'bg-gray-400 cursor-not-allowed' :
                                        registerStatus === REGISTER_STATUS.REGISTERED ? 'bg-green-500 cursor-not-allowed' :
                                            'bg-primary'} 
        h-11 rounded-md px-8 text-white`}
                                onClick={handleRegister}
                                disabled={registerStatus === REGISTER_STATUS.EXPIRED || registerStatus === REGISTER_STATUS.REGISTERED}
                            >
                                {registerStatus === REGISTER_STATUS.EXPIRED ? 'Registration Expired' :
                                    registerStatus === REGISTER_STATUS.REGISTERED ? 'Already Registered' :
                                        'Register for Auction'}
                            </button>
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
                                <p>Tên sản phẩm: {auction.productName}</p>
                                <p>Tình trạng sản phẩm: {auction.condition}</p>
                                <p>Mô tả sản phẩm: {auction.productDescription}</p>
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
                        {auctionRelate?.length > 0 && auctionRelate.map((product, index) =>
                        (<ProductItem
                            key={product.id}
                            image={product.image}
                            name={product.productName}
                            slug={product.slug}
                            price={product.startingPrice}
                            currentViews={product.currentViews || 1}
                            endsIn={product.registrationOpenDate || new Date(Date.now() + 24 * 60 * 60 * 1000)} //Thời gian còn lại để đăng ký
                        />
                        )
                        )}
                    </div>
                </div>
            </section>
            {/* register form */}
            {isRegistrationModalVisible && (
                <RegistrationSteps
                    auction={auction}
                    onClose={() => setIsRegistrationModalVisible(false)}
                />
            )}
        </div>
    )
}

export default React.memo(ProductDetail)