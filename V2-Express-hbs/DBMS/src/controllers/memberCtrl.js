import { Router } from "express";
import Member from "../Models/Member.js"

const memberCtrl = Router();


memberCtrl.post(`/member`, onPost);
// memberCtrl.get(`/member/:id`, onGet);
// memberCtrl.get(`/member/list`, onGetList)


async function onPost(req, res) {
    // console.log(req);
    
    const mem = req.body
    

    res.status(200).json(mem);
    
}

export default memberCtrl;