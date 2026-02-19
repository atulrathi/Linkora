const bcrypt = require("bcryptjs");


// Hash Password
const hashPassword = async (plainPassword) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(plainPassword, salt);
};


// Compare Password
const comparePassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};


module.exports = {
  hashPassword,
  comparePassword
};
