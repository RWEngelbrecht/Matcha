const express	= require('express');
const router	= express.Router();
const photo	= require('../controllers/photos.js');
const { body }	= require('express-validator');
const multer= require('multer');
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

// ADD photos.
router.get('/photos', photo.getphoto);
router.post('/photos', upload.single('new_photo'), [
    body('new_photo'),
],
photo.postphoto);
// DELETE photos
router.get('/deletephoto', photo.getdeletephoto);
router.get('/deletephoto', photo.postdeletephoto);
module.exports = router;