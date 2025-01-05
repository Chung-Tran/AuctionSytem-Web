import React, { useEffect, useState, useMemo, useCallback, useContext } from 'react'
import Breadcrumb from '../../components/BreadCrumb/BreadCrumb'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import 'react-tabs/style/react-tabs.css'
import ProductItem from '../../components/Product/ProductItem'
import ImageGallery from "react-image-gallery"
import AuctionService from '../../services/AuctionService'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { formatCurrency, formatDate, openNotify } from '../../commons/MethodsCommons'
import LoadingSpinner from '../LoadingSpinner'
import RegistrationSteps from './RegistrationSteps';
import { AppContext } from '../../AppContext';
import productTemplate from '../../assets/productTemplate.jpg';
import { AUCTION_STATUS, PRODUCT_CATEGORY_DATASOURCE, PRODUCT_CONDITION_DATASOURCE, PRODUCT_TYPE_DATASOURCE, REGISTER_STATUS } from '../../commons/Constant'
import { message } from 'antd'
import { Helmet } from 'react-helmet'
import { ProductLanguage, relatedDocuments } from '../../languages/ProductLanguage'
import { Calendar } from 'lucide-react'

const ProductDetail = () => {
  const { slug } = useParams()
  const { user, toggleLoginModal, language } = useContext(AppContext)
  const [auction, setAuction] = useState(null)
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [auctionRelate, setAuctionRelate] = useState([]);
  const [isRegistrationModalVisible, setIsRegistrationModalVisible] = useState(false);
  const [registerStatus, setRegisterStatus] = useState(REGISTER_STATUS.NOT_ALLOW);
  const languageText = useMemo(() => ProductLanguage[language], [language]);
  const documents = useMemo(() => relatedDocuments[language], [language]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {

        const auctionData = await AuctionService.getDetail(slug);
        const auctionList = await AuctionService.getList({
          limit: 4,
          page: 1,
          status: AUCTION_STATUS.APPROVED
        });

        setAuction(auctionData);
        if (auctionData.registrationCloseDate && new Date() > new Date(auctionData.registrationCloseDate)) {
          setRegisterStatus(REGISTER_STATUS.EXPIRED);
        } else if (new Date() < new Date(auctionData?.registrationOpenDate)) {
          setRegisterStatus(REGISTER_STATUS.NOT_ALLOW);
        } else if (user && auctionData.registeredUsers?.includes(user.userId)) {
          setRegisterStatus(REGISTER_STATUS.REGISTERED);
        } else {
          setRegisterStatus(REGISTER_STATUS.NOT_REGISTERED);
        }
        setAuctionRelate(auctionList?.docs || [])
      } catch (error) {
        console.error('Error fetching auction data:', error)
      }
    }

    if (slug) {
      fetchData()
    }
  }, [slug])

  const calculateTimeLeft = useCallback((startTime) => {
    const now = new Date()
    const targetDate = new Date(startTime)
    const difference = targetDate - now;
    //reset button
    if (now < new Date(auction?.registrationOpenDate)) {
      setRegisterStatus(REGISTER_STATUS.NOT_ALLOW)
    } else if (now == new Date(auction?.registrationOpenDate)) {
      setRegisterStatus(REGISTER_STATUS.ALLOW)
    } else if (now > new Date(auction?.registrationCloseDate)) {
      setRegisterStatus(REGISTER_STATUS.EXPIRED)
    }

    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24))
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((difference % (1000 * 60)) / 1000)

      setTimeLeft({ days, hours, minutes, seconds })
    } else if (difference === 0) {
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      message('Phiên đấu giá đã bắt đầu');
      navigate('/auctions/ongoing'); // Điều hướng đến trang ongoing
    } else {
      openNotify('error', 'Không tìm thấy dữ liệu');
      navigate('/auctions/upcoming'); // Điều hướng đến trang upcoming
    }
  }, []);

  useEffect(() => {
    if (auction) {
      const interval = setInterval(() => calculateTimeLeft(auction.startTime), 1000)
      return () => clearInterval(interval)
    }
  }, [auction, calculateTimeLeft])

  const images = (!!auction?.productImages && auction?.productImages?.length > 0)
    ? auction?.productImages.map(item => ({
    original: item,
    thumbnail: item,
  })) : [productTemplate]

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
  if (new Date() == new Date()) {

  }
  const handleCallback = (callbackType, value) => {
    switch (callbackType) {
      case "RegisterSuccess":
        setRegisterStatus(REGISTER_STATUS.REGISTERED)
        break;

      default:
        break;
    }
  }
  console.log(auction)
  return !!auction && (
    <div>
      <Helmet>
        <title>{auction ? auction.title : 'Auction detail'}</title>
        <meta property="og:title" content={auction ? auction.title : 'Auction detail'} />
        <meta property="og:description" content={auction ? auction.title : 'Auction detail'} />
      </Helmet>

      <Breadcrumb
        items={[
          { label: languageText.home, href: "/" },
          { label: languageText.productDetail, href: null },
        ]}
        title={languageText.pageTitle}
      />

      <section className="px-6">
        <div className="grid md:grid-cols-2 gap-6 lg:gap-6 items-start container px-4 mx-auto py-6 flex-1">
          <div className="grid gap-4 md:gap-10 items-start h-[90vh] relative image-gallery-wrapper">
            <ImageGallery
              items={images}
              showNav={false}
              showPlayButton={false}
            />
          </div>

          <div className="grid gap-4 md:gap-10 items-start">
            <div className="grid gap-2">
              <h3 className="text-muted-foreground text-base">{languageText.countdownTitle}</h3>
              <div className="border border-[#E6E6E6] p-[15px] shadow-md">
                <div className="mb-2.5">
                  <div id="timestamp" className="flex justify-around">
                    <div id="day-div-count ">
                      <p id="days" className="timecount-style mb-0 text-center font-semibold text-xl">
                        {String(timeLeft.days).padStart(2, '0')}
                      </p>
                      <p className="time-description mb-0 text-center uppercase text-sm">Ngày</p>
                    </div>
                    <div>
                      <p id="hours" className="timecount-style mb-0 text-center font-semibold text-xl">
                        {String(timeLeft.hours).padStart(2, '0')}
                      </p>
                      <p className="time-description mb-0 text-center uppercase text-sm">Giờ</p>
                    </div>
                    <div>
                      <p id="minutes" className="timecount-style mb-0 text-center font-semibold text-xl">
                        {String(timeLeft.minutes).padStart(2, '0')}
                      </p>
                      <p className="time-description mb-0 text-center uppercase text-sm">Phút</p>
                    </div>
                    <div>
                      <p id="seconds" className="timecount-style mb-0 text-center font-semibold text-xl">
                        {String(timeLeft.seconds).padStart(2, '0')}
                      </p>
                      <p className="time-description mb-0 text-center uppercase text-sm">Giây</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-[#E6E6E6] p-[15px] grid gap-6 rounded py-8">
              <div className="">
                <div className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">{languageText.startingBid}</span>
                    <div className="text-primary font-bold text-2xl">{formatCurrency(auction.startingPrice)}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">{languageText.assetId}</span>
                    <div className="font-semibold">{auction._id}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">{languageText.registrationOpen}</span>
                    <div className="font-semibold">{formatDate(auction.registrationOpenDate)}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">{languageText.registrationClose}</span>
                    <div className="font-semibold">{formatDate(auction.registrationCloseDate)}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">{languageText.auctionStart}</span>
                    <div className="font-semibold">{formatDate(auction.startTime)}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">{languageText.auctionEnd}</span>
                    <div className="font-semibold">{formatDate(auction.endTime)}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">{languageText.registrationFee}</span>
                    <div className="font-semibold">{formatCurrency(auction.registrationFee)}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">{languageText.bidIncrement}</span>
                    <div className="font-semibold">{formatCurrency(auction.bidIncrement)}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">{languageText.deposit}</span>
                    <div className="font-semibold">{formatCurrency(auction.deposit)}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">{languageText.auctionType}</span>
                    <div className="font-semibold">Online</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">{languageText.assetOwner}</span>
                    <div className="font-semibold">{auction.sellerName}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">{languageText.assetViewingLocation}</span>
                    <div className="font-semibold">{auction.productAddress}</div>
                  </div>
                </div>
              </div>

              <button
                size="lg"
                className={`w-full inline-flex items-center justify-center whitespace-nowrap text-sm font-medium
                              ${registerStatus === REGISTER_STATUS.EXPIRED || registerStatus == REGISTER_STATUS.NOT_ALLOW ? 'bg-gray-400 cursor-not-allowed' :
                    registerStatus === REGISTER_STATUS.REGISTERED ? 'bg-green-500 cursor-not-allowed' :
                      'bg-primary'}
                              h-11 rounded-md px-8 text-white`}
                onClick={handleRegister}
                disabled={registerStatus === REGISTER_STATUS.EXPIRED
                  || registerStatus === REGISTER_STATUS.REGISTERED
                  || registerStatus == REGISTER_STATUS.NOT_ALLOW}
              >
                {registerStatus === REGISTER_STATUS.REGISTERED ? languageText.alreadyRegistered :
                  registerStatus === REGISTER_STATUS.EXPIRED ? languageText.registrationExpired :
                    languageText.registerForAuction}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 mt-10 mb-4">
        <div className="container w-full mx-auto mt-8">
          <Tabs>
            <TabList className="flex space-x-4">
              <Tab selectedClassName="bg-primary text-white" className="px-4 py-2 border rounded cursor-pointer">{languageText.productDescription}</Tab>
              <Tab selectedClassName="bg-primary text-white" className="px-4 py-2 border rounded cursor-pointer">{languageText.auctionOrganization}</Tab>
              <Tab selectedClassName="bg-primary text-white" className="px-4 py-2 border rounded cursor-pointer">{languageText.relatedDocuments}</Tab>
            </TabList>

            <TabPanel>
              <div className="p-4 border mt-4">
                <h2>{languageText.assetDescription}</h2>
                <p>{languageText.productName}: {auction.productName}</p>
                <p>{languageText.productAddress}: {auction.productAddress}</p>
                <p>{languageText.productCondition}: {PRODUCT_CONDITION_DATASOURCE[language]?.find(item => item.value === auction.productCondition)?.label || ""}</p>
                <p>{languageText.productCategory}: {PRODUCT_CATEGORY_DATASOURCE[language]?.find(item => item.value === auction.productCategory)?.label || ""}</p>
                <p>{languageText.productType}: {PRODUCT_TYPE_DATASOURCE[language]?.find(item => item.value === auction.productType)?.label || ""}</p>
                <p>{languageText.productDescription}: {auction.productDescription}</p>
              </div>
            </TabPanel>

            <TabPanel>
              <div className="p-4 border mt-4">
                <h2 className="text-lg font-bold">{language === "vi" ? "Tổ chức đấu giá" : "Auction Organization"}</h2>

                {/* Thông tin công ty */}
                <div className="mb-6">
                  <h3 className="font-bold text-primary">{language === "vi" ? "Thông tin công ty" : "Company Information"}</h3>
                  <p>{language === "vi" ? "Tên công ty:" : "Company Name:"} AuctionHouse</p>
                  <p>{language === "vi" ? "Địa chỉ:" : "Address:"} Số 1 Lê Văn Việt, Thủ Đức, Hồ Chí Minh</p>
                  <p>{language === "vi" ? "Liên hệ:" : "Contact:"} 028-1234-5678 | support@auctionhouse.vn</p>
                  <p>{language === "vi" ? "Thời gian hoạt động:" : "Operating Hours:"} 08:00 - 18:00 (Mon-Fri), 08:00 - 12:00 (Sat)</p>
                </div>

                {/* Đội ngũ tổ chức */}
                <div className="mb-6">
                  <h3 className="font-bold text-primary">{language === "vi" ? "Đội ngũ tổ chức" : "Auction Team"}</h3>
                  <p>{language === "vi" ? "Trưởng nhóm:" : "Team Leader:"} Mr. John D. ({language === "vi" ? "Kinh nghiệm" : "Experience"}: 10 năm)</p>
                  <ul className="list-disc pl-5">
                    <li>{language === "vi" ? "Chuyên viên tư vấn hỗ trợ khách hàng" : "Consultants assisting clients"}</li>
                    <li>{language === "vi" ? "Kỹ thuật viên IT đảm bảo hệ thống" : "IT Technicians ensuring system stability"}</li>
                    <li>{language === "vi" ? "Tư vấn pháp lý xử lý tranh chấp" : "Legal advisors for dispute resolution"}</li>
                  </ul>
                </div>

                {/* Quy trình đấu giá */}
                <div className="mb-6">
                  <h3 className="font-bold text-primary">{language === "vi" ? "Quy trình đấu giá" : "Auction Process"}</h3>
                  <ol className="list-decimal pl-5">
                    <li>{language === "vi" ? "Chuẩn bị hồ sơ và thông báo lịch đấu giá" : "Prepare documents and announce auction schedule"}</li>
                    <li>{language === "vi" ? "Người tham gia nộp đặt cọc và nhận mã số" : "Participants submit deposit and receive ID"}</li>
                    <li>{language === "vi" ? "Tiến hành đấu giá theo thời gian thực" : "Conduct real-time auction session"}</li>
                    <li>{language === "vi" ? "Công bố người thắng cuộc và hướng dẫn thanh toán" : "Announce winner and guide payment"}</li>
                    <li>{language === "vi" ? "Bàn giao tài sản và giấy tờ" : "Deliver asset and documents"}</li>
                  </ol>
                </div>

                {/* Pháp lý */}
                <div className="mb-6">
                  <h3 className="font-bold text-primary">{language === "vi" ? "Thông tin pháp lý" : "Legal Information"}</h3>
                  <p>{language === "vi" ? "Giấy phép hoạt động:" : "License:"} 1234/GP-ĐG</p>
                  <p>{language === "vi" ? "Đơn vị cấp phép:" : "Issuer:"} Hiệp hội Đấu giá Tài sản Việt Nam</p>
                </div>

                {/* Hỗ trợ khách hàng */}
                <div>
                  <h3 className="font-bold text-primary">{language === "vi" ? "Hỗ trợ khách hàng" : "Customer Support"}</h3>
                  <p>{language === "vi" ? "Hotline:" : "Hotline:"} 1900-1234</p>
                  <p>{language === "vi" ? "Email:" : "Email:"} customer.service@auctionhouse.vn</p>
                  <p>{language === "vi" ? "Thời gian xử lý khiếu nại tối đa: 5 ngày làm việc" : "Max complaint resolution time: 5 working days"}</p>
                </div>
              </div>
            </TabPanel>

            <TabPanel>
              <div className="p-4 border mt-4">
                <h2>{language === "vi" ? "Tài liệu liên quan" : "Related Documents"}</h2>
                {documents.map((doc, index) => (
                  <div key={index} className="mb-6">
                    <h3 className="font-bold text-lg text-primary">{doc.title}</h3>
                    <p>{doc.content}</p>
                  </div>
                ))}
              </div>
            </TabPanel>
          </Tabs>
        </div>
      </section>

      <section className="py-12 mt-10 px-6">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold mb-4">{languageText.productsRelate}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {auctionRelate?.length > 0 && auctionRelate.map((product, index) => (
              <ProductItem
                key={product.id}
                image={product?.productImages[0] ?? null}
                name={product.productName}
                slug={product.slug}
                productDescription={product.productDescription}
                price={product.startingPrice}
                currentViews={product.viewCount || 0}
                endsIn={product.startTime || new Date(Date.now() + 24 * 60 * 60 * 1000)} //Thời gian còn lại để đăng ký
                registeredUsers={product?.registeredUsers?.map(item => item?.customer).filter(Boolean) || []}
                registrationCloseDate={product.registrationCloseDate}
                registrationOpenDate={product.registrationOpenDate}
                language={language}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 mt-10 px-6">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold">{languageText.relatedAssets}</h2>
          <div className="grid sm:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
            {[
              {
                title: "Auction Industry Trends",
                description: "Exploring the latest developments and insights in the world of auctions.",
                date: "September 1, 2024",
                href: "/auction-trends",
                image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5mPgF1lStvLtPNxk1PGC5wZ9QT4SkOiGwTw&s",
              },
              {
                title: "Bidding Strategies for Success",
                description: "Learn effective bidding tactics to improve your chances of winning auctions.",
                date: "October 15, 2024",
                href: "/bidding-strategies",
                image: "https://propscience.s3.ap-south-1.amazonaws.com/backoffice_blogs/master_stories_auction%201.jpg"
              },
              {
                title: "Top Auction Categories of 2024",
                description: "Discover the most popular auction categories and what’s driving their demand.",
                date: "November 5, 2024",
                href: "/top-categories-2024",
                image: "https://jaro-website.s3.ap-south-1.amazonaws.com/2024/04/Common-Auction-Types.jpg"
              },
              {
                title: "How to Spot Rare Collectibles",
                description: "Tips and tricks to identify valuable and rare items in auctions.",
                date: "December 10, 2024",
                href: "/spot-rare-collectibles",
                image: "https://fastercapital.com/i/Betting-on-Favorites--How-Tips-Spread-Can-Help-You-Win--Understanding-the-Role-of-Tips-Spread-in-Betting-on-Favorites.webp"
              },
            ].map((item, index) => (
              <div key={index} className="bg-card rounded-lg overflow-hidden shadow-lg">
                <img
                  src={item.image}
                  alt={item.title}
                  width="400"
                  height="300"
                  className="w-full aspect-[4/3] object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-muted-foreground text-sm mt-1">{item.description}</p>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground text-sm">{item.date}</span>
                    </div>
                    <Link href={item.href} className="text-primary hover:underline" prefetch={false}>
                      Read More
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Form Modal */}
      {isRegistrationModalVisible && (
        <RegistrationSteps
          auction={auction}
          onClose={() => setIsRegistrationModalVisible(false)}
          userId={user.userId}
          callback={handleCallback}
        />
      )}
    </div>
  );
}

export default React.memo(ProductDetail)