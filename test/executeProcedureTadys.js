var assert = require('assert');
var services = require('dstore-sdk-node/dstore/engine/procedures/engineProc_grpc_pb');
var grpc = require('grpc');
var Decimal = require('decimal.js');
var valuesHelper = require('dstore-sdk-node/dstore/helper/valuesHelper.js');

var credentials = require('./credentials.js');

var miDataTypeTest = require('dstore-sdk-node/dstore/engine/procedures/mi_DatatypeTest_Ad_pb');
var values = require('dstore-sdk-node/dstore/values_pb.js');

var engineProcClient = new services.EngineProcClient(credentials.host, credentials.credentialsAdmin);

describe('ExecuteProcedureTaDys', function () {
    describe('ExecuteProcedureWithoutParameters', function () {
        it('rows should exist after calling a procedure', function (done) {

            var resultWithResultRowsExists = false;
            var call = engineProcClient.mi_DatatypeTest_Ad(new miDataTypeTest.Parameters());

            call.on('data', function checkResponse(value) {
                if (value.getRowList().length > 0)
                    resultWithResultRowsExists = true;
            });

            call.on('status', function checkStatus(status) {
                assert.strictEqual(status.code, grpc.status.OK);
                assert.strictEqual(resultWithResultRowsExists, true);
                done();
            });

            call.on('error', function (err) {
                done(err);
            });

        });
    });

    describe('ExecuteProcedureWithParameter', function () {
        it('rows should exist after calling a procedure', function (done) {

            var resultWithResultRowsExists = false;

            var parameters = new miDataTypeTest.Parameters();
            parameters.setGetResultSet(new values.booleanValue().setValue(true));

            var call = engineProcClient.mi_DatatypeTest_Ad(parameters);

            call.on('data', function checkResponse(value) {
                if (value.getRowList().length > 0)
                    resultWithResultRowsExists = true;
            });

            call.on('status', function checkStatus(status) {
                assert.strictEqual(status.code, grpc.status.OK);
                assert.strictEqual(resultWithResultRowsExists, true);
                done();
            });

            call.on('error', function (err) {
                done(err);
            });

        });
    });

    describe('ExecuteProcedureGetOutputParameters', function () {
        it('output parameter should have the expected value', function (done) {

            var testChar;

            var parameters = new miDataTypeTest.Parameters();
            parameters.setGetResultSet(new values.booleanValue().setValue(false));
            parameters.setSetOutputParams(new values.booleanValue().setValue(true));

            var call = engineProcClient.mi_DatatypeTest_Ad(parameters);

            call.on('data', function checkResponse(value) {
                if (value.hasTestChar())
                    testChar = value.getTestChar().getValue().trim();
            });

            call.on('status', function checkStatus(status) {
                assert.strictEqual(status.code, grpc.status.OK);
                assert.strictEqual(testChar, "test char");
                done();
            });

            call.on('error', function (err) {
                done(err);
            });

        });
    });

    describe('GetAndProcessResultSet', function () {
        it('output parameter should have the expected value', function (done) {

            var resultList = [];

            var call = engineProcClient.mi_DatatypeTest_Ad(new miDataTypeTest.Parameters());

            call.on('data', function checkResponse(value) {
                value.getRowList().forEach(function (row) {
                    resultList.push(
                        {
                            "test_text": row.getTestText().getValue().trim(),
                            "test_bit": row.getTestBit().getValue(),
                            "test_integer": row.getTestInteger().getValue(),
                            "test_datetime": valuesHelper.toDate(row.getTestDatetime()),
                            "test_decimal": valuesHelper.toDecimal(row.getTestDecimal())
                        }
                    );
                });
            });

            call.on('status', function checkStatus(status) {
                assert.strictEqual(status.code, grpc.status.OK);
                assert.strictEqual("test text", resultList[0]["test_text"]);
                assert.strictEqual(true, resultList[0]["test_bit"]);
                assert.strictEqual(17, resultList[0]["test_integer"]);
                assert.deepEqual(new Date("2006-05-23T17:42:59.333Z"), resultList[0]["test_datetime"]);
                assert.deepEqual(new Decimal("-17.425923"), resultList[0]["test_decimal"]);
                done();
            });

            call.on('error', function (err) {
                done(err);
            });

        });
    });

});