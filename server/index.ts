import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import os from 'os';

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

const getLocalIP = () => {
  const interfaces = os.networkInterfaces();
  for (const name in interfaces) {
    if (interfaces[name]) {
      for (const iface of interfaces[name]) {
        if (iface.family === 'IPv4' && !iface.internal) {
          return iface.address;
        }
      }
    }
  }
  return 'IP not found';
};

console.log('Local IP Address:', getLocalIP());

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
