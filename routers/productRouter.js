const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const isLoggedIn = require("../functions/isLoggedin");
const mongoose = require("mongoose");
const upload = require("../functions/uploader");
const fs = require("fs");

/* Get all product infromation*/

router.get("/all", (req, res) => {
  // console.log("uuid: ", global[uuid]);
  Product.find()
    .sort({ date: -1 })
    .then(products => res.json(products));
});
// Add a new product
router.post("/", upload.array("images"), (req, res) => {
  //console.log("reg: ", req);
  var filePaths = req.files.map(file =>
    file.path.replace(new RegExp("\\\\", "g"), "/")
  );
  // console.log(filePaths);
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    type: req.body.type,
    description: req.body.description,
    images: filePaths
  });
  product
    .save()
    .then(result => {
      // console.log(result);
      const newProduct = {
        createdProduct: {
          _id: result._id,
          name: result.name,
          description: result.description,
          images: result.images
        }
      };
      io.sockets.emit("new product", newProduct);
      res.status(201).json({
        message: "created product successfully",
        newProduct
      });
    })
    .catch(err => {
      // console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

//Update a product
router.patch("/:id", (req, res) => {
  //console.log(req);
  Product.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
    .then(result => {
      io.sockets.emit("update product", result);
      res.status(200).json({ code: 0, message: "update product successfully" });
    })
    .catch(err =>
      res.status(500).json({
        error: err
      })
    );
});

//Delete a product
router.delete("/:id", (req, res) => {
  let filePaths = [];
  Product.findByIdAndDelete(req.params.id)
    .then(result => {
      //get image file paths
      filePaths = result.images;
      //remove the related image files
      filePaths.forEach(filePath => {
        try {
          fs.unlinkSync(filePath);
        } catch (err) {
          console.log(err);
        }
      });
      io.sockets.emit("delete product", result);
      res.status(200).json({ code: 0, message: "delete product successfully" });
    })
    .catch(err =>
      res.status(500).json({
        error: err
      })
    );
});
module.exports = router;
