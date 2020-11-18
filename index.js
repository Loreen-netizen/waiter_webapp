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
let waiterFacFun = WaiterFacFun(pool);
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

app.get("/", async function(req, res) {
    // let daysObj = await waiterFacFun.daysObject();
    res.render("loginRoute")
});

app.post("/waiters/:username", async function(req, res) {

    let name = req.params.username;
    // console.log({ name });
    // let getShifts = await waiterFacFun.getUserShifts(name);
    let days = req.body.selectedDays;
    // console.log(req.body)
    // console.log({ days });
    let storeUserShifts = await waiterFacFun.storeShifts(name, days);
    req.flash('shifts', 'success!! shifts submitted')
        // console.log({
        //     storeUserShifts
        // });
    if (storeUserShifts === false) {
        req.flash('err', 'Please enter username and select days');

        res.render("index")
    } else {
        res.render("successRoute", {
            name,
            days
        })
    }

});
app.get("/waiters/:username", async function(req, res) {
    let name = await req.params.username;
    let daysObj = await waiterFacFun.daysObject(name);
    let greet = await waiterFacFun.greetUser(name)
    let data = {
        verify: await waiterFacFun.verifyUser(name),
        storeUserDetails: await waiterFacFun.storeDetails(name),
        // let getShifts = await waiterFacFun.getUserShifts(name);
    };
    try {

        res.render("index", {
            waiterShifts: data.storeUserDetails,
            daysObj,
            name,
            greet
        })
    } catch (error) {
        console.log(error)
    }
});
app.get("/days", async function(req, res) {
    let allShifts = await waiterFacFun.daysObject();
    let bg = { bg: await waiterFacFun.bgFunction() };
    console.log(bg);


    res.render("days", {
        allShifts,
        bg
    })
});
app.get("/reset", async function(req, res) {
    let resetDb = await waiterFacFun.clearAllShifts();
    res.render("loginRoute", {
        resetDb
    })
})

let PORT = process.env.PORT || 3000
app.listen(PORT, function() {
    console.log("App starting on port", PORT)
})