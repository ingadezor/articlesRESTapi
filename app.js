const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');



const app = express();
//middleware
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));




//-----Mongoose----------------------------------
mongoose.connect('mongodb+srv://inga:inga@cluster0.lmpix.mongodb.net/wikiDB?retryWrites=true&w=majority', {useNewUrlParser: true}, function(){console.log('Connected to mongoDB Atlas')});

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model('Article', articleSchema); //Articles collection
//----------------------------------------------0





//ROUTES
//1 Working with many documents
app.route('/articles')
    .get(function(req, res){   //getting all the articles
        Article.find(function(err, articles){
            if(!err) res.send(articles);
        })
    })

    .post(function(req, res){  //adding an article
        let newArticle = new Article({
                    title:req.body.title,
                    content: req.body.content
                })
            
        newArticle.save(function(err){
            if(!err) res.send('Added new article successfully');
            else res.send(err);
        });
    })

    .delete(function(req, res){  //deleting all the articles
        Article.deleteMany(function(err){
                    if(!err) res.send('Deleted all articles')
                    else res.send(err);
                })
});



// //fetch all the articles
// app.get('/articles', function(req, res){
//     
//         Article.find(function(err, articles){
//             res.send(articles);
//         })
//     
// })
    

// //posting a new article
// app.post('/articles', function(req, res){
//     let newArticle = new Article({
//         title:req.body.title,
//         content: req.body.content
//     })

//     newArticle.save(function(err){
//         if(!err) res.send('Added new article successfully');
//         else res.send(err);
//     });
// })


// //deleting all articles
// app.delete('/articles', function(req, res){
//     Article.deleteMany(function(err){
//         if(!err) res.send('Deleted all articles')
//         else res.send(err);
//     })
// })




//2. Working with one document
app.route('/articles/:articleTitle')
    .get(function(req, res){ //getting a custom article 
        let articleTitle = req.params.articleTitle;

        Article.findOne({title: articleTitle}, function(err, article){
            if(article) res.send(article.title +'<br>' + article.content)
            else if (err) res.send(err)
            else res.send('No such article')
        })
    })

    
    .put(function(req, res){ //update an article
        let articleTitle = req.params.articleTitle;
        let articleNewContent = req.body.content;  //just like with post
        let articleNewTitle = req.body.title;

        Article.findOneAndUpdate({title: articleTitle}, {title: articleNewTitle, content: articleNewContent}, {overwrite: true}, function(err){
            res.send("Updated the article successfully")
        })
    })



    .patch(function(req, res){ //updating only yhe fields specified by user
        let articleTitle = req.params.articleTitle;

        Article.update({title: articleTitle}, {$set: req.body}, function(err){
            res.send("Updated the article successfully")
        })
    })


    .delete(function(req, res){
        let articleTitle = req.params.articleTitle;

        Article.deleteOne({title: articleTitle}, function(err){
            if(!err) console.log('Article deleted');
        })

    });







app.listen(3000, function(){
    console.log('Server is running');
})