var WaiterFacFun = require("../waiterFacFun");
let assert = require("assert");
let pg = require("pg");
let Pool = pg.Pool;
let connectionString = process.env.DATABASE_URL || 'postgresql://loreen:pg123@localhost:5432/test_waiter_webapp';
let pool = new Pool({
    connectionString
});


describe("waiterFacFun", async function() {
    beforeEach(async function() {
        await pool.query(``)
    })

    it("should return days as an object from the database", async function() {
        //assemble
        var waiterFacFun = await WaiterFacFun(pool);
        //act
        let getDays = await waiterFacFun.daysObject()
            //assert
        assert.deepEqual([
            { days: 'Monday' },
            { days: 'Tuesday' },
            { days: 'Wednesday' },
            { days: 'Thursday' },
            { days: 'Friday' },
            { days: 'Saturday' },
            { days: 'Sunday' }
        ], getDays);

    });


    after(async function() {
        await pool.end();
    })


});