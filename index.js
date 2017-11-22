'use strict';
let request = require('request');
let fs = require('fs');
let Promise = require('bluebird');

/*
* Encryption simulation when user trigger encrpyt command
*
* */
function EncryptionSimulation() {
  return new Promise((resolve, reject) => {
    let req = request.post('http://localhost:3000/api/encrypt');
    let form = req.form();
    form.append('secretKey', 'hello there');
    form.append('algorithm', 'aes192');
    form.append('file', fs.createReadStream('Capture.PNG'));
    let filename = 'download.PNG.encrypt';
    req.pipe(fs.createWriteStream(filename))
      .on('error', () => {
        reject('there is problem encrypting')
      })
      .on('finish', () => {
        console.log('Done Encrypting the File');
        resolve(filename);
      });
  });
}
/*
* Decryption simulation when user trigger decrpyt command
*
* */
function DecryptionSimulation(){
  return new Promise((resolve, reject) => {
    let req = request.post('http://localhost:3000/api/decrypt');
    let form = req.form();
    form.append('secretKey', 'hello there');
    form.append('algorithm', 'aes192');
    form.append('file', fs.createReadStream('download.PNG.encrypt'));
    let filename = 'download.PNG';
    req.pipe(fs.createWriteStream(filename))
      .on('error', () => {
        reject('there is problem encrypting')
      })
      .on('finish', () => {
        console.log('Done Decrypting the File');
        resolve(filename);
      });
  });
}

EncryptionSimulation()
  .then(() => DecryptionSimulation());