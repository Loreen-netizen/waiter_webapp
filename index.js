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
let PORT = process.env.PORT || 3000;

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
    res.render("loginRoute")
});

app.get("/waiters/:username", async function(req, res) {
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
})

app.get("/backtologin", async function(req, res) {
    let daysObj = await waiterFacFun.daysObject();
    res.render("loginRoute", {
        daysObj
    })
})

app.post("/waiters/:username", async function(req, res) {
        try {
            let waiterName = await req.session.waiterName;
            console.log(waiterName);
            let daysSelected = await req.session.selectedDays;
            console.log(daysSelected);
            // let daysObj = await waiterFacFun.daysObject();
            let storeDays = await waiterFacFun.storeShifts(waiterName, daysSelected);
            if (storeDays === "null values") {
                req.flash('info', 'SUCCESSFULLY added shifts!!')
            }
            res.render("successRoute")
        } catch (error) {
            console.log(error)
        }

    })
    // app.post("daysObject", async function(req, res) {
    //     let daysObj = await waiterFacFun.daysObject();
    //     res.render("index", {
    //         daysObj
    //     })

// });

app.listen(PORT, function() {
    console.log("App starting on port", PORT)
});