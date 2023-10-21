const router = require("express").Router();
// const express = require('express');
// const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//Update User
router.put("/:id", async(req,res)=>{
    if(req.body.userId === req.params.id || req.body.isAdmin){
        if(req.body.password){
            try{
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password,salt);
            }catch(err){
                return res.status(500).json(err);
            }
        }
        try{
            const user = await User.findByIdAndUpdate(req.params.id,{
                $set: req.body,
            });
            res.status(200).json("Account has been updated");
        }catch(err){
            return res.status(500).json(err);
        }
    }else{
        return res.status(403).json("You can update only your account!")
    }
})
//Delete User
router.delete("/:id", async(req,res)=>{
    if(req.body.userId === req.params.id || req.body.isAdmin){   
        try{
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Account has been deleted");
        }catch(err){
            return res.status(500).json(err);
        }
    }else{
        return res.status(403).json("You can delete only your account!")
    }
})
//Get a User
router.get("/:id", async(req,res)=>{  
    try{
        const user = await User.findById(req.params.id);
        const {password,updatedAt, ...other} = user._doc
        res.status(200).json(other);
    }catch(err){
        return res.status(500).json(err);
    } 
})
//Follow a User
router.put("/:id/follow", async(req,res)=>{
    if(req.body.userId !== req.params.id){   
        try{
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if(!user.followers.includes(req.body.userId)){
                await user.updateOne({$push: {followers: req.body.userId} });
                await currentUser.updateOne({$push: {followings: req.params.id} });
                res.status(200).json("User has been followed");
            }else{
                res.status(403).json("You already follow this user");
            }
        }catch(err){
            return res.status(500).json(err);
        }
    }else{
        return res.status(403).json("You can not follow yourself!")
    }
});

//Unfollow a User
router.put("/:id/unfollow", async(req,res)=>{
    if(req.body.userId !== req.params.id){   
        try{
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if(user.followers.includes(req.body.userId)){
                await user.updateOne({$pull: {followers: req.body.userId} });
                await currentUser.updateOne({$pull: {followings: req.params.id} });
                res.status(200).json("User has been Unfollowed");
            }else{
                res.status(403).json("You do not follow this user");
            }
        }catch(err){
            return res.status(500).json(err);
        }
    }else{
        return res.status(403).json("You can not Unfollow yourself!")
    }
})

module.exports = router