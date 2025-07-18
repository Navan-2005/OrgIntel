const user=require('../models/user')

const register=async(req,res)=>{
    const {name,password,email}=req.body;
    try {
        const existingUser=await user.findOne({email});
        if(existingUser){
            return res.status(400).json({error:"User already exists"});
        }
        const newUser=new user({name,password,email});
        await newUser.save();
        res.status(200).json({message:"User registered successfully"});
    } catch (error) {
        console.error("Error registering user:",error);
        res.status(500).json({error:"Internal server error"});
    }
}

const login=async(req,res)=>{
    const {email,password}=req.body;
    try {
        const user=await user.findOne({email});
        if(!user){
            return res.status(401).json({error:"Invalid credentials"});
        }
        if(user.password!==password){
            return res.status(401).json({error:"Invalid credentials"});
        }
        res.status(200).json({message:"Login successful"});
    } catch (error) {
        console.error("Error logging in:",error);
        res.status(500).json({error:"Internal server error"});
    }
}

module.exports={register,login}