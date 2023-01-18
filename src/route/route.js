const express = require('express');
const router = express.Router();
const authorController= require("../controller/authorController")
const blogController = require("../controller/blogController")
const auth = require ('../middleware/auth')

//test API
router.get('/test-me',function(req,res){
    res.send({msg : "test done "})
})


// creating author And Blogs 
router.post("/authors",authorController.createAuthor)
router.post('/blogs',auth.authentication,blogController.createBlogs)

// login API
router.post('/login',authorController.login)

// get and update API 
router.get('/blogs',auth.authentication,blogController.getBlogs)
router.put("/blogs/:blogId",auth.authentication,auth.authorisation,blogController.updatedBlogs)


// delete API's
router.delete('/blogs/:blogId',auth.authentication,auth.authorisation,blogController.deleteBlogs)
router.delete('/blogs',auth.authentication,auth.authorisationQuery,blogController.deleteByQuery)

module.exports=router




