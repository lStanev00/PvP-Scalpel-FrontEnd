import { Router } from "express";
import Member from "../Models/Member.js"

const LDBController = Router();

LDBController.get(`/LDB/2v2`, twosGet);
LDBController.get(`/LDB/3v3`, threesGet);
LDBController.get(`/LDB/solo`, soloGet);
LDBController.get(`/LDB/blitz`, blitzGet);
LDBController.get(`/LDB/BG`, BGGet);


async function twosGet(req, res) {
    
    try {
        const players = await Member.find(
            { "rating.2v2": { $exists: true } }, 
            { name: 1, "rating.2v2": 1, "achieves.2s": 1, _id: 1 } 
          ).sort({ "rating.2v2": -1 }); 
        
        res.status(200).json(players);
        
    } catch (error) {
        res.status(404);
    }
}

async function threesGet(req,res) {
    try {
        const players = await Member.find(
            { "rating.3v3": { $exists: true } }, 
            { name: 1, "rating.3v3": 1, "achieves.3s": 1, _id: 1 } 
          ).sort({ "rating.3v3": -1 }); 
        
        res.status(200).json(players);
        
    } catch (error) {
        res.status(404);
    }
}

async function soloGet(req,res) {
    try {
        const players = await Member.find(
            { "rating.solo": { $exists: true } }, 
            { name: 1, "rating.solo": 1, _id: 1 } 
          ).sort({ "rating.solo": -1 }); 
        
        res.status(200).json(players);
        
    } catch (error) {
        res.status(404);
    }
}
async function blitzGet(req,res) {
    try {
        const players = await Member.find(
            { "rating.solo_bg": { $exists: true } }, 
            { name: 1, "rating.solo_bg": 1,  "achieves.BG": 1, _id: 1 } 
          ).sort({ "rating.solo_bg": -1 }); 
        
        res.status(200).json(players);
        
    } catch (error) {
        res.status(404);
    }
}
async function  BGGet(req,res) {
    try {
        const players = await Member.find(
            { "rating.BG": { $exists: true } }, 
            { name: 1, "rating.BG": 1,  "achieves.BG": 1, _id: 1 } 
          ).sort({ "rating.BG": -1 }); 
        
        res.status(200).json(players);
        
    } catch (error) {
        res.status(404);
    }
}





export default LDBController