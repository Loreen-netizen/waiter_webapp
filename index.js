let express = require("express");
let handlebars = require("express-handlebars");
let session = require("express-session");
let bodyParser = require("body-parser")
let app = express();
let PORT = process.env.PORT || 3000;

app.engine('handlebars', handlebars({ layoutsDir: "./views/layouts" }));
app.set('view engine', 'handlebars');

app.use(session({
    secret: 'the expre$$ fl@sh string',
    resave: false,
    saveUninitialized: true
}));


app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());



app.get("/", function(req, res) {
    res.render("index")
})

app.listen(PORT, function() {
    console.log("App starting on port", PORT)
});