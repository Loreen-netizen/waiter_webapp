let waiterFacFun = function(pool) {
    let daysObject = async function() {
        let daysObjectQuery = await pool.query(`select name from days`);
        // console.log(daysObjectQuery.rows)
        return daysObjectQuery.rows;
    }
    let storeDetails = async function(userName) {
        let isUser = await verifyUser();
        console.log(isUser)
        if (isUser != 1) {

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

    let getNameId = async function(waiterName) {
        let getNameIdQuery = await pool.query(`SELECT (id) FROM waiters WHERE name = ($1)`, [waiterName]);
        console.log(getNameIdQuery.rows[0].id);

        return getNameIdQuery.rows[0].id;
    }
    let getUserShifts = async function(userName) {
        let id = getNameId(userName);
        let getShiftsQuery = await pool.query(`SELECT (waiter_id,day_id) FROM shifts WHERE waiter_id = ($1)`, [id]);
        return getShiftsQuery.rows;
    }

    let getDayId = async function(daysSelected) {
        let getDayIdQuery = await pool.query(`SELECT (id) FROM days WHERE name = ($1)`, [daysSelected]);
        console.log(getDayIdQuery.rows[0].id);
        return getDayIdQuery.rows[0].id;
    }

    let storeShifts = async function(waiterName, daysSelected) {
        // let storeDet = await storeDetails(waiterName);
        // console.log(daysSelected);
        let daysObj = await daysObject();
        let waiterId = await getNameId(waiterName);
        for (const day of daysObj) {
            // console.log(day.name)

            for (const workday of daysSelected) {

                if (day.name === workday) {
                    var dayId = await getDayId(workday);
                    console.log(dayId);
                    let storeShiftsQuery = await pool.query('INSERT INTO shifts (waiter_id, day_id) VALUES ($1, $2)', [waiterId, dayId]);

                }
            }
        }
        // let isUser = await verifyUser();
        // console.log(
        //     isUser
        // );

        // if (isUser != 1) {

        //     let dayId = await getDayId(daysSelected);
        //     console.log({
        //         dayId
        //     })

        // console.log(daysObj);
        // let storeShiftsQuery = await pool.query('INSERT INTO shifts (waiter_id, day_id) VALUES ($1, $2)', [waiterId, dayId]);
        // storeShiftsQuery;
        // } else {
        //     console.log("usersaved ")
        // }
        // if ((!waiterName) && (!daysSelected)) {
        //     console.log("choose waiter && days")
        // }



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