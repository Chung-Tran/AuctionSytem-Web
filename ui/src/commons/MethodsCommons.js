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
const handleResponse = async (response) => {
  if (response.status >= 200 && response.status < 300 && response.data.success === true) {
      return response?.data?.data; 
  } else {
      openNotify('error', response?.data?.message || 'An error occurred'); 
      return null;
  }
};
//Show notify error from api
const handleResponseError = async (error) => {
  if (error.response) {
      // Lỗi từ server với status code
      const { status, data } = error.response;
      
      if (status === 400) {
          // Xử lý lỗi 400 Bad Request
          const errorMessage = data.message || 'Bad Request';
          openNotify('error', errorMessage);
      } else if (status === 401) {
          // Xử lý lỗi 401 Unauthorized
          openNotify('error', 'Unauthorized access. Please log in again.');
      } else if (status === 403) {
          // Xử lý lỗi 403 Forbidden
          openNotify('error', 'You do not have permission to perform this action.');
      } else if (status === 404) {
          // Xử lý lỗi 404 Not Found
          openNotify('error', 'The requested resource was not found.');
      } else if (status === 500) {
          // Xử lý lỗi 500 Internal Server Error
          openNotify('error', 'An internal server error occurred. Please try again later.');
      } else {
          // Xử lý các lỗi khác
          openNotify('error', data.message || 'An error occurred');
      }
  } else if (error.request) {
      // Yêu cầu được gửi nhưng không nhận được phản hồi
      openNotify('error', 'No response received from the server. Please check your network connection.');
  } else {
      // Có lỗi khi thiết lập yêu cầu
      openNotify('error', error.message || 'An error occurred.');
  }

};

const formatCurrency = (value) => {
  if (!value)
    value = 123456;
  return new Intl.NumberFormat('vi-VN', { 
    style: 'currency', 
    currency: 'VND',
    minimumFractionDigits: 0, // Không hiển thị chữ số thập phân nếu không cần
    maximumFractionDigits: 0
  }).format(value);
};
 
const countdown = (targetDate) => {
  if (!targetDate)
    targetDate = new Date();
  const now = Date.now();
  const timeRemaining = targetDate - now;

  if (timeRemaining <= 0) return "0d 0h 0m"; // Nếu hết thời gian

  const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));

  return `${days}d ${hours}h ${minutes}m`;
}

function formatDate(date) {
  if (!date)
    date = new Date();
  const pad = (num) => num < 10 ? '0' + num : num;

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1); // getMonth() trả về 0-11, nên cần +1
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

export {
    openNotify,
  handleResponse,
  handleResponseError,
  formatCurrency,
  countdown,
  formatDate
}