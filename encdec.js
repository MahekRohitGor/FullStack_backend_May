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


const decrypted = decrypt(`f7c448ea191861b183bc830c6a482ea7476f1ffe8219034fbb3ca5dbdfeb3becc4fb6fba0e0c59c17ec4931c1c87db4b94d321001181733cc323576625a4a2313e716c329b6410a26e6af342e55e5de035f91a55a617b73f31b68eaaf4270ae36c64862d66f40708e3dd5e7a6eb7934bc9b8440f74e612ee7f8f36950bc5443b043bb1fa4b1a094c3d1c10c7eb97f648e99621ee6713d81f94bbf9c108fc88dbfc39129edcd0879822d45ea57057bfb86b850cff9bc3e80d2239c610ca4d8e380372b264dba3b8452d1fb6d0127eb642d7582d88e3a4e34bd7f99053571779a0d3b871e036ca0c09df2bbb2c0d2120b71893ed3f9af0008c4c798eb83227c511a9f39d83baafad0a3c82d19427fad6ad21deb72450ad693d0b1ced27bedf5e6d44bb9337625115e3eecad234fd37104a885ef941712fdf20e4490f6cbc9e8f1447fccab3e9a2607102f59e7d567df5650c253caae44e62d1a1011b4d5a6097e3072b502c5a2c04b9fd49e81b63b8a402007e0daed1a41ca7dc828ae4e659d5c1b4fd6cd15e7fb27d0feff05ed79cd5bc710e23cd1e6fe2ec7e5195ef98432a8e63c5389b9b711f196802feb75d82c37f5851d4fcfa0b29cfb569e5e22abf6c1eb15ebbb4420a3c123d169d327d4413a9d2d2a0036691ee0c3fc03977329183269d54ae1859e1764b8f4fe9c98385ecab7897bed322bd05b24ff9681ed6f7d31ff723b070c60388239b4d74256b8c89945f51fa88de4cc94f0d3d09567c9f95102e9fd0862f619521269aed527f0f45b44797a5a1a27a68c161fb4b8ba9046136c34a695cfd4306a1ca29e0dd702c10ba8ebc1dd7544fe22e71932ca36e9091aaeb49ca9ca500847084f5429b1bafb4e83137945cea5b0634121013de626f2a681de6ba50fe7ea762f91658ad4ade278148a9eaf59b04300e366483cf429d0014206132b4bb413f595277fe2d49561aef8466f0f2ca1a2425f204d0f826467aebdf8968a68e662517575b8afeafccaceceebaeefd77eacd6f798b3e3836bf06145ccdf2df8ddf19fd80532c0cc9dcd3eb9b99156c07c74f0a95e5544c73dca4205b6b7119127badd20ebd39c70f50f76e77bc2759f4baabc159e2be35e28ad0e79d6a91d27c6cc4e0d2895cd1a2f509e7502083fd64ec86da052f0ed6fc7e02e8a6b9b7633dcf0f63f9c8adb1d01835839d7dfa4700312a0a06396731f442820ebad5eea4a2e274a6aee8b6f27c65bda78bc74aba74df715ad778e13462374d6f11ca20099e76d1122d4b064315e296ef42a309200e50d7f18f1b4e1991e623ce1527c68579c6a0c04d76cb0c73083666e203e7550383afe6be007c2d12b430ea519ffb9c265719f2be9bd74f84327438e3a324bb228953222a731ecd603569ecb545a0f995d3c6932fb3d58c3c5155c372b3e8db02b652483ae5892349da7f2fdd0fb26b9f6f15003aafa79bb907134c1850340086c018f82ebf7388d3a634a888832ea9a29bc045b53728c4e85972f6a0dfdc108a9a6be791c926f0d0755f5cd0b7cfd26e3778d7c1107d1aa5a3951f`);

console.log('Encrypted:', encrypted);
console.log('Decrypted:', decrypted);