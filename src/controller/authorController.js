const authorModel = require('../models/authorModel')
const jwt=require('jsonwebtoken')

const validation = function(data){
    if(data==undefined || data == null ){
        return false
    }
    if(typeof(data)== "string" && data.trim()==0) {
        return false 
    }
    return true 
}



const validBody = function(data)
{
    if (Object.keys(data)==0) return false
    return true
}

const valid=  function (data){
    return ["Mr", "Mrs", "Miss"].indexOf(data) !=-1
}


      
const createAuthor = async function (req, res) {
    try {
        let data = req.body

        let { fname , lname , title ,email ,password} = data

        if (!validBody(data))  return res.status(400).send({msg :"body  is empty"})

        if (!validation(fname)) return res.status(400).send({msg : " Full name is required  "})
        if (!(/^[a-z ,.'-]+$/i.test(fname))) return res.status(400).send({status: false ,msg: "fname should be alphabetic character"})
        if (!validation(lname)) return res.status(400).send({msg : " last name is required  "})
        if (!(/^[a-z ,.'-]+$/i.test(lname))) return res.status(400).send({status: false ,msg: "lname should be alphabetic character"})
    

        if (!validation(title)) return res.status(400).send({msg : " title name is required  "})
        if (!valid(title)) return res.status(400).send({msg : " title should be Mr, Miss , Mrs  "})

        if (!validation(email)) return res.status(400).send({msg : " email ID not given "})
        let fullemail= await authorModel.findOne({email: email})
        if(fullemail) return res.status(400).send({status: false ,msg: "email should be unique"})
        if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))){
            return res.status(400).send({msg : "invalid email "})
        }
        if (!password) return res.status(400).send({msg : " Password not given "})
        if (!(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password))){
            return res.status(400).send({msg : "password invalid,password should contain atleast one number and alphabet"})
        }

        let document ={
            fname :fname.trim(),
            lname :lname.trim(),
            title :title,
            email :email.toLowerCase(),
            password:password
        }
        let savedData = await authorModel.create(document)
        res.status(201).send({ msg: savedData })
    }
    catch (err) {
        res.status(500).send({ msg: err.message })
    }
}

const login=async function(req,res){
    try{
    let username=req.body.email
    let password=req.body.password
    if (!validBody(req.body))  return res.status(400).send({msg :"body  is empty"})
    if (!validation(username)) return res.status(400).send({msg : " email ID not given "})
    if (!validation(password)) return res.status(400).send({msg : " password not given "})
    let userData=await authorModel.findOne({email:username,password:password})
    if(!userData){
       return res.status(404).send({status:true,msg:"incorrect credential"})
    }
    let token=jwt.sign({
        userid: userData._id.toString(),
        batch:"plutonium",
        project:"mini blogging site"
    },
    "group37 project"
    )
    res.setHeader("x-api-key",token)
    return res.status(201).send({status:true,msg:token})
}
catch(err){
   return res.status(500).send({status:false, msg:err.message})
}
}






module.exports.createAuthor= createAuthor
module.exports.login=login