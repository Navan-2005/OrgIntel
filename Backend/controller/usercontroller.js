const user=require('../models/user')

const register=async(req,res)=>{
    const {name,password,email,role}=req.body;
    try {
        const existingUser=await user.findOne({email});
        if(existingUser){
            return res.status(400).json({error:"User already exists"});
        }
        const hashedPassword=await user.hashPassword(password);
        const newUser=new user({name,password:hashedPassword,email,role});
        const token=newUser.generateAuthToken();
        await newUser.save();
        res.status(200).json({newUser,token});
    } catch (error) {
        console.error("Error registering user:",error);
        res.status(500).json({error:"Internal server error"});
    }
}

const login=async(req,res)=>{
    const {email,password}=req.body;
    try {
        const user1=await user.findOne({email});
        if(!user1){
            return res.status(401).json({error:"Invalid User"});
        }
         const isMatch = await user1.comparePassword(password);
        if(!isMatch){
            return res.status(401).json({error:"Invalid Password"});
        }
        const token=user1.generateAuthToken();
        res.status(200).json({user:user1,token});
    } catch (error) {
        console.error("Error logging in:",error);
        res.status(500).json({error:"Internal server error"});
    }
}

module.exports={register,login}