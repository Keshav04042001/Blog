var express        =   require("express"),
    app            =   express(),
    bodyparser     =   require("body-parser"),
    mongoose       =   require("mongoose"),
expresssanitizer   =  require("express-sanitizer"),
    override       =   require("method-override");
// App Config
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended:true}));
app.use(expresssanitizer());
app.use(override("_method"));
mongoose.connect('mongodb://localhost:27017/blog_app', {useNewUrlParser: true, useUnifiedTopology: true});

// Our Blog will have 
// title
// image
// body
// date

// mongoose/model config
var blogSchema = new mongoose.Schema({
    title:    String,
    image:   String,
    body:   String,  // can also do same for image like if user don't insert image then ==> {type:String,default:"placeholder.jpg"
    created: {type:Date,default:Date.now}   // here we specify that type of data is date but that date is the date on which post created by user
});

// Add compiler into that module
var blog = mongoose.model("blog",blogSchema);

// create this once the comment out so that every time don't generated
/*blog.create({
    title:"My First Blog",
    image:"https://images.unsplash.com/photo-1432821596592-e2c18b78144f?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80",
    body:"How to learn nodejs.So today we are going to learn a beautiful technology,which is mostly used for web development for backend,it's the most popular now a days,also on today hahaha!. Yup so let's go further,and start learning Nodejs.That is basically js,that we have been learnt earlier so my first question is what is Nodejs?.......so on"
});

*/
// Routes
//1. Index -- Get -- List
app.get("/",function(req, res) {
    res.redirect("/blog");
});
app.get("/blog",function(req,res){
    blog.find({},function(err,blog){
        if(err){
            console.log(err)
        }
        else{
            res.render("index",{blog:blog});     
        }
    });
});

// create route
app.post("/blog",function(req,res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    blog.create(req.body.blog,function(err,newBlog){
        if(err){
          console.log(err);
        }
        else{
            res.redirect("/blog");
        }
    });
});
app.get("/blog/new",function(req, res) {
    blog.find({},function(err,blog){
                 if(err){
                     console.log(err);
                 }
                 else{
                     res.render("new");
                 }
    });
});
app.get("/blog/:id",function(req, res) {
    var id = req.params.id;
    blog.findById(id,function(err,foundBlog){
        if(err){
            res.redirect("/blog");
        }else{
            res.render("show",{blog:foundBlog});
        }
    })
    
    //res.render("show",{id:id});
});
app.get("/blog/:id/edit",function(req, res) {
    blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            console.log(err);
        }
        else{
            res.render("edit",{blog:foundBlog});
        }
    });
    //res.send("Edit form");
});
mongoose.set('useFindAndModify', false);
app.put("/blog/:id",function(req,res){
    blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updateBlog){
        if(err){
            res.redirect("/blog");
        }
        else{
             res.redirect("/blog/"+req.params.id);
        }
    })
});
app.delete("/blog/:id",function(req,res){
    blog.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/blog");
        }
        else{
            res.redirect("/blog");
        }
    });
});
app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Server started");
});