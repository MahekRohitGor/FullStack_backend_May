const crypto = require("crypto");
const algorithm = 'AES-256-CBC';
const key = Buffer.from("4fa3c5b6f6a8318be1e0f1e342a1c2a9569f85f74f4dbf37e70ac925ca78e147", 'hex');
const iv = Buffer.from("15a8f725eab7c3d34cc4e1a6e8aa1f9a", 'hex');

const bcrypt = require('bcrypt');

const plain = 'adminstrong1234';
const hash = '$2b$10$5YLSt3NhTskAhfsVAcx89Ozx67ZJoEN9HKkWOOa.Ex9b/.hQ.FmTa';

const match = bcrypt.compareSync(plain, hash);
// const enc = bcrypt.hashSync(plain, 10)
console.log('Match:', match);

function encrypt(text) {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

function decrypt(encrypted) {
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// const encrypted = encrypt(`{
//   "email_id": "admin@example.com",
//   "password_": "adminstrong1234"
// }`);

// const encrypted = encrypt(`{ 
//     "event_id": 5,
//     "event_title": "Event Title edited",
//     "event_desc": "Event Description",
//     "event_address": "Motera Stadium",
//     "event_price": 5000.00,
//     "total_tickets_avail": 100000,
//     "event_date": "2025-06-05 10:00:00"
//     }`);

const encrypted = encrypt(`{ 
  "event_id": 5,
  "image_link": "https://image.png"
  }`);


const decrypted = decrypt(`9bf1bea4a12121b99dcdac673ccc399a26da46dc24821f7a48da5dead710a060e6ba2a8ba2df39528a32a2d0afd4ce8cc75eec53953b2b52d67eba46a9f5d1f7`);

console.log('Encrypted:', encrypted);
console.log('Decrypted:', decrypted);