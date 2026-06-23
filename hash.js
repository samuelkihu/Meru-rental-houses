const bcrypt = require("bcryptjs");

const password = "samuelkihu699."; // change this
bcrypt.hash(password, 10).then((hash) => console.log(hash));