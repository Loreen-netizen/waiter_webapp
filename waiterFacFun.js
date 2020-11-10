let waiterFacFun = function(pool) {
    let daysObject = async function() {
        let daysObjectQuery = await pool.query(`select name from days`);
        console.log(daysObjectQuery.rows)
        return daysObjectQuery.rows;
    }
    let storeDetails = async function(userName) {
        let isUser = await verifyUser();
        console.log(isUser)
        if (isUser === []) {

            let storeDetailsQuery = await pool.query('INSERT INTO waiters (name) VALUES ($1)', [userName]);
            storeDetailsQuery;
            console.log("stored")

        }
    }
    let verifyUser = async function(userName) {
        try {
            var verifyUserQuery = await pool.query(`SELECT name FROM waiters WHERE name=($1)`, [userName]);
            console.log(verifyUserQuery.rows)
            return verifyUserQuery.rows
        } catch (error) {
            console.log(error)
        }
    };
    let getUserShifts = async function(userName) {
        let getShiftsQuery = await pool.query(`SELECT (waiter_id,day_id) FROM shifts WHERE name = ($1)`, [userName]);
        return getShiftsQuery.rows;
    }
    let getNameId = async function(waiterName) {
        let getNameIdQuery = await pool.query(`SELECT (id) FROM waiters WHERE name = ($1)`, [waiterName]);
        console.log(getNameIdQuery.rows[0].id);
        return getNameIdQuery.rows[0].id;
    }

    let getDayId = async function(daysSelected) {
        let getDayIdQuery = await pool.query(`SELECT (id) FROM days WHERE name = ($1)`, [daysSelected]);
        console.log(getDayIdQuery.rows[0].id);
        return getDayIdQuery.rows[0].id;
    }

    let storeShifts = async function(waiterName, daysSelected) {
        let isUser = verifyUser();
        if (isUser === []) {
            let waiterId = await getNameId(waiterName);
            let dayId = await getDayId(daysSelected);
            let storeShiftsQuery = await pool.query('INSERT INTO shifts (waiter_id, day_id, name) VALUES ($1, $2, $3)', [waiterId, dayId, waiterName]);
            storeShiftsQuery;
        } else if ((!waiterName) && (!daysSelected)) {
            console.log("choose waiter && days")
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