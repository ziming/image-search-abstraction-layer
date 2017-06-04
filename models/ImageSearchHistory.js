const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const imageSearchHistorySchema = new mongoose.Schema({
    
    term: {
        type: String,
        required: 'Please enter a valid url!'
        
    },
    
    when: {
        type: Date,
        default: Date.now
    },
    
});

if (!imageSearchHistorySchema.options.toJSON) imageSearchHistorySchema.options.toJSON = {};

// doc The mongoose document which is being converted
// ret The plain object representation which has been converted
// options The options in use (either schema options or the options passed inline)

imageSearchHistorySchema.options.toJSON.transform = (doc, ret, options) => {
  // remove the _id of every document before returning the result
  delete ret._id;
  delete ret.__v
  return ret;
}

module.exports = mongoose.model('ImageSearchHistory', imageSearchHistorySchema);