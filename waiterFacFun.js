let waiterFacFun = function(pool) {


    let daysObject = async function() {
        let daysObjectQuery = await pool.query(`select days from days_table`);
        console.log(daysObjectQuery.rows)
        return daysObjectQuery.rows;
    }

    let storeDetails = async function(userName, userPassword) {
        if (userName === "Admin") {
            return "Admin"
        } else {
            let storeDetailsQuery = await pool.query('INSERT INTO users (user_name, user_password) VALUES ($1, $2)' [userName], [userPassword]);
            storeShiftsQuery;
        }
    }

    let verifyUser = async function(userName, userPassword) {
        let verifyUserQuery = await pool.query(`SELECT (user_name, user_password) FROM users WHERE password= ($1, $2)` [userName], [userPassword]);
        console.log(verifyUserQuery.rows)
        return verifyUserQuery.rows;
    }

    let signInUser = async function(userName) {
        let signInUserQuery = await pool.query(`SELECT shifts * FROM shifts WHERE waiter_name = ($1)` [userName]);
        console.log({ signInUserQuery })
    }

    let storeShifts = async function(waiterName, daysSelected) {
        if ((!waiterName) && (!daysSelected)) {
            console.log("null values")
            return "null values"
        } else {
            let storeShiftsQuery = await pool.query('INSERT INTO shifts (waiter_name, days_selected) VALUES ($1, $2)' [waiterName], [daysSelected]);
            storeShiftsQuery;
        }

    }

    return {
        daysObject,
        storeDetails,
        verifyUser,
        signInUser,
        storeShifts
    }
}

module.exports = waiterFacFun;