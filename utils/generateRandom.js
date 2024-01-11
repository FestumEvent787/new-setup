const generateRandom = (length = 32, alphanumeric = true) => {
  let data = "",
    keys = "";

  if (alphanumeric) {
    keys = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  } else {
    keys = "0123456789";
  }

  for (let i = 0; i < length; i++) {
    data += keys.charAt(Math.floor(Math.random() * keys.length));
  }

  return data;
};

const generateCustomRandomNumber = (max = 50, min = 0) => {
  let data = Math.floor(Math.random() * (max - min + 1) + min);

  return data;
};

module.exports = {
  generateRandom,
  generateCustomRandomNumber,
};
