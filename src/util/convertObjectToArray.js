module.exports = function convertObjectToArray(obj) {
  return Object.keys(obj).map((key) => {
    return obj[key];
  });
}
 