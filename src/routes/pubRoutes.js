const express = require("express");
const router = express.Router();
const { userRoles } = require("../constants/users");
const { isAuthenticated } = require("../middleware/authenticationMiddleware");

const { 
    getAllPubs,
    getPubById,
    createNewPub, 
    updatePub,
    deletePubById,
} = require("../controllers/pubControllers");

// GET All pubs /api/v1/pubs
router.get("/", getAllPubs);

// GET Pub by Id /api/v1/pubs/:pubid
router.get("/:pubid", getPubById);

// POST Create a new pub /api/v1/pubs/
router.get("/", isAuthenticated, createNewPub);

// PUT Update pub by Id /api/v1/pubs/:pubid
router.put("/:pubid", isAuthenticated, updatePub);

// DELETE pub by Id /api/v1/pubs/:pubid
router.delete("/:pubid", isAuthenticated, deletePubById);


module.exports = router;

