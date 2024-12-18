import express from 'express';
import multer from 'multer';
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const timestamp = new Date().toLocaleString().replace(/[\:\\/\\. ]/g, '-');
    const filename = `${timestamp}${ext}`;
    cb(null, filename);
  }
});

const upload = multer({ storage: storage });

if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads');
}

app.post('/upload', upload.single('file'), (req: any, res: any) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  console.log('File uploaded successfully:', req.file);
  res.status(200).send({ message: 'File uploaded successfully', filename: req.file.filename });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});