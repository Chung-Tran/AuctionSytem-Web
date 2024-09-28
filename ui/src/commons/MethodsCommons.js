import { toast } from 'react-hot-toast';

const openNotify = (type, message) => {
  if (type === 'success') {
    toast.success(message, {
      position: 'top-right',
      duration: 3000,
    });
  } else if (type === 'error') {
    toast.error(message, {
      position: 'top-right',
      duration: 3000,
    });
  } else {
    toast(message, {
      position: 'top-right',
      duration: 3000,
    });
  }
};

export {
    openNotify,
    
}