var CryptoJS = require('aes.js');  //引用AES源码js
console.log(CryptoJS)
var key = CryptoJS.enc.Utf8.parse("fiubHNPc701P_d0z");//十六位十六进制数作为秘钥

//解密方法
function Decrypt(word) {
    var decrypt = CryptoJS.AES.decrypt(word, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
    return CryptoJS.enc.Utf8.stringify(decrypt).toString();
}
//加密方法
function Encrypt(word) {
    var srcs = CryptoJS.enc.Utf8.parse(word);
    var encrypted = CryptoJS.AES.encrypt(srcs, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
    return encrypted.toString();
}
//暴露接口
module.exports.Decrypt = Decrypt;
module.exports.Encrypt = Encrypt;