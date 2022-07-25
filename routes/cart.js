var express = require("express");
var cartController = require("../controllers/cart");

var router = express.Router();

router.post("/", cartController.addItemToCart);

router.get("/", cartController.getCart);

router.delete("/", cartController.deleteCart);

module.exports = router;
