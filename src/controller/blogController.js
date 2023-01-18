const blogModel = require('../models/blogModel')
const authorModel = require('../models/authorModel')
const mongoose =require ('mongoose')
 
const objectID= mongoose.Types.ObjectId

const validBody = function(data)
{
    if (Object.keys(data)==0) return false
    return true
}

const validation = function (data) {
    if (data == undefined || data == null) {
        return false
    }
    if (typeof (data) == "string" && data.trim() == 0) {
        return false
    }
    return true
}

let createBlogs = async function (req, res) {
    try {

        let data = req.body
        let {title,body,category,authorId}=data
        if (!validBody(data))  return res.status(400).send({msg :"body  is empty"})
        if (!validation(title)) return res.status(400).send({msg :"tittle is mandatory"})
        if (!validation(body)) return res.status(400).send({msg:"data is mandatory in body"})
        if (!validation(category)) return res.status(400).send({msg :"category is mandatory"})
        if (!validation(authorId)) return res.status(400).send({msg :"authorId is mandatory"})

        
        if (!objectID.isValid(authorId)) return res.status(403).send({msg :" objectID is not valid"})
        if (!authorId) return res.status(400).send({ msg: "Author ID is not given" })
        let auth = await authorModel.findById(authorId)
        if (!auth) return res.status(404).send({ msg: "author not found" })
        if (data.isPublished == true) {
            data.publishedAt = Date.now()
        }if (data.isDeleted == true) {
            data.deletedAt = Date.now()
        }
        let saveData = await blogModel.create(data)

        return res.status(201).send({ msg: saveData })
    }
    catch (err) {
        console.log(err.message)
        return res.status(500).send({ msg: err.message })
    }
}


const getBlogs = async function (req, res) {
    try {
        let data = req.query

        if (!data) return res.status(400).send({ msg: "query is not given " })
       
        let allBlogs = await blogModel.find({ isDeleted: false, isPublished: true, ...data })
        if (allBlogs.length == 0) return res.status(404).send({ msg: "NO blogs are present " })

        res.status(200).send({ status: true, allBlogs })

    }
    catch (err) {
        res.status(500).send(err.message)
    }
}

const deleteBlogs = async function (req, res) {
    try {
        let data = req.params.blogId
        if (!data) return res.send("Blog Id is not given")
        if (!objectID.isValid(data)) res.status(400).send(" objectID is not valid")

        let blogId = await blogModel.findById(data)
        if (!blogId) return res.status(404).send({ msg: "Blog id not found" })
        if (blogId.isDeleted == true) {
            res.status(200).send({ msg: "Blog is already deleted" })
        }

        else {
            blogId.isDeleted = true
            blogId.deletedAt = Date.now()
            res.status(200).send({ msg: blogId })
        }
    }

    catch (err) {
        res.status(500).send(err.message)
    }


}
const updatedBlogs = async function (req, res) {
    try {
        let data = req.params.blogId

        if (!data) return res.status(400).send({ msg: "Blog ID is not given " })
        if (!objectID.isValid(data)) res.status(400).send(" objectID is not valid")
        let document = await blogModel.findById(data)
        if (!document) return res.status(404).send({ msg: "blogID is not found " })
    
        let updatedData = req.body
        if (!validBody(updatedData))  return res.status(400).send({msg :"body  is empty"})
        if (document.isDeleted == true) {
            return res.status(404).send({status: false ,msg:"this blog is already deleted you can't update"})
        }
        else {
            let saveData = await blogModel.findOneAndUpdate({ _id: data },
                {
                    $set: {
                        title: updatedData.title,
                        body: updatedData.body,
                        isPublished: true,
                        publishedAt: Date.now()
                    },
                    $push: {
                        tags: updatedData.tags,
                        subcategory: updatedData.subcategory
                    }
                },
                { new: true })
            return res.status(200).send({ status : true ,msg: saveData })
        }
    }
    catch (err) {
        res.status(500).send({ status: true ,err: err.message })
    }
}

const deleteByQuery = async function (req, res) {
    try {
        let data = req.query
        if(!data.authorId) return res.status(400).send({status: false ,msg : "authorID is compulsory for running this query delete API"})
        if (!objectID.isValid(data.authorId)) return res.status(403).send(" objectID is not valid")
        let checkDocumentDel = await blogModel.find({isDeleted:false },{isPublished:false},{...data })
        let i;
        for (i =0 ; i< checkDocumentDel.length ; i++){
            
            let ID=checkDocumentDel[i]._id
            let delDoc= await blogModel.findOneAndUpdate({_id :ID}, {$set:{isDeleted:true}},{new:true})
            

        }
        if (checkDocumentDel.length==0) return res.status(404).send({ status : false,  msg: "NO blogs are present Or blog is already deleted " })
        return res.status(200).send({status : true ,msg : `there are ${checkDocumentDel.length} blog and ${checkDocumentDel.length} blog is deleted Successfully`})

    }
    catch (err) {
        res.status(500).send(err.message)
    }
}





module.exports.getBlogs = getBlogs

module.exports.createBlogs = createBlogs

module.exports.updatedBlogs = updatedBlogs

module.exports.deleteBlogs = deleteBlogs

module.exports.deleteByQuery = deleteByQuery