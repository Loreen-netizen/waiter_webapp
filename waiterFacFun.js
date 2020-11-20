let waiterFacFun = function(pool) {
    let daysObject = async function(name) {
        let daysObjectQuery = await pool.query(`select name from days`);
        const weekDays = daysObjectQuery.rows;
        const shiftsAndWaiterDetails = await joinTables();
        weekDays.forEach(function(day) {
            day.waiters = [];
            shiftsAndWaiterDetails.forEach(function(waiter) {
                if (waiter.day === day.name) {
                    day.waiters.push(waiter);
                }
                if (day.waiters.length >= 1) {
                    day.color = "bg-warning"
                };
                if (day.waiters.length === 3) {
                    day.color = "bg-success"
                };
                if (day.waiters.length > 3) {
                    day.color = "bg-danger"
                };
            })
            shiftsAndWaiterDetails.forEach(function(waiter) {
                if ((waiter.waiter === name) && (waiter.day === day.name))
                    day.checked = "checked"
            });

        });

        return weekDays

    }

    let getDays = async function() {
        let daysObjectQuery = await pool.query(`select name from days`);
        return daysObjectQuery.rows;
    }


    let storeDetails = async function(userName) {
        let isUser = await verifyUser();
        if (isUser != 1) {

            let storeDetailsQuery = await pool.query('INSERT INTO waiters (name) VALUES ($1)', [userName]);
            storeDetailsQuery;
        }
    }
    let verifyUser = async function(userName) {
        try {
            var verifyUserQuery = await pool.query(`SELECT name FROM waiters WHERE name=($1)`, [userName]);
            return verifyUserQuery.rows
        } catch (error) {
            console.log(error)
        }
    };

    let getNameId = async function(waiterName) {
        let getNameIdQuery = await pool.query(`SELECT (id) FROM waiters WHERE name = ($1)`, [waiterName]);
        return getNameIdQuery.rows[0].id;
    }
    let getUserShifts = async function(id) {
        let getShiftsQuery = await pool.query(`SELECT (waiter_id,day_id) FROM shifts WHERE waiter_id = ($1)`, [id]);
        return getShiftsQuery.rows;
    }

    let getDayId = async function(daysSelected) {
        let getDayIdQuery = await pool.query(`SELECT (id) FROM days WHERE name = ($1)`, [daysSelected]);
        return getDayIdQuery.rows[0].id;
    }

    let storeShifts = async function(waiterName, daysSelected) {
        let daysObj = await daysObject();
        let waiterId = await getNameId(waiterName);
        let userSHifts = await getUserShifts(waiterId);
        console.log({ userSHifts });
        if (userSHifts !== []) await pool.query(`DELETE FROM shifts WHERE waiter_id = $1`, [waiterId]);

        for (const day of daysObj) {
            if (waiterName === ":username" || daysSelected === undefined) {
                return (false)
            } else {

                for (const workday of daysSelected) {

                    if (day.name === workday) {
                        var dayId = await getDayId(workday);
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

    let clearAllShifts = async function() {
        let clearAllShiftsQuery = await pool.query(`DELETE FROM shifts`);
        return clearAllShiftsQuery.rows;
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
        joinTables,
        getDays,
        clearAllShifts
    }
}
module.exports = waiterFacFun;