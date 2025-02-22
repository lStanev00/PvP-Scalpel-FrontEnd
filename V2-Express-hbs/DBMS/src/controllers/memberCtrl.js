import { Router } from "express";
import Member from "../Models/Member.js"
import dotenv from 'dotenv';
import validateToken from "../helpers/authToken.js";

dotenv.config({ path: '../../.env' });
const JWT_SECRET = process.env.JWT_SECRET;

const memberCtrl = Router();


memberCtrl.post(`/member`, onPost);
memberCtrl.get(`/member/list`, onGetList)
memberCtrl.get(`/member/:id`, onGet);

async function onGet(req, res) {
    const id = req.params.id;

    try {
        const search = await Member.findById(id);
        res.status(200).json(search);
        
    } catch (error) {
        res.status(404).json({msg:`Entry's missing.`})
    }
}


async function onPost(req, res) {
    const Authorization = validateToken(req.headers[`in-auth`], JWT_SECRET);

    if(!Authorization) return res.status(401).json({403: `Auth Error`});
    console.log(`Authorized!`);
    
    const mem = Authorization
    
    try {
        const exist = await Member.findOne({ blizID: mem.blizID });
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
async function onGetList(req,res) {
    try {
        const memList = await Member.find();
        res.status(200).json(memList);
    } catch (error) {
        res.status(404).json({msg:`There's no such collection`});
    }
}
export default memberCtrl;