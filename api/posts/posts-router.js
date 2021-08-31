// implement your posts router here
const express = require('express')
const Post = require('./posts-model')
const router = express.Router()



router.get('/', (req, res)=>{
    Post.find()
        .then((posts)=>{
            res.status(200).json(posts)
        })
        .catch((err)=>{
            res.status(500).json({
                message: 'The posts information could not be retrieved',
                err: err.message,
            })
        })
})

router.get('/:id', (req, res)=>{
    Post.findById(req.params.id)
        .then((post)=>{
            if(post){
                res.status(200).json(post)
            }else{
                res.status(404).json({message: 'The post with the specified ID does not exist'})
            }
        })
        .catch((err)=>{
            res.status(500).json({
                message: 'The post information could ID does not exist',
                err: err.message
            })
        })
})

router.post('/', (req, res)=>{
    const { title, contents } = req.body
    if (!title || !contents){
        return res.status(400).json('Please provide title and contents for post')
    }else{
        Post.insert({title, contents})
           .then(({id})=>{
            return Post.findById(id)

         }).then((post)=>{
        res.status(201).json(post)

        }).catch((err)=>{
        res.status(500).json({
            message: 'There was an error while saving the past to the database',
            err: err.message,
        })
    })
    }   
})


router.put("/:id", (req, res) => {
    const { title, contents } = req.body;
    const { id } = req.params;
    if (!title || !contents) {
      res
        .status(400)
        .json({ message: "Please provide title and contents for the post" });
    } else {
      Post.findById(id)
        .then((post) => {
          if (!post) {
            res
              .status(404)
              .json({ message: "The post with the specified ID does not exist" });
          } else {
            return Post.update(id, req.body);
          }
        })
        .then((data) => {
          if (data) {
            return Post.findById(id);
          }
        })
        .then((post) => {
          if (post) {
            res.json(post);
          }
        })
        .catch((err) => {
          res.status(500).json({
            message: "The post information could not be modified",
            err: err.message,
          });
        });
    }
  });

router.delete('/:id', async (req, res)=>{
    try{
        const post = await Post.findById(req.params.id)
        if(!post) {
            res.status(400).json({message: 'The post could not be recovered'})
        } else{
            await Post.remove(req.params.id)
            res.json(post)
        }
    } catch(err) {
        res.status(500).json({message: 'The post could not be removed'})
    }
})

router.get("/:id/comments", async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist" });
      } else {
        const comm = await Post.findPostComments(req.params.id);
        res.json(comm);
      }
    } catch (err) {
      res
        .status(500)
        .json({ message: "The comments information could not be retrieved" });
    }
  });

  module.exports = router