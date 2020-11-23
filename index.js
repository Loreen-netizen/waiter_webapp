let express = require("express");
let handlebars = require("express-handlebars");
let session = require("express-session");
let flash = require('express-flash');

let pg = require("pg");
let Pool = pg.Pool;
let connectionString = process.env.DATABASE_URL || 'postgresql://loreen:pg123@localhost:5432/waiter_webapp';
let pool = new Pool({
    connectionString
});
let WaiterFacFun = require("./waiterFacFun.js");
let WaiterRoutes = require("./routes.js");
let waiterFacFun = WaiterFacFun(pool);
let waiterRoutes = WaiterRoutes(waiterFacFun);
let bodyParser = require("body-parser")
let app = express();

app.engine('handlebars', handlebars({ layoutsDir: "./views/layouts" }));
app.set('view engine', 'handlebars');

app.use(session({
    secret: 'the expre$$ fl@sh string',
    resave: false,
    saveUninitialized: true
}));
app.use(flash());

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.get("/addFlash", function(req, res) {
    try {
        req.flash('success', 'flash Message added')
        res.redirect('/')
    } catch (error) {
        console.log(error)
    }
});

app.get("/", waiterRoutes.flashMessages);

app.post("/waiters/:username", waiterRoutes.storeUserAndShifts);


app.get("/waiters/:username", waiterRoutes.verifyGreetStoreWaiter);
app.get("/days", waiterRoutes.daysRoute);
app.get("/reset", waiterRoutes.resetDb);

let PORT = process.env.PORT || 3000
app.listen(PORT, function() {
    console.log("App starting on port", PORT)
})