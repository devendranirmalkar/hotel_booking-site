require('dotenv').config(); 

const express = require('express');
const app = express();
const mongoose = require('mongoose');

const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');




const { required } = require('joi');
const session = require('express-session');
const MongoStore = require('connect-mongo');
console.log("MongoStore:", MongoStore);
console.log("MongoStore.create:", typeof MongoStore.create);
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');




const listingsRouter = require('./models/routes/listing.js');
const reviewsRouter = require('./models/routes/review.js');
const userRouter = require('./models/routes/user.js');
const dbUrl = process.env.ATLASDB_URL;

main()
 .then(() => console.log('Connected to MongoDB'))
 .catch(err => console.log(err));

async function main() {
    await mongoose.connect(dbUrl);
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, 'init/public')));

console.log("Secret loaded:", Boolean(process.env.SECRET));
console.log("Secret length:", process.env.SECRET?.length);

const store = MongoStore.create({
    mongoUrl:dbUrl,
    touchAfter:24*3600,
});



const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
};


 
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());   

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    next();
});


app.get('/demouser', async (req, res) => {
    let fakeUser = new User({
        username: 'bhiaram',
        email: 'bhiaram@example.com'
    });
    let registeredUser = await User.register(fakeUser, 'bhiaram');
    res.send(registeredUser);
});

app.get("/", (req, res) => {
    res.redirect("/listings");
});

app.use("/", userRouter);
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);




app.use((err, req, res, next)=>{
    console.log(err);
    res.send("something went wrong");
});

app.listen(8080, () => {
    console.log('Server is running on port 8080');
});