const { userRoles, pubRoles } = require("../constants/users");

exports.users = [
  {
    username: "kitchenfan91",
    email: "felicia.calming@gmail.com",
    password: "banan",
    role: userRoles.ADMIN,
    created_at: "2023-02-23",
  },

  {
    username: "cornylover_92",
    email: "adam.danielsson@gmail.com",
    password: "banan",
    role: userRoles.USER,
    created_at: "2023-02-24",
  },
  {
    username: "strangbang2",
    email: "johan.strang@gmail.com",
    password: "banan",
    role: userRoles.USER,
    created_at: "2023-02-25",
  },
  {
    username: "homeburntboy93",
    email: "per.berge@gmail.com",
    password: "banan",
    role: userRoles.USER,
    created_at: "2023-02-28",
  },
  {
    username: "rbvatklosterallweek",
    email: "max.karlsson@gmail.com",
    password: "banan",
    role: userRoles.USER,
    created_at: "2023-02-28",
  },
];
