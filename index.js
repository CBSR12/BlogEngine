var express = require('express');
var bodyParser = require('body-parser');
var fileSys = require('fs');
var util = require("./utility");
var _ = require("underscore");
var exphbs = require('express-handlebars');
var handlebars = exphbs.handlebars;
var moment = require('moment');
var marked = require('marked');
var app = express();
 
var info = util.loadInfo().blog_posts;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.engine('handlebars', exphbs({ defaultLayout: 'main', partialsDir: "views/partials/" }));
app.set('view engine', 'handlebars');
app.use('/public', express.static('public'));

app.get("/", (req, res) => {
    var tags = util.getTags(info);
    res.render('home', {
        data: info,
        tags: tags
    });
});

app.get("/create", (req, res) => {
    res.render('create');
});

app.post('/create',  (req, res) => {
    var body = req.body;
 
    body.tags = body.tags.split(" ");
    body.content = marked(body.content);

    body.preview = body.content.substring(0, 150);
    body.time = moment().format('MMMM Do YYYY, h:mm a');

    info.push(req.body);
    util.saved(info);
    res.redirect("/");
});

app.get('/post/:slug', (req, res) => {
    var _slug = req.params.slug;
    var blog_post = _.findWhere(info, { slug: _slug });
    if (!blog_post) return res.render('404');
    res.render('post', blog_post);
});

app.get('/tag/:tag', (req, res) => {
    var tags = util.getTags(info);
    var tag = req.params.tag;
    var posts = [];
    info.forEach((post) => {
        if (post.tags.includes(tag)) {
            posts.push(post);
        }
    });
    res.render('home', {
        tag: tag,
        data: posts,
        tags: tags
    });
});

app.listen(2004, () => {
    console.log('Server listening on port: 2004');
});
