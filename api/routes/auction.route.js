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
    getAuctionComfirmInfo,
} = require('../controllers/auction.controller');
const { verifyAccessToken } = require('../middlewares/Authentication');
const handleUpload = require('../utils/uploadImages');


router.post('/register', verifyAccessToken,handleUpload, registerAuctionProduct);

router.put('/approve/:auctionId/:userId', approveAuction); 
router.put('/reject/:auctionId/:userId', rejectAuction);
router.put('/update/:auctionId/:userId', updateAuction);
router.put('/end/:auctionId/:userId', endAuction);
router.delete('/kickCustomer/:auctionId/:customerId/:userId', kickCustomerOutOfAuction);
router.get('/comfirmation', verifyAccessToken, getAuctionComfirmInfo);

//get cho client
router.get('/outstanding', getAuctionOutstanding); 
router.get('/ongoing', ongoingList); 
router.get('/check-valid-access',verifyAccessToken, checkValidAccess); 
router.get('/:auctionSlug', getAuctionDetails);
router.get('/', listAuctions);
module.exports = router;