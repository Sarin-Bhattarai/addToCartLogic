var Cart = require("../models/cart");
var Product = require("../models/product");

module.exports = {
  addItemToCart: async (req, res) => {
    const { productId } = req.body;
    const quantity = Number.parseInt(req.body.quantity);

    try {
      let cart = await Cart.find();
      let productDetails = await Product.findById(productId);
      if (!productDetails) {
        return res.status(500).json({
          status: "Not found",
          message: "Invalid request",
        });
      }
      //If cart exist
      if (cart) {
        //check if index exits
        const indexFound = cart.items.findIndex(
          (item) => item.productId.id == productId
        );
        //This removes an item from the cart if the quantity is set to zero,
        //We can use this method to remove an item from the list.
        if (indexFound !== -1 && quantity <= 0) {
          cart.items.splice(indexFound, 1);
          if (cart.items.length == 0) {
            cart.subTotal = 0;
          } else {
            cart.subTotal = cart.items
              .map((item) => item.total)
              //The reduce() method executes a reducer function for array element.
              //The reduce() method returns a single value: the function's accumulated result.
              .reduce((acc, next) => acc + next);
          }
        }
        //check if product exist,just add the previous quantity with the new quantity and update the total price
        else if (indexFound !== -1) {
        }
      }
    } catch (ex) {
      return res.json({ status: "Error", message: ex.message });
    }
  },
};
