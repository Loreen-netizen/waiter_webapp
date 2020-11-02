let waiterFacFun = function(pool) {


    let daysObject = async function() {
        let daysObjectQuery = await pool.query(`select days from days_table`);
        console.log(daysObjectQuery.rows)
        return daysObjectQuery.rows;
    }

    return {
        daysObject,
    }
}

module.exports = waiterFacFun;