const express = require('express');
const router = express.Router();
const {listingSchema,reviewSchema} = require("../../schema.js");
const Listing = require('../listing');
const wrapAsync = require("../../utile/wrapAsync.js");
const{isLoggedIn,isOwner} = require("../../views/users/middleware.js");
const listingController = require('../routes/controllers/listings.js');
const multer = require('multer');
const {storage} = require("../../cloudConfig.js");
const upload = multer({storage });
 

router.route('/')
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn,
      upload .single("listing[images]"), 
      wrapAsync(listingController.createListing));
// new route
router.get('/new', isLoggedIn, wrapAsync(listingController.renderNewForm));



router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn,isOwner,upload .single("listing[images]"), wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

 // edit route
router.get('/:id/edit', isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm) );

module.exports = router;