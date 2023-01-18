const jwt=require('jsonwebtoken')
const authorModel = require('../models/authorModel')
const blogModel = require('../models/blogModel')
const mongoose =require('mongoose')
const objectID= mongoose.Types.ObjectId
 

const authentication= function(req,res,next){
    try{
     let token= req.headers["X-API-KEY"]
    if (!token) token = req.headers["x-api-key"]

    if (!token) return res.status(400).send({status:false , msg : "token is not found "})

    let verify= jwt.verify(token , "group37 project")
    if (!verify) return res.status(402).send({status: false , msg : "token is not valid "})
    
    req.final= verify.userid
    next()
    }catch(err){
        return res.status(402).send({status: false , msg : err.message})
    }
}


// Authorisation for all Update and delete API which has BlogID in params

const authorisation= async function(req,res,next){

    try{
    let blogId = req.params.blogId
    let validblog =  await blogModel.findById(blogId)
    if (!validblog) return res.status(404).send({status: true , msg :"No blog is present with this blogId"})

    let authorId = validblog.authorId
    let decodedToken=req.final

    if (authorId != decodedToken){
        return res.status(401).send({status: false , msg : "you are not authorise person "}) 
    }
    next()
    }catch(err){
        return res.status(402).send({status: false , msg : err.message})
    }
   
}


//authorisation for delete Query API

const authorisationQuery= async function(req,res,next){    

    try{


    let autID = req.query.authorId
    
    if(!autID) return res.status(400).send({status: false ,msg : "authorID is compulsory for running this query delete API"}) 
    if (!objectID.isValid(autID)) return res.status(400).send({status: false ,msg : "objectID is not valid"})
    console.log(autID)
    let validblog =  await authorModel.findById(autID)
    console.log(validblog)
    if (!validblog) return res.status(404).send({status: true , msg :"No blog is present with this authorId"})

    let decodedToken=req.final

    if (autID != decodedToken){
        return res.status(401).send({status: false , msg : "you are not authorise person "}) 
    }
    next()
    }catch(err){
        return res.status(401).send({status: false , msg : err.message}) 
    }
   
}
module.exports={
    authorisationQuery,
    authentication,
    authorisation
}

