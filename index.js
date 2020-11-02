let express = require("express");
let handlebars = require("express-handlebars");
let session = require("express-session");

let pg = require("pg");
let Pool = pg.Pool;
let connectionString = process.env.DATABASE_URL || 'postgresql://loreen:pg123@localhost:5432/waiter_webapp';
let pool = new Pool({
    connectionString
});

let WaiterFacFun = require("./waiterFacFun.js");
let waiterFacFun = WaiterFacFun(pool);



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



app.get("/", async function(req, res) {
    var daysObj = await waiterFacFun.daysObject();
    res.render("index", {
        daysObj
    })
})

app.post("daysObject", function(req, res) {


});

app.listen(PORT, function() {
    console.log("App starting on port", PORT)
});