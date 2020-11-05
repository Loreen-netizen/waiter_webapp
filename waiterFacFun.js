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
            let storeDetailsQuery = await pool.query('INSERT INTO users (user_name, user_password) VALUES ($1, $2)', [userName, userPassword]);
            storeDetailsQuery;
            console.log("stored")
        }
    }

    let verifyUser = async function(userName, userPassword) {
        try {
            var verifyUserQuery = await pool.query(`SELECT (user_name, user_password) FROM users WHERE user_name=($1) AND user_password=($2)`, [userName, userPassword]);

            if (!verifyUserQuery) {
                return null
            } else { return verifyUserQuery.rows };
        } catch (error) {
            console.log(error)
        }


    };

    let getUserShifts = async function(userName) {
        let getShiftsQuery = await pool.query(`SELECT (waiter_name,days_selected) FROM shifts WHERE waiter_name = ($1)`, [userName]);
        return (getShiftsQuery.rows)
    }

    let signInUser = async function(userName) {
        let signInUserQuery = await pool.query(`SELECT (waiter_name,days_selected) FROM shifts WHERE waiter_name = ($1)`, [userName]);
        return (signInUserQuery.rows)
    }

    let storeShifts = async function(waiterName, daysSelected) {
        if ((!waiterName) && (!daysSelected)) {
            console.log("null values")
        } else {
            let storeShiftsQuery = await pool.query('INSERT INTO shifts (waiter_name, days_selected) VALUES ($1, $2)', [waiterName, daysSelected]);
            storeShiftsQuery;
        }

    }

    return {
        daysObject,
        storeDetails,
        verifyUser,
        getUserShifts,
        signInUser,
        storeShifts
    }
}

module.exports = waiterFacFun;