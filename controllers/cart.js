var cartRepository = require("../repository/cart");
var Product = require("../models/product");

module.exports = {
  addItemToCart: async (req, res) => {
    const { productId } = req.body;
    const quantity = Number.parseInt(req.body.quantity);

    try {
      let cart = await cartRepository.cart();
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
          cart.items[indexFound].quantity =
            cart.items[indexFound].quantity + quantity;
          cart.items[indexFound].total =
            cart.items[indexFound].quantity * productDetails.price;
          cart.items[indexFound].price = productDetails.price;
          cart.subTotal = cart.items
            .map((item) => item.total)
            .reduce((acc, next) => acc + next);
        }
        //----Check if Quantity is Greater than 0 then add item to items Array ----
        else if (quantity > 0) {
          cart.items.push({
            productId: productId,
            quantity: quantity,
            price: productDetails.price,
            total: parseInt(productDetails.price * quantity),
          });
          cart.subTotal = cart.items
            .map((item) => item.total)
            .reduce((acc, next) => acc + next);
        }
        //----if quantity of price is 0 throw the error -------
        else {
          return res.status(400).json({
            status: "Invalid",
            message: "Invalid request",
          });
        }
        let data = await cart.save();
        res.status(200).json({
          status: "Success",
          message: "Process successful",
          data: data,
        });
      }
      //---- if there is no user with a cart...it creates a new cart and then adds the item to the cart that has been created----
      else {
        const cartData = {
          items: [
            {
              productId: productId,
              quantity: quantity,
              total: parseInt(productDetails.price * quantity),
              price: productDetails.price,
            },
          ],
          subTotal: parseInt(productDetails.price * quantity),
        };
        cart = await cartRepository.addItem(cartData);
        res.json(cart);
      }
    } catch (ex) {
      return res.json({ status: "Error", message: ex.message });
    }
  },
};
