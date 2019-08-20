var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
    
    headline: {
        type: String,
        require: true
    },

    url: {
        type: String,
        require: true
    },
    
    summary: {
        type: String,
        require: true
    },

    comment: {
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }
});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;