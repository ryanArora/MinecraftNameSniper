const axios = require("axios");

module.exports = function changeName(token, name, cb) {
  if (typeof token !== "string") {
    cb({
      "errorType": "InvalidArguments",
      "error": "No access token provided"
    }, null);
  } else if (typeof name !== "string") {
    cb({
      "errorType": "InvalidArguments",
      "error": "No name provided"
    }, null);
  } else if (typeof cb !== "function") {
    cb({
      "errorType": "InvalidArguments",
      "error": "No callback function provided"
    }, null);
  } else {
    axios
      .put(`https://api.minecraftservices.com/minecraft/profile/name/${name}`, {}, { headers: { authorization: `Bearer ${token}` } })
      .then((res) => {
        cb(null, res.data);
      })
      .catch((err) => {
        cb(err.response.data, null);
      });
  }
};
