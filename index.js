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

    let create = await req.body.createAccount;
    let signIn = await req.body.sign;
    let name = await req.body.userName;
    console.log({ name });
    let userPassword = await req.body.userPassword;
    console.log({ userPassword })
    let verify = await waiterFacFun.verifyUser(name, userPassword)

    console.log({ signIn });
    console.log({ verify });

    try {

        if (create) {
            console.log("createSelected");
            let storeDetails = await waiterFacFun.storeDetails(name, userPassword);

            req.flash('info', 'success!! account created')
            res.render("index", {
                storeDetails
            })
        } else if ((signIn) && (verify >= 1)) {
            console.log("signinselected")
            let signInUser = await waiterFacFun.signInUser(name);
            req.flash('info', 'log in successful!!')

            res.render("index", {
                signInUser
            })
        } else if ((!signIn) && (!create)) {
            res.render("loginRoute")
        }
    } catch (error) {
        console.log(error)
    }
});
let PORT = process.env.PORT || 3000;

app.listen(PORT, function() {
        console.log("App starting on port", PORT)
    })
    //     if (storeDays === "null values") {
    //         req.flash('info', 'SUCCESSFULLY added shifts!!')
    //     }
    //     res.render("successRoute")
    // } catch (error) {
    //     console.log(error)
    // }

// })
// app.post("daysObject", async function(req, res) {
//     let daysObj = await waiterFacFun.daysObject();
//     res.render("index", {
//         daysObj
//     })

// });
// SUCCESS MESSAGE
// if (storeDays === "null values") {
//     req.flash('info', 'SUCCESSFULLY added shifts!!')
// }
// res.render("successRoute")
// } catch (error) {
// console.log(error)
// }

// })

// SUCCESS MESSAGE