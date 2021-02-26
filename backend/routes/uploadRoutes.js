import path from 'path';
import express from 'express';
import multer from 'multer';

const router = express.Router();

// define storage
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/')
    },
    filename(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
    }
})

// customize this for filetype required
function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png/
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = filetypes.test(file.mimetype)

    if (extname && mimetype) {
        return cb(null, true);
    }
    else {
        cb("Images only !!");
    }
}

// upload function
const upload = multer({
    storage,
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb)
    }
})


// endpoint
router.post('/', upload.single('image'), (req, res) => {
    // return the path of the file
    res.send(`/${req.file.path}`);
})

export default router;