const axios = require("axios");

module.exports = function getNameHistory(uuid, cb) {
  if (typeof uuid !== "string") {
    cb({
      "errorType": "InvalidArguments",
      "error": "No uuid provided"
    }, null);
  } else if (typeof cb !== "function") {
    cb({
      "errorType": "InvalidArguments",
      "error": "No callback function provided"
    }, null);
  } else {
    axios
      .get(`https://api.mojang.com/user/profiles/${uuid}/names`)
      .then((res) => {
        cb(null, res.data);
      })
      .catch((err) => {
        cb(err, null);
      });
  }
};
