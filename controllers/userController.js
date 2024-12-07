import asyncHandler from '../middleware/asyncHandler.js';
import User from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import generateToken from '../utils/generateToken.js';

const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        res.status(401);
        throw new Error('Invalid Credentials');
    }

    const isMatch = await user.matchPassword(password);
    if (isMatch) {
        let userId = user._id
        const token = jwt.sign({userId},process.env.JWT_SECRET,{expiresIn:"30d"});  // Generate token
        res.cookie('jwt', token, {
            httpOnly: true,  // Prevents client-side JavaScript from accessing the cookie
            secure: process.env.NODE_ENV !== 'development', // Send cookie over HTTPS only in production
            sameSite: 'strict', // Prevents CSRF attacks
            maxAge: 30 * 24 * 60 * 60  * 1000, // 30 days
        });
        // Log token to verify it's generated
        console.log('Generated Token:', token);

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token,  // Return the token in the response
        });
    } else {
        res.status(401);
        throw new Error('Invalid Credentials');
    }
});

const registerUser = asyncHandler(async(req,res)=>{
    const {name,email,password} = req.body;
    const userExist = await User.findOne({email});
    if(userExist){
        res.status(400);
        throw new Error("User already exists");
    }
    const user = await User.create({
        name,
        email,
        password
    });
    if(user){
        const token = jwt.sign({userId: user._id},process.env.JWT_SECRET,{expiresIn:"30d"});
       
        res.cookie('jwt', token, {
            httpOnly: true,  // Prevents client-side JavaScript from accessing the cookie
            secure: process.env.NODE_ENV !== 'development', // Send cookie over HTTPS only in production
            sameSite: 'strict', // Prevents CSRF attacks
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        });

        res.status(200).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            password:user.password,
            isAdmin : user.isAdmin,
            token : token,
        })
    }else{
        res.status(400);
        throw new Error("Invalid user data ")
    }
});
const logoutUser = asyncHandler(async(req,res)=>{
    res.cookie('jwt','',{
        httpOnly:true,
        expires: new Date(0)
    });
    res.status(200).json({message:'logged out successfully'});

}); 
     
const getUserProfile = asyncHandler(async(req,res)=>{
    const user = await User.findById(req.user._id);

    if(user){
        res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            password:user.password,
            isAdmin : user.isAdmin
        })
    }else{
        res.status(404);
        throw new Error("User not found!")
    }

});

const updateUserProfile = asyncHandler(async(req,res)=>{
    const user = await User.findById(req.user._id);

    if(user){
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if(req.body.password){
            user.password = req.body.password;
        }
        const updatedUser = await user.save();
        res.status(200).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            isAdmin : user.isAdmin
        })
    }else{
        res.status(404);
        throw new Error("User not found!")
    }
});

const getUsers =asyncHandler(async(req,res)=>{
    res.send('get users');
});

const getUserById =asyncHandler(async(req,res)=>{
    res.send("get user by id")
});
const deleteUser = asyncHandler(async(req,res)=>{
    res.send('delete user')
});

const updateUser = asyncHandler(async(req,res)=>{
    res.send('delete user by id')
})
 
export {
    authUser,
    getUsers,
    getUserById,
    getUserProfile,
    deleteUser,
    updateUser,
    updateUserProfile,
    registerUser,
    logoutUser
}