const asyncHandler  = require("express-async-handler")
const Chat = require('../models/chatModel')
const User = require('../models/userModel')

const accessChat = asyncHandler(async (req, res) => {
    const {userId} = req.body;

    if(!userId){
        console.log("UserId param not sent with request.");
        return res.sendStatus(400);
    }

    var isChat = await Chat.find({
        isGroupChat: false,
        $and:[
            {users: {$elemMatch: {$eq: req.user._id}}},
            {users: {$elemMatch: {$eq: userId}}}
        ]
    })
    .populate("users", "-password")
    .populate({
        path: "latestMessage",
        populate: {
            path: "sender",
            select: "name pic email"
        }
    });

    if(isChat.length > 0){
        res.send(isChat[0]);
    }else{
        var chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId],
        };
        
        try{
            const createdChat = await Chat.create(chatData);
            const fullChat = await Chat.findOne({_id: createdChat._id}).populate("users", "-password");
            res.status(200).json(fullChat);
        }
        catch(error){
            res.status(400)
        }
    }
})

const fetchChats = asyncHandler(async(req, res) => {
    try {
        Chat.find({users: {$elemMatch: {$eq: req.user._id}}})
            .populate('users', '-password')
            .populate('groupAdmin')
            .populate('latestMessage')
            .sort({updatedAt: -1})
            .then( async (results) => {
                results = await User.populate(results, {
                    path: 'latestMessage.sender',
                    select: 'name pic email',
                });

                res.status(200).send(results);
            })
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
})

const createGroupChat = asyncHandler(async(req, res) => {
    if(!req.body.users || !req.body.name){
        return res.status(400).send({message: "please fill all the fields"})
    }
    
    // From the frontend, we're going to send the request in the stringfy format.
    var users = JSON.parse(req.body.users);

    if(users.length < 2){
        return res
        .status(400)
        .send({message: "More than 2 people required to form a group chat."})
    }

    // Pushing the logged in user into the group chat array.
    users.push(req.user);

    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,           
            isGroupChat: true,
            groupAdmin: req.user, 
        });

        const fullGroupChat = await Chat.findOne({_id: groupChat._id})
            .populate('users', '-password')
            .populate('groupAdmin', '-password');

        res.status(201).send(fullGroupChat);
    } catch (error) {
        res.status(400).send(error.message);
    }

})

const renameGroup = asyncHandler(async(req, res) => {
    // I need to first extract the name of the group from the request body,
    // Then I need to run a query to find the name in the database.
    // Then I need to change it's name and send an OK response.
    // If name couldn't be changed then I need to send a 400 error.

    try {
        const {chatId, chatName} = req.body;

        const updatedChat = await Chat.findByIdAndUpdate(
            chatId,
            {
                chatName
            },{
                new: true,
            }
        ).populate('users', '-password')
        .populate('groupAdmin', '-password')

        res.status(201).json(updatedChat);
    } catch (error) {
        return res.status(401)
        .send(error.message + "Chat Not Found");
    }
})

const addToGroup = asyncHandler(async(req, res) => {
    try {
        const {chatId, userId} = req.body;
    
        const added = await Chat.findByIdAndUpdate( // ADD await HERE
            chatId,
            {
                $push: {users: userId}, 
            },
            {new: true}
        ).populate('users', '-password')
        .populate('groupAdmin', '-password')

        if(!added){
            return res.status(404).json({message: "Chat not found"});
        }

        return res.status(200).json(added); // Changed from 203 to 200
    } catch (error) {
        return res.status(400).send({message: "Could not add User to the group chat."});
    }
})

const removeFromGroup = asyncHandler(async(req, res) => {
    try {
        const {chatId, userId} = req.body;
    
        const removed = await Chat.findByIdAndUpdate(
            chatId,
            {
                $pull:{users: userId}
            },
            {
                new: true
            }
        ).populate('users', '-password')
        .populate('groupAdmin', '-password')

        if(!removed){
            return res.status(404).json({message: "Chat not found"});
        }
    
        return res.status(200).json(removed); 
    } catch (error) {
        return res.status(400).send({message: "Couldn't remove person from the group chat."})
    }
})

module.exports = {accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup}