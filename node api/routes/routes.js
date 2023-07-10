const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const auth = require("../middlewares/auth");
const productController = require("../controllers/productController");
const upload = require("../common/imageupload");


router.get("/upload", authController.test);
router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.post("/logout", auth.authorized, authController.logout);

// product releated routes..

router.post(
  "/product/addProduct",
  auth.authorized,
  upload.single("file"),
  productController.addProduct
);

router.post(
  "/product/editProduct/:productId",
  auth.authorized,
  upload.single("file"),
  productController.editProduct
);

router.post(
  "/product/deleteProduct",
  auth.authorized,
  productController.deleteProduct
);

router.post(
  "/product/fetchProducts",
  auth.authorized,
  productController.fetchProducts
);

router.post("/product/:id", auth.authorized, productController.productbyId);

// order related routes.


module.exports = router;
