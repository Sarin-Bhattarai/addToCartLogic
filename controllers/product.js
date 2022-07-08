var Product = require("../models/product");

module.exports = {
  createProduct: async (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        status: "Fail",
        data: { image: "No file selected" },
      });
    }
    try {
      const productDetails = {
        name: req.body.name,
        price: req.body.price,
        image: req.file.path,
      };
      const product = new Product(productDetails);
      const result = await product.save();
      return res.json({
        status: "Success",
        data: { product: result },
      });
    } catch (ex) {
      return res.json({ status: "Error", message: ex.message });
    }
  },

  getallProducts: async (req, res) => {
    try {
      const products = await Product.find();
      return res.json(products);
    } catch (ex) {
      return res.json({ status: "Error", message: ex.message });
    }
  },

  getsingleProduct: async (req, res) => {
    try {
      const productId = req.params.id;
      const products = await Product.findById(productId);
      return res.json(products);
    } catch (ex) {
      return res.json({ status: "Error", message: ex.message });
    }
  },

  editProduct: async (req, res) => {
    try {
      const productId = req.params.id;
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }
      const updatedProduct = await Product.findByIdAndUpdate(productId, {
        ...req.body,
      });
      return res.json(updatedProduct);
    } catch (ex) {
      return res.json({ status: "Error", message: ex.message });
    }
  },

  deleteProduct: async (req, res) => {
    try {
      const productId = req.params.id;
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }
      await Product.deleteOne({ _id: productId });
      return res.json({ status: "sucess", message: "Product deleted" });
    } catch (ex) {
      return res.json({ status: "Error", message: ex.message });
    }
  },
};
