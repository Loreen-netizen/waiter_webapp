let waiterFacFun = function(pool) {
    let daysObject = async function() {
        let daysObjectQuery = await pool.query(`select name from days`);
        // console.log(daysObjectQuery.rows)
        const results = daysObjectQuery.rows;
        const joined = await joinTables();
        results.forEach((day) => {
            day.waiters = [];
            joined.forEach((waiter) => {
                if (waiter.day === day.name) {
                    day.waiters.push(waiter)
                }

                if (day.waiters.length >= 3) {
                    day.color = 'red';
                    day.disabled = 'disabled'
                }
            })

        });

        return results

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
        console.log({ waiterId })
        for (const day of daysObj) {
            // console.log(day.name)
            if ((waiterName === ":username") || (daysSelected === undefined)) {
                return (false)
            } else {
                for (const workday of daysSelected) {

                    if (day.name === workday) {
                        var dayId = await getDayId(workday);
                        console.log({
                            dayId
                        });
                        console.log("yeu")
                        let storeShiftsQuery = await pool.query('INSERT INTO shifts (waiter_id, day_id) VALUES ($1, $2)', [waiterId, dayId]);

                    }
                }
            }

        }
    }

    let joinTables = async function() {

        let joinTablesQuery = await pool.query(`SELECT  waiters.name 
                AS waiter, days.name
                 AS day 
                 FROM waiters 
                 INNER JOIN  (SELECT DISTINCT day_id AS id, waiter_id AS waiter FROM shifts) AS shiftsTbl
                 ON  waiters.id = shiftsTbl.waiter 
                 INNER JOIN days 
                 ON shiftsTbl.id = days.id 
                 ORDER BY days.id
                 `)
            // let days = await daysObject();
            // console.log({ w: joinTablesQuery.rows, days });



        return joinTablesQuery.rows;

    }

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