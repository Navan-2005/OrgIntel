const express=new require('express');
const router=express.Router();
const huffmanController=require('../controller/huffmancontroller')
router.post('/encode',huffmanController.store);
router.post('/decode',huffmanController.decode);
module.exports=router