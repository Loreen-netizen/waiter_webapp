let waiterFacFun = function(pool) {
    let daysObject = async function() {
        let daysObjectQuery = await pool.query(`select name from days`);
        console.log(daysObjectQuery.rows)
        return daysObjectQuery.rows;
    }
    let storeDetails = async function(userName) {

        let storeDetailsQuery = await pool.query('INSERT INTO waiters (name) VALUES ($1)', [userName]);
        storeDetailsQuery;
        console.log("stored")

    }
    let verifyUser = async function(userName) {
        try {
            var verifyUserQuery = await pool.query(`SELECT (name) FROM waiters WHERE name=($1)`, [userName]);

            if (!verifyUserQuery) {
                return null
            } else { return verifyUserQuery.rows };
        } catch (error) {
            console.log(error)
        }
    };
    let getUserShifts = async function(userName) {
        let getShiftsQuery = await pool.query(`SELECT (waiter_id,day_id) FROM shifts WHERE name = ($1)`, [userName]);
        return (getShiftsQuery.rows)
    }
    let getNameId = async function(waiterName) {
        let getNameIdQuery = await pool.query(`SELECT (id) FROM waiters WHERE name = ($1)`, [waiterName]);
        console.log(getNameIdQuery.rows)
        return getNameIdQuery.rows
    }

    let getDayId = async function(daysSelected) {
        let getDayIdQuery = await pool.query(`SELECT (id) FROM days WHERE name = ($1)`, [daysSelected]);
        return getDayIdQuery.rows
    }
    let storeShifts = async function(waiterName, daysSelected) {
        let waiterId = getNameId(waiterName);
        let dayId = getDayId(daysSelected);
        if ((!waiterName) && (!daysSelected)) {
            console.log("null values")
        } else {
            let storeShiftsQuery = await pool.query('INSERT INTO shifts (waiter_id, day_id) VALUES ($1, $2)', [waiterId, dayId]);
            storeShiftsQuery;
        }
    }
    let getAllShifts = async function() {
        let allShiftsQuery = await pool.query(`SELECT * FROM shifts`);
        return allShiftsQuery.rows;
    }
    return {
        daysObject,
        storeDetails,
        verifyUser,
        getNameId,
        getDayId,
        getAllShifts,
        storeShifts,
        getUserShifts

    }
}
module.exports = waiterFacFun;