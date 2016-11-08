var fs = require('fs');
var path = require('path');
var grpc = require('grpc');
var dstoreCredentials = require('dstore-sdk-node/dstore/helper/dstoreCredentials.js');

var credsAdmin = new dstoreCredentials.DstoreCredentials("dbap_dev", "wmxUUTkV87", "default");

exports.host = 'try.dstore.io:13896';

exports.credentialsAdmin = grpc.credentials.combineChannelCredentials(
    grpc.credentials.createSsl(
        fs.readFileSync(path.join(__dirname, 'dstore-try-ca.pem'))),
    grpc.credentials.createFromMetadataGenerator(credsAdmin.getMetadataUpdater())
);

exports.credentialsPublic = grpc.credentials.createSsl(
    fs.readFileSync(path.join(__dirname, 'dstore-try-ca.pem'))
);