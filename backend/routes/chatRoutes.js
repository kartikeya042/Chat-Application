const express = require('express');
const {protect} = require('../middlewares/auth.middleware')
const router = express.Router();
const {accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup} = require('../controllers/chatControllers')

router.route('/').post(protect, accessChat)
.get(protect, fetchChats);
router.route('/group').post(protect, createGroupChat)
router.route('/rename').patch(protect, renameGroup)
router.route('/addToGroup').patch(protect, addToGroup)
router.route('/removeFromGroup').patch(protect, removeFromGroup)

module.exports = router