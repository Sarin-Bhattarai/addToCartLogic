var express = require("express");
var cartController = require("../controllers/cart");

var router = express.Router();

router.post("/", cartController.addItemToCart);

module.exports = router;
