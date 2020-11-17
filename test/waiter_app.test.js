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
        // await pool.query(`delete from waiters`);
        await pool.query(`delete from shifts`);
        // await pool.query(`ALTER SEQUENCE serial RESTART WITH 1`)


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

    // it("should be able to join the shifts table to the waiters table", async function() {
    //     //assemble
    //     var waiterFacFun = await WaiterFacFun(pool);
    //     //act
    //     let verifyInfoQuery = await waiterFacFun.verifyUser('Kitso');

    //     let storeInfo = await waiterFacFun.storeDetails('Kitso');
    //     storeInfo;
    //     let storeShifts = await waiterFacFun.storeShifts('Kitso', 'Saturday');
    //     storeShifts;
    //     console.log({ storeShifts });
    // storeInfo;


    // it("should be able to store all shifts selected by a user in the database", async function() {
    //     //assemble
    //     var waiterFacFun = await WaiterFacFun(pool);
    //     //act
    //     // let verifyInfoQuery = await waiterFacFun.verifyUser('Lionel', 'l223');
    //     let storeUserDetails = await waiterFacFun.storeDetails('Titi');
    //     storeUserDetails;
    //     let storeUserShifts = await waiterFacFun.storeShifts('Titi', 'Tuesday')
    //     storeUserShifts;

    //     // storeInfo;

    //     let getShifts = await waiterFacFun.getUserShifts('Titi');
    //     //assert
    //     assert.deepEqual([{ "row": "(75++,2)" }], getShifts);

    // });

    // it("should be able to return all shifts selected by a user as an object", async function() {
    //     //assemble
    //     var waiterFacFun = await WaiterFacFun(pool);
    //     //act
    //     let storeUserDetails = await waiterFacFun.storeDetails('Kai');
    //     let storeUserShifts = await waiterFacFun.storeShifts('Kai', 'Thursday')
    //     let getShifts = await waiterFacFun.getUserShifts('Kai');
    //     //assert
    //     assert.deepEqual([{ "row": "(83,4)" }], getShifts);
    // });
    after(async function() {
        await pool.end();
    })


});