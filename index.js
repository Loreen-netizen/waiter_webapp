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
    let daysObj = await waiterFacFun.daysObject();
    res.render("index", {
        daysObj
    })
});
app.get("/back", async function(req, res) {
    let daysObj = await waiterFacFun.daysObject();
    res.render("index", {
        daysObj
    })
});

app.post("/waiters/:username", async function(req, res) {
    req.flash('shifts', 'success!! shifts submitted')
    let name = req.params.username;
    console.log({ name })
    let getShifts = await waiterFacFun.getUserShifts(name);
    console.log({
        getShifts
    });
    let daysSelected = req.body.selectedDays;
    console.log(daysSelected);
    console.log({ daysSelected });

    let storeUserShifts = await waiterFacFun.storeShifts(name, daysSelected)
    console.log(daysSelected);
    // let shifts = {
    //     day: await daysSelected,
    //     name: await name
    // }
    res.render("successRoute", {
        name,
        daysSelected,
        storeUserShifts

    })
});
app.get("/waiters/:username", async function(req, res) {
    let name = await req.params.username;
    let daysObj = await waiterFacFun.daysObject();

    let data = {
        verify: await waiterFacFun.verifyUser(name),
        // waiterShifts: await waiterFacFun.getUserShifts(name),
        storeUserDetails: await waiterFacFun.storeDetails(name),
    };
    try {

        res.render("index", {
            waiterShifts: data.storeUserDetails,
            daysObj,
            name
        })
    } catch (error) {
        console.log(error)
    }
});
app.get("/days", async function(req, res) {
    let allShifts = await waiterFacFun.getAllShifts();
    console.log({ allShifts });
    res.render("days", {
        allShifts,
        name
    })
});

let PORT = process.env.PORT || 3000
app.listen(PORT, function() {
    console.log("App starting on port", PORT)
})