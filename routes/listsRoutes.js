const express = require('express');
const router = express.Router();
const {
	getListById,
	createListCategory,
	addNewListType,
	addComicToListId,
} = require('../controllers/listsController.js');

router.route('/createListCategory/').post(createListCategory);
router.route('/getListById/').post(getListById);
router.route('/addNewListType/').post(addNewListType);
router.route('/addComicToListId/').post(addComicToListId);

// router.route('/me').get(isAuthenticatedUser, getUserDetails);

module.exports = router;
