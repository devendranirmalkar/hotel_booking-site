const mongoose = require('mongoose');
const initdata = require('./data.js');
const Listing = require('../models/listing.js');

const mongoURI = 'mongodb://localhost:27017/wonderlust';

main()
 .then(() => console.log('Connected to MongoDB'))
 .catch(err => console.log(err));

async function main() {
    await mongoose.connect(mongoURI);
}

const initdb= async () => {
    await Listing.deleteMany({});
    initdata.data=initdata.data.map((obj) => ({
        ...obj,
        owner:"6ac38e52e7be16413ba0f12f"
    }));
    await Listing.insertMany(initdata.data);
    console.log('Database initialized with sample data');
};
initdb();