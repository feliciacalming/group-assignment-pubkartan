const { userRoles, pubRoles } = require("../constants/users");

exports.users = [
  {
    username: "felle",
    email: "felicia.calming@gmail.com",
    password: "banan",
    role: userRoles.ADMIN,
    created_at: "2023-02-23",
  },

  {
    username: "adam",
    email: "adam.danielsson@gmail.com",
    password: "banan",
    role: userRoles.USER,
    created_at: "2023-02-24",
  },
  {
    username: "johan",
    email: "johan.strang@gmail.com",
    password: "banan",
    role: userRoles.USER,
    created_at: "2023-02-25",
  },
  {
    username: "per",
    email: "per.berge@gmail.com",
    password: "banan",
    role: userRoles.USER,
    created_at: "2023-02-28",
  },
  {
    username: "max",
    email: "max.karlsson@gmail.com",
    password: "banan",
    role: userRoles.USER,
    created_at: "2023-02-28",
  },
];
