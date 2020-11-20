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
        await pool.query(`delete from shifts`);
        await pool.query(`delete from waiters`);


    })
    it("should return days as an object from the database", async function() {
        //assemble
        var waiterFacFun = await WaiterFacFun(pool);
        //act
        let getDays = await waiterFacFun.daysObject()
            //assert
        assert.deepEqual(
            [{
                    name: 'Monday',
                    waiters: []
                },
                {
                    name: 'Tuesday',
                    waiters: []
                },
                {
                    name: 'Wednesday',
                    waiters: []
                },
                {
                    name: 'Thursday',
                    waiters: []
                },
                {
                    name: 'Friday',
                    waiters: []
                },
                {
                    name: 'Saturday',
                    waiters: []
                },
                {
                    name: 'Sunday',
                    waiters: []
                }
            ], getDays);
    });
    it("should be able to store values in the database", async function() {
        //assemble
        var waiterFacFun = await WaiterFacFun(pool);
        //act
        let storeInfo = await waiterFacFun.storeDetails('mimi');

        // storeInfo;

        let verifyInfoQuery = await waiterFacFun.verifyUser('mimi');
        //assert
        assert.deepEqual([{
            name: 'mimi'
        }], verifyInfoQuery);

    });

    it("should be able to check if a user exists in the database", async function() {
        //assemble
        var waiterFacFun = await WaiterFacFun(pool);
        //act
        let storeInfo = await waiterFacFun.storeDetails('Lionel');

        // storeInfo;

        let verifyInfoQuery = await waiterFacFun.verifyUser('Lionel');
        //assert
        assert.deepEqual([{
            'name': 'Lionel'
        }], verifyInfoQuery);

    });

    it("should be able to get day ID from the database", async function() {
        //assemble
        var waiterFacFun = await WaiterFacFun(pool);
        //act
        let dayID = await waiterFacFun.getDayId('Tuesday');

        // storeInfo;

        //assert
        assert.equal(
            2, dayID);

    });

    it("should be able to get waiter ID from the database", async function() {
        //assemble
        var waiterFacFun = await WaiterFacFun(pool);
        //act
        let storeInfo = await waiterFacFun.storeDetails('Asanda');
        let nameID = await waiterFacFun.getNameId('Asanda');
        let testQuery = await pool.query(`SELECT (id) FROM waiters WHERE name = ($1)`, ['Asanda'])
            // storeInfo;

        //assert
        assert.equal(
            testQuery.rows[0].id, nameID);

    });

    it("should be able to join the shifts table to the waiters table", async function() {
        //assemble
        var waiterFacFun = await WaiterFacFun(pool);
        //act
        let dayID = await waiterFacFun.getDayId('Saturday');
        console.log({ dayID })
        let storeInfo = await waiterFacFun.storeDetails('Asanda');
        let waiterID = await waiterFacFun.getNameId('Asanda');
        let storeShifts = await pool.query(`INSERT INTO shifts (waiter_id, day_id) VALUES ($1, $2)`, [waiterID, dayID]);
        // storeInfo;
        let joinTheTables = await waiterFacFun.joinTables();
        //assert

        assert.deepEqual([{
                day: 'Saturday',
                waiter: 'Asanda'
            }],
            joinTheTables);

    });



    it("should be able to store all shifts selected by a user in the database", async function() {
        //assemble
        var waiterFacFun = await WaiterFacFun(pool);
        let storeUserDetails = await waiterFacFun.storeDetails('Titi');
        let waiterID = await waiterFacFun.getNameId('Titi');
        let dayID = await waiterFacFun.getDayId('Wednesday');
        console.log({ dayID })

        let storeShifts = await pool.query(`INSERT INTO shifts (waiter_id, day_id) VALUES ($1, $2)`, [waiterID, dayID]);

        //act


        let testGetShifts = await pool.query(`SELECT (waiter_id,day_id) FROM shifts WHERE waiter_id = ($1)`, [waiterID]);
        let getShifts = await waiterFacFun.getUserShifts(waiterID);

        //assert
        assert.deepEqual(getShifts, testGetShifts.rows);

    });

    it("should be able to greet a user", async function() {
        //assemble
        var waiterFacFun = await WaiterFacFun(pool);

        //act
        let greet = await waiterFacFun.greetUser('Nokwanda');


        //assert
        assert.equal(greet, "Hi Nokwanda! get started by picking your shifts for the week");

    });

    it("should be able to reset the shifts when admin want to start a new week of shifts", async function() {
        //assemble
        var waiterFacFun = await WaiterFacFun(pool);
        //act

        let clearShifts = await waiterFacFun.clearAllShifts();
        // storeInfo;

        //assert
        assert.deepEqual(
            [], clearShifts);

    });

    after(async function() {
        await pool.end();
    })


});