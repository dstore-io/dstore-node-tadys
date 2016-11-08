var assert = require('assert');
var services = require('dstore-sdk-node/dstore/engine/procedures/engineProc_grpc_pb');
var credentials = require('./credentials.js').credentialsAdmin;

describe('ConnectionTaDys', function () {
    describe('ProcedureConnection', function () {
        it('should not return null', function () {
            assert.notEqual(new services.EngineProcClient('try.dstore.io:13896', credentials), null)
        });
    });
});