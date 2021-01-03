const axios = require("axios");

module.exports = function nameToProfile(name, cb) {
  if (typeof name !== "string") {
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
      .get(`https://api.mojang.com/users/profiles/minecraft/${name}`)
      .then((res) => {
        cb(null, res.data)
      })
      .catch((err) => {
        cb(err, null);
      });
  }
}