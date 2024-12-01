const express = require('express');
const router = express.Router();

const {
    registerAuctionProduct,
    approveAuction,
    rejectAuction,
    updateAuction,
    endAuction,
    kickCustomerOutOfAuction,
    getAuctionDetails,
    listAuctions,
    getAuctionOutstanding,
    ongoingList,
    checkValidAccess,
} = require('../controllers/auction.controller');
const { verifyAccessToken } = require('../middlewares/Authentication');
const handleUpload = require('../utils/uploadImages');


router.post('/register', verifyAccessToken,handleUpload, registerAuctionProduct);

router.put('/approve/:auctionId', approveAuction); 
router.put('/reject/:auctionId', rejectAuction);
router.put('/update/:auctionId', updateAuction);
router.put('/end/:auctionId', endAuction);
router.delete('/kickCustomer/:auctionId/:customerId', kickCustomerOutOfAuction);

//get cho client
router.get('/outstanding', getAuctionOutstanding); 
router.get('/ongoing', ongoingList); 
router.get('/check-valid-access',verifyAccessToken, checkValidAccess); 
router.get('/:auctionSlug', getAuctionDetails);
router.get('/', listAuctions);
module.exports = router;