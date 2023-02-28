const { userRoles, pubRoles } = require("../constants/users");

exports.users = [
  {
    email: "felicia.calming@gmail.com",
    password: "banan",
    role: userRoles.ADMIN,
  },

  {
    email: "adam.danielsson@gmail.com",
    password: "banan",
    role: userRoles.USER,
  },
  {
    email: "johan.strang@gmail.com",
    password: "banan",
    role: userRoles.USER,
  },
  {
    email: "per.berge@gmail.com",
    password: "banan",
    role: userRoles.USER,
  },
];
