import { ClockIcon, EyeIcon } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';
import { openNotify } from '../../commons/MethodsCommons';

const ProductItem = ({ image, name, price, endsIn, slug }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const isValid = true; // Đây là giá trị giả định
    if (isValid) {
      openNotify('success', "Form submitted successfully!");
    } else {
      openNotify('error', "There was an error submitting the form.");
    }
  };
  return (
    <div className="bg-card rounded-lg overflow-hidden shadow-lg">
      <Link to={`/products/${slug}`}>
      <img
        src="/placeholder.svg"
        alt="Product Image"
        width={600}
        height={400}
        className="w-full aspect-[3/2] object-cover"
        />
      </Link>
      <div className="p-4">
        <Link to={`/products/${slug}`}>
        <h3 className="text-lg font-semibold">Vintage Typewriter</h3>
        </Link>
        <p className="text-muted-foreground text-sm mt-1">
          Fully restored 1950s typewriter in excellent condition.
        </p>
        <div className="flex items-center justify-between mt-4">
          <div>
            <span className="text-primary font-semibold text-lg">$150</span>
            <span className="text-muted-foreground text-sm ml-2">Current Bid</span>
          </div>
          <div className="flex items-center gap-2">
            <ClockIcon className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground text-sm">2d 12h 34m</span>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <EyeIcon className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground text-sm">24 watching</span>
          </div>
          <button size="sm" className="bg-primary text-white p-2 rounded-md font-medium" onClick={handleSubmit}>Place Bid</button>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;