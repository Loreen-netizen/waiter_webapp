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
        await pool.query(`delete from users`)
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

    it("should be able to store values in the database", async function() {
        //assemble
        var waiterFacFun = await WaiterFacFun(pool);
        //act
        let storeInfo = await waiterFacFun.storeDetails('mimi', 'x34');

        // storeInfo;

        let verifyInfoQuery = await waiterFacFun.verifyUser('mimi', 'x34');
        //assert
        assert.deepEqual([{
            user_id: 1,
            user_name: 'mimi',
            user_password: 'x34'
        }], verifyInfoQuery);

    });


    after(async function() {
        await pool.end();
    })


});