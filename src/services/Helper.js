var CryptoJS = require("crypto-js");
const { SECRET_KEY, JWT_SECRETKEY, JWT_EXPIRES } = require("./Constant");
const Jwt = require("jsonwebtoken");

module.exports = {
  toUpperCase: (str) => {
    if (str.length > 0) {
      const newStr = str
        .toLowerCase()
        .replace(/_([a-z])/, (m) => m.toUpperCase())
        .replace(/_/, "");
      return str.charAt(0).toUpperCase() + newStr.slice(1);
    }

    return "";
  },

  /**
   * @description This function use for create validation unique key
   * @param apiTag
   * @param error
   * @returns {*}
   */
  validationMessageKey: (apiTag, error) => {
    let key = module.exports.toUpperCase(error.details[0].context.key);
    let type = error.details[0].type.split(".");
    type = module.exports.toUpperCase(type[1]);
    key = apiTag + key + type;
    return key;
  },

  encryptData: (data) => {
    return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
  },

  decryptData: (encrptString) => {
    var bytes = CryptoJS.AES.decrypt(encrptString, SECRET_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return JSON.parse(
      CryptoJS.AES.decrypt(encrptString, SECRET_KEY).toString(CryptoJS.enc.Utf8)
    );
  },
  issueToken: (payload) => {
    return Jwt.sign(payload, JWT_SECRETKEY, {
      algorithm: "HS512",
      expiresIn: JWT_EXPIRES,
    });
  },
  // Verifies admin token
  verify: (token, callback) => {
    try {
      return Jwt.verify(token, JWT_SECRETKEY, {}, callback);
    } catch (err) {
      console.log(err);
      return err;
    }
  },

  decode: (token) => {
    const parts = token.split(' ')
    if (parts.length === 2) {
      const scheme = parts[0]
      const credentials = parts[1]
      if (/^Bearer$/i.test(scheme)) {
        return credentials
      }

      return false
    }

    return false
  },
};
