const userModel = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;

const signup = async(req,res) =>{

    const {username, email, password} = req.body;
    try{
        //Existing User Check
        const existingUser = await userModel.findOne({email : email});
        if(existingUser){
            return res.status(400).json({message: "User already exists"});
        }

        //Hashed Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // User Creation
        const result = await userModel.create({
            email : email,
            password : hashedPassword,
            username : username
        });

        //Token Generate
        const token = jwt.sign({email:result.email, id : result._id}, SECRET_KEY);

        //send response to user
        res.status(201).json({user: result, token: token});

    }catch(error){
        console.log(error);
        res.status(500).json({message: "Something went wrong"});
    }

}

const signin = async (req,res) =>{

    const{email, password} = req.body;

    try {
        //check existing user
        const existingUser = await userModel.findOne({email : email});
        
        //If user not exist return error
        if(!existingUser){
            return res.status(404).json({message: "User not found"});
        }

        //match password using bcrypt library
        const matchPassword = await bcrypt.compare(password, existingUser.password);

        //If password not match return error
        if(!matchPassword){
            return res.status(400).json({message: "Invalid Credendtials"})
        }

        //Token Generate
        const token = jwt.sign({email:existingUser.email, id : existingUser._id}, SECRET_KEY);

        //send response to user
        res.status(200).json({user: existingUser, token: token});

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Something went wrong"});
    }

    
}

module.exports = {signup, signin};