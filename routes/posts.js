const router = require("express").Router();
const Post = require("../models/Post")

//Create a post
router.post("/", async(req,res)=>{
    const newPost = new Post(req.body);
    try{
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    }catch(err){
        res.status(500).json(err);
    }
});


//Update a post

router.put("/:id", async (req,res)=>{
    try{
        const post = await Post.findById(req.params.id);
        if(post.userId == req.body.userId){
            await post.updateOne({$set:req.body});
            res.status(200).json("Your post has been updated.")
        }else{
            res.status(403).json("You can Update only your post")
        }

    }catch(err){
        res.status(500).json(err);
    }
});


//Delete a post

router.delete("/:id", async (req,res)=>{
    try{
        const post = await Post.findById(req.params.id);
        if(post.userId == req.body.userId){
            await post.deleteOne();
            res.status(200).json("Your post has been deleted.");
        }else{
            res.status(403).json("You can delete only your post");
        }

    }catch(err){
        res.status(500).json(err);
    }
});


//Like/dislike a post

router.put("/:id/like", async (req,res)=>{
    try{
        const post = await Post.findById(req.params.id);
        if(!post.likes.includes(req.body.userId)){
            await post.updateOne({$push:{likes: req.body.userId}});
            res.status(200).json("The post has been liked");
        }else{
            await post.updateOne({$pull:{likes: req.body.userId}});
            res.status(200).json("The post has been disliked");
        }
    }catch(err){
        res.status(500).json(err);
    }
});


//Get a post

router.get("/:id", async(req,res)=>{
    try{
        const post = Post.findById(req.params.id);
        res.status(200).json(post);
    }catch(err){
        res.status(500).json(err);
    }    
})

//Get timeline posts

module.exports = router;