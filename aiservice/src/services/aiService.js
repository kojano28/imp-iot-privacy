// src/services/aiService.js

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const gridfsStream = require('gridfs-stream');

let gfs;
const conn = mongoose.connection;
conn.once('open', () => {
    gfs = gridfsStream(conn.db, mongoose.mongo);
    gfs.collection('uploads');
});

const storeFilesInMongo = (directoryPath) => {
    const files = fs.readdirSync(directoryPath);

    files.forEach((file) => {
        const filePath = path.join(directoryPath, file);
        const readStream = fs.createReadStream(filePath);

        const writeStream = gfs.createWriteStream({
            filename: file,
            content_type: 'application/pdf',
        });

        readStream.pipe(writeStream);

        writeStream.on('close', (file) => {
            console.log('Stored file:', file.filename);
        });
    });
};

module.exports = { storeFilesInMongo };
