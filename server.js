const express = require('express');
const GoogleImages = require('google-images');
const mongoose = require('mongoose');

// import environmental variables from our variables.env file
require('dotenv').config({
    path: 'variables.env'
});

// Connect to our Database and handle an bad connections
mongoose.connect(process.env.DATABASE);
mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises
mongoose.connection.on('error', (err) => {
  console.error(`Error!! → ${err.message}`);
});

require('./models/ImageSearchHistory');

const ImageSearchHistory = mongoose.model('ImageSearchHistory');

const searchClient = new GoogleImages(process.env.CSE_ID, process.env.CUSTOM_SEARCH_API_KEY);

// create our Express app
const app = express();

app.get('/', (req, res) => {
    res.send('Follow instructions at https://www.freecodecamp.com/challenges/image-search-abstraction-layer');

});

// https://camper-api-project-ziming.c9users.io/api/latest/imagesearch
app.get('/api/latest/imagesearch', async (req, res) => {
    
    const imageSearchHistories = await ImageSearchHistory
        .find()
        .sort({when: 'desc'})
        .limit(10);
    
    res.json(imageSearchHistories);
    
});

// https://camper-api-project-ziming.c9users.io/api/imagesearch/lolcats%20funny
// https://camper-api-project-ziming.c9users.io/api/imagesearch/lolcats%20funny?offset=10
app.get('/api/imagesearch/:term', async(req, res) => {

    // wow %20 is automatically removed in req.params.term
    // console.log(req.params.term);
    // default ?offset=10
    
    // save search term to mongodb first
    // no await since we don't need to wait for the output
    ImageSearchHistory.create(req.params); // same as ImageSearchHistory.create({term: req.params.term});
    
    
    req.query.offset = req.query.offset || 1;

    const images = await searchClient.search(req.params.term, {page: req.query.offset });

    // assume images not null
    const resultJson = images.map((img) => {
        return {
            url: img.url,
            snippet: img.description,
            thumbnail: img.thumbnail.url,
            context: img.parentPage
        }
    });
    
    res.json(resultJson);

});



// To run your application run the command node server.js in your console.
// Cloud9 use port 8080
app.listen(process.env.PORT || 8080, function() {
    console.log('Image Search Abstraction Layer App started!')
});
