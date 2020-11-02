let waiterFacFun = function(pool) {


    let daysObject = async function() {
        let daysObjectQuery = await pool.query(`select days from days_table`);
        console.log(daysObjectQuery.rows)
        return daysObjectQuery.rows;
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
        storeShifts
    }
}

module.exports = waiterFacFun;