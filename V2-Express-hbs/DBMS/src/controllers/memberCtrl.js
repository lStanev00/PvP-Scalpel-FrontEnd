import { Router } from "express";
import Member from "../Models/Member.js"
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });
const JWT_SECRET = process.env.JWT_SECRET;

const memberCtrl = Router();


memberCtrl.post(`/member`, onPost);
// memberCtrl.get(`/member/:id`, onGet);
// memberCtrl.get(`/member/list`, onGetList)


async function onPost(req, res) {
    let Authorization;
    try {
        Authorization = jwt.verify(req.headers[`in-auth`], JWT_SECRET);
        
    } catch (error) {
        Authorization = undefined
    }
    
    if(!Authorization) return res.status(401).json({403: `Auth Error`});
    console.log(`Autorized! \n ${Authorization}`);
    
    
    const mem = Authorization
    
    try {
        const exist = await Member.findById(mem._id);

        if (exist){
            await Member.findByIdAndUpdate(mem._id, mem);
            
        }else {
            const memTry = new Member(mem);
            await memTry.save();
        }
        res.status(200).json(mem);
    } catch (error) {
        console.log(error);
        res.status(502).json({msg: `error: ${error}`})
        
    }   
}

export default memberCtrl;