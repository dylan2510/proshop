import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';

// @desc    Auth user & get token
// @route   Post: /api/users/login
// @access  Public
export const authUser = asyncHandler(async (req,res) => {

    const {email, password} = req.body;
    
    const user = await User.findOne({email: email});

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)
        })
    }
    else {
        res.status(401);
        throw new Error("Invalid email or password");
    }
});


// @desc    Register a new user
// @route   Post: /api/users
// @access  Public
export const registerUser = asyncHandler(async (req,res) => {

    const {name, email, password} = req.body;
    
    const userExist = await User.findOne({email});

    // user already exist
    if (userExist) {
        res.status(400);
        throw new Error("User already exist");
    };

    // create user
    const user = await User.create({
        name,
        email,
        password
    });

    // user is created
    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)
        });
    } 
    else {
        res.status(400);
        throw new Error("invalid user data");
    }

});


// @desc    Get user profile
// @route   Get: /api/users/profile
// @access  Private
export const getUserProfile = asyncHandler(async (req,res) => {

    const user = await User.findById(req.user._id);

    if (user) {
        // return user objeect
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        });
    } 
    else {
        res.status(404);
        throw new Error("User not found");
    }

});


// @desc    Update user profile
// @route   Put: /api/users/profile
// @access  Private
export const updateUserProfile = asyncHandler(async (req,res) => {

    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            token: generateToken(updatedUser._id)
        });
    } 
    else {
        res.status(404);
        throw new Error("User not found");
    }

});


// @desc    Get all users
// @route   Get: /api/users
// @access  Private/Admin
export const getUsers = asyncHandler(async (req,res) => {
    const users = await User.find({});
    res.json(users);
});


// @desc    Delete user
// @route   DELETE: /api/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req,res) => {

    const user = await User.findById(req.params.id);
    
    if (user) {
        await user.remove();
        res.json({message: 'User removed'});
    }
    else {
        res.status(404);
        throw new Error('User not found');
    }
});


// @desc    Get user by ID
// @route   Get: /api/users/:id
// @access  Private/Admin
export const getUserById = asyncHandler(async (req,res) => {
    const user = await User.findById(req.params.id).select('-password');
    if (user) {
        res.json(user);
    }
    else {
        res.status(404);
        throw new Error('User not found');
    }
});


// @desc    Update user
// @route   Put: /api/users/:id
// @access  Private/Admin
export const updateUser = asyncHandler(async (req,res) => {

    const user = await User.findById(req.params.id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.isAdmin = req.body.isAdmin;
        
        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin
        });
    } 
    else {
        res.status(404);
        throw new Error("User not found");
    }

});