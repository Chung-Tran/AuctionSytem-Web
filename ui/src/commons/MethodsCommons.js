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

export {
    openNotify,
  handleResponse,
  handleResponseError
}