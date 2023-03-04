import { HTTP_BAD_REQUEST } from './../constants/http_status';
import { User, UserModel } from './../models/user.model';
import { Router } from "express";
import jwt from 'jsonwebtoken';
import asynceHandler from 'express-async-handler';
import bcryptjs from 'bcryptjs';

const router = Router();

// router.get('/seed', asynceHandler(
//     async (req, res) => {
//         const usersCount = await UserModel.countDocuments();
//         if(usersCount>0){
//             res.send('Seed is already done');
//             return;
//         }
//         await UserModel.create(sample_users);
//         res.send('Seed is done');
//     }
// ))


// USER LOGIN
router.post('/login', asynceHandler(
    async (req, res) => {
        const {email, password} = req.body;
        
        const user = await UserModel.findOne({email:email});

            if(user && (await bcryptjs.compare(password,user.password))){
                const newUser = {
                  _id:user._id,
                  name:user.name,
                  email:user.email,
                  phone:user.phone,
                  address:user.address,
                  isAdmin:user.isAdmin
                };
                res.send(generateTokenResponse(newUser));
            }else{
                res.status(HTTP_BAD_REQUEST).send('username or password invalid');
            }
    }
));

// USER SIGNUP
router.post('/signup', asynceHandler(
    async (req, res) => {
        const {name, email, phone, address, password} = req.body;
        const user = await UserModel.findOne({email});
        if(user){
            res.status(HTTP_BAD_REQUEST).send('User is already exist, please login');
            return;
        }

        const encryptedPassword = await bcryptjs.hash(password, 10);

        const newUser:User = {
            id:'',
            name,
            email:email.toLowerCase(),
            phone,
            password:encryptedPassword,
            address,
            isAdmin: false
        }

        const saveUser = await UserModel.create(newUser);
        res.send(generateTokenResponse(newUser));
    }
))

const generateTokenResponse = (user:any) => {
    const token = jwt.sign({
        email:user.email, isAdmin:user.isAdmin
    }, 'SomeRandomText', {
        expiresIn: '1d'
    });

    user.token = token;
    return user;
}

export default router;