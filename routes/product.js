var express = require("express");
var productController = require("../controllers/product");
var multer = require("multer");

var router = express.Router();

//multer proccess
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jfif"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const uploads = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

const type = uploads.single("image");

//for post product
router.post("/", type, productController.createProduct);

//for getting products
router.get("/", productController.getallProducts);

//for getting single product
router.get("/:id", productController.getsingleProduct);

//edit product
router.put("/:id", type, productController.editProduct);

//delete product
router.delete("/:id", productController.deleteProduct);

module.exports = router;
