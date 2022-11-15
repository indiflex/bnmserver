import { createCipheriv, createDecipheriv, pbkdf2Sync } from 'crypto';
import { DefaultSalt } from '../config.js';

const KEY = Buffer.from(DefaultSalt.repeat(2)); // 256 / 8 = 32 length만 지키고 자유롭게 사용하세요.
const IV = Buffer.from('xOVBAh8LdvvDXJ8j1MgPYg==', 'base64');
const ALGORITHM = 'aes-256-cbc'; // 원하는 알고리즘을 입력하세요.
const DIGEST = 'base64'; // hex로 해도 무관합니다.

export const encrypt = (data) => {
  const cipher = createCipheriv(ALGORITHM, KEY, IV);
  const encUpdateBuffer = cipher.update(data);
  const encryptedData = Buffer.concat([
    encUpdateBuffer,
    cipher.final(),
  ]).toString(DIGEST);

  return `${IV.toString('hex')}:${encryptedData}`;
};

export const decrypt = (encryptedData) => {
  const [iv, encData] = encryptedData.split(':');
  console.log('🚀 ~ iv', iv, encData);
  const decipher = createDecipheriv(ALGORITHM, KEY, Buffer.from(iv, 'hex'));
  const decUpdateBuffer = decipher.update(encData, DIGEST);
  return Buffer.concat([decUpdateBuffer, decipher.final()]).toString();
};

export const encryptUserToken = (user) => {
  return encrypt(`${user.id},${user.email}`);
};

/**
 * token 복호화
 * @param {string} token
 * @returns [userId, userEmail]
 */
export const decryptUserToken = (token) => {
  return decrypt(token)?.split(',');
};

/**
 * 단방향 암호화
 * @param {string} data
 * @param {Buffer} salt
 */
export const password = (data, salt = DefaultSalt) =>
  pbkdf2Sync(data, salt, 100000, 128, 'sha512').toString('base64');

// const data = '1234abc한글~!@#$';
// const enc = encrypt(data);
// const dec = decrypt(enc);
// console.log('🚀 ~ enc, dec', enc, dec);

// const passwd = password('passwd~!@123');
// console.log('🚀 ~ passwd', passwd);
// console.log('🚀 ~ passwd', passwd.length);
