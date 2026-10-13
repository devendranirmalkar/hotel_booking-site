const express = require('express');
const router = express.Router({mergeParams: true});
const wrapAsync = require("../../utile/wrapAsync.js");
const ExpressError = require("../../utile/ExpressError.js");
const {reviewSchema} = require("../../schema.js");
const Review = require('../review.js');
const Listing = require('../listing.js');
const {isLoggedIn, isReviewAuthor} = require("../../views/users/middleware.js");
const reviewController = require('../routes/controllers/reviews.js');


const validateReview = (req,res,next) => {
    let{error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el )=> el.message).join(",");
        throw new ExpressError(400,errMsg);
    } else {
        next();
    }
};

 // Reviews
    //post route

    router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

    // delete route

    router.delete(
        "/:reviewId",
        isLoggedIn,
        isReviewAuthor,
        wrapAsync(reviewController.deleteReview)
    );

    module.exports = router;