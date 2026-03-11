const registerUser = async (req, res) => {
  res.send('Register route');
};

const loginUser = async (req, res) => {
  res.send('Login route');
};

module.exports = {
  registerUser,
  loginUser,
};
