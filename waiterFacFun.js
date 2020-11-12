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
        console.log({
            daysSelected
        });
        console.log({
            waiterName
        });

        let daysObj = await daysObject();
        let waiterId = await getNameId(waiterName);
        for (const day of daysObj) {
            // console.log(day.name)
            if ((waiterName === ":username") || (daysSelected === undefined)) {
                return (false)
            } else {
                for (const workday of daysSelected) {

                    if (day.name === workday) {
                        var dayId = await getDayId(workday);
                        console.log(dayId);
                        let storeShiftsQuery = await pool.query('INSERT INTO shifts (waiter_id, day_id) VALUES ($1, $2)', [waiterId, dayId]);

                    }
                }
            }

        }
    }

    let joinTables = async function() {

            let joinTablesQuery = await pool.query(`SELECT days.name 
                AS day, waiters.name
                 AS waiter 
                 FROM days 
                 INNER JOIN shifts 
                 ON  days.id = shifts.day_id 
                 INNER JOIN  waiters 
                 ON  shifts.waiter_id = waiters.id`)
            console.log(joinTablesQuery.rows);
            return joinTablesQuery.rows;

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
    //




    let getAllShifts = async function() {
        let allShiftsQuery = await pool.query(`SELECT * FROM shifts`);
        return allShiftsQuery.rows;
    }

    let greetUser = async function(name) {
        if (name != ":username") {
            var greet = await ("Hi " + name + "! get started by picking your shifts for the week");
            return greet;
        }

    }
    return {
        daysObject,
        storeDetails,
        verifyUser,
        getNameId,
        getDayId,
        getAllShifts,
        storeShifts,
        getUserShifts,
        greetUser,
        joinTables

    }
}
module.exports = waiterFacFun;