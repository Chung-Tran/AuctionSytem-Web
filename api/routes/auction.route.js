const express = require('express');
const router = express.Router();

const {
    registerAuctionProduct,
    approveAuction,
    rejectAuction,
    getAuctionDetails,
    listAuctions,
    getAuctionOutstanding,
    ongoingList,
    checkValidAccess,
} = require('../controllers/auction.controller');
const { verifyAccessToken } = require('../middlewares/Authentication');


router.post('/register', verifyAccessToken, registerAuctionProduct);

router.put('/approve/:auctionId', approveAuction); 
router.put('/reject/:auctionId', rejectAuction);

//get cho client
router.get('/outstanding', getAuctionOutstanding); 
router.get('/ongoing', ongoingList); 
router.get('/check-valid-access',verifyAccessToken, checkValidAccess); 
router.get('/:auctionSlug', getAuctionDetails);
router.get('/', listAuctions);
module.exports = router;