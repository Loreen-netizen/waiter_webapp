let waiterFacFunRoutes = function(waiterFacFun) {

    let flashMessages = async function(req, res) {

        try {
            let name = req.params.username;
            if (!name) {
                (req.flash('name', 'please enter name in URL e.g. /waiters/YOUR NAME'))
            };
            res.render("index")
        } catch (error) {
            console.log(error)
        }
    };

    let storeUserAndShifts = async function(req, res) {
        try {
            let name = req.params.username;
            let theName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
            let days = req.body.selectedDays;
            let storeUserShifts = await waiterFacFun.storeShifts(theName, days);
            req.flash('shifts', 'success!! shifts submitted')
            if (storeUserShifts === false) {
                req.flash('err', 'Please enter username in URL and select days');

                res.render("index")
            } else {
                res.render("successRoute", {
                    theName,
                    days,
                })
            }


        } catch (error) {
            console.log(error)
        }

    };

    let verifyGreetStoreWaiter = async function(req, res) {
        let theName = await req.params.username;
        let name = theName.charAt(0).toUpperCase() + theName.slice(1).toLowerCase();
        let daysObj = await waiterFacFun.daysObject(name);
        let greet = await waiterFacFun.greetUser(name)
        let data = {
            verify: await waiterFacFun.verifyUser(name),
            storeUserDetails: await waiterFacFun.storeDetails(name),
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
    };



    let daysRoute = async function(req, res) {

        try {
            let allShifts = await waiterFacFun.daysObject();
            res.render("days", {
                allShifts
            })
        } catch (error) {
            console.log(error)
        }
    };

    let resetDb = async function(req, res) {
        try {
            let resetDb = await waiterFacFun.clearAllShifts();
            res.render("days", {
                resetDb
            })
        } catch (error) {
            console.log(error)
        }
    }

    return {
        flashMessages,
        storeUserAndShifts,
        verifyGreetStoreWaiter,
        daysRoute,
        resetDb
    }
};

module.exports = waiterFacFunRoutes;