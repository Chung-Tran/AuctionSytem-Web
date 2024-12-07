import { ClockIcon, EyeIcon } from 'lucide-react';
import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { countdown, formatCurrency, openNotify } from '../../commons/MethodsCommons';
import { AppContext } from '../../AppContext';
import RegistrationSteps from '../../pages/ProductDetail/RegistrationSteps';
import AuctionService from '../../services/AuctionService';
import productTemplate from '../../assets/productTemplate.jpg';
import { REGISTER_STATUS } from '../../commons/Constant';

const ProductItem = ({
  image,
  name,
  price,
  endsIn,
  slug,
  currentViews,
  productDescription,
  registeredUsers,
  registrationCloseDate
}) => {
  const { user, toggleLoginModal } = useContext(AppContext);
  const [isRegistrationModalVisible, setIsRegistrationModalVisible] = useState(false);
  const [auction, setAuction] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user)
      toggleLoginModal(true);
    else {
      const auctionData = await AuctionService.getDetail(slug);
      setAuction(auctionData);
      setIsRegistrationModalVisible(true)
    }
  };
  let registerStatus = null;
  if (registrationCloseDate && new Date() > new Date(registrationCloseDate)) {
    registerStatus = REGISTER_STATUS.EXPIRED;
  } else if (user && registeredUsers?.includes(user.userId)) {
    registerStatus = REGISTER_STATUS.REGISTERED;
  } else {
    registerStatus = REGISTER_STATUS.NOT_REGISTERED;
  }
  return (
    <>
      <div className="bg-card rounded-lg overflow-hidden shadow-lg h-full flex flex-col">
        <Link to={`/auctions/${slug}`}>
          <img
            src={image || productTemplate}
            alt="Product Image"
            width={600}
            height={400}
            className="w-full aspect-[3/2] object-cover"
          />
        </Link>
        <div className="p-4 h-full flex flex-col">
          <Link to={`/auctions/${slug}`}>
            <h3 className="text-lg font-semibold">{name}</h3>
          </Link>
          <p className="text-muted-foreground text-sm mt-1 line-clamp-2 mb-1	">
            {productDescription}
          </p>
          <div className="flex items-center justify-between mt-auto">
            <div>
              <span className="text-primary font-semibold text-lg">{formatCurrency(price)}</span>
              <span className="text-muted-foreground text-sm ml-2">Current Bid</span>
            </div>
            <div className="flex items-center gap-2">
              <ClockIcon className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground text-sm">{countdown(endsIn)}</span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              <EyeIcon className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground text-sm">{currentViews} watching</span>
            </div>
            <button
              size="sm"
              className={`bg-primary text-white p-2 rounded-md font-medium ${registerStatus === REGISTER_STATUS.REGISTERED || registerStatus === REGISTER_STATUS.EXPIRED ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleSubmit}
              disabled={registerStatus === REGISTER_STATUS.REGISTERED || registerStatus === REGISTER_STATUS.EXPIRED}
            >
              {registerStatus === REGISTER_STATUS.EXPIRED ? 'Registration Closed' :
                registerStatus === REGISTER_STATUS.REGISTERED ? 'Already Registered' :
                  'Place Bid'}
            </button>
          </div>
        </div>
      </div>
      {isRegistrationModalVisible && (
        <RegistrationSteps
          auction={auction}
          onClose={() => setIsRegistrationModalVisible(false)}
          userId={user.userId}
        />
      )}
    </>

  );
};

export default ProductItem;