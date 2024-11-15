import { ClockIcon, EyeIcon } from 'lucide-react';
import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { countdown, formatCurrency, openNotify } from '../../commons/MethodsCommons';
import { AppContext } from '../../AppContext';
import RegistrationSteps from '../../pages/ProductDetail/RegistrationSteps';
import AuctionService from '../../services/AuctionService';
import productTemplate from '../../assets/productTemplate.jpg'
const ProductItem = ({ image, name, price, endsIn, slug, currentViews }) => {
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

  return (
    <>
      <div className="bg-card rounded-lg overflow-hidden shadow-lg">
        <Link to={`/auctions/${slug}`}>
          <img
            src={image || productTemplate}
            alt="Product Image"
            width={600}
            height={400}
            className="w-full aspect-[3/2] object-cover"
          />
        </Link>
        <div className="p-4">
          <Link to={`/auctions/${slug}`}>
            <h3 className="text-lg font-semibold">{name}</h3>
          </Link>
          <p className="text-muted-foreground text-sm mt-1">
            Fully restored 1950s typewriter in excellent condition.
          </p>
          <div className="flex items-center justify-between mt-4">
            <div>
              <span className="text-primary font-semibold text-lg">{formatCurrency(price)}</span>
              <span className="text-muted-foreground text-sm ml-2">Current Bid</span>
            </div>
            <div className="flex items-center gap-2">
              <ClockIcon className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground text-sm">{countdown(endsIn)}</span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <EyeIcon className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground text-sm">{currentViews} watching</span>
            </div>
            <button size="sm" className="bg-primary text-white p-2 rounded-md font-medium" onClick={handleSubmit}>Place Bid</button>
          </div>
        </div>
      </div>
      {isRegistrationModalVisible && (
        <RegistrationSteps
          auction={auction}
          onClose={() => setIsRegistrationModalVisible(false)}
        />
      )}
    </>

  );
};

export default ProductItem;