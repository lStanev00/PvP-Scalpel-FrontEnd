import { Router } from "express";
import Member from "../Models/Member.js"

const memberCtrl = Router();


memberCtrl.post(`/member`, onPost);
// memberCtrl.get(`/member/:id`, onGet);
// memberCtrl.get(`/member/list`, onGetList)


async function onPost(req, res) {
    // console.log(req);
    
    const mem = req.body
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
        res.status(500).json({msg: `error: ${error}`})
        
    }   
}

export default memberCtrl;