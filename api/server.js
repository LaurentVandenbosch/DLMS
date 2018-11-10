'use strict';
const { MongoClient } = require('mongodb');
const host = process.env.MONGO_HOST || 'localhost';
const url = 'mongodb://' + host + ':27017';
const dbName = 'DLMS';
const collectionName = 'messages';

const Hapi = require('hapi');

// Create a server with a host and port
const server = Hapi.server({
    host: 'localhost',
    port: 8000
});

// Add the route
server.route({
    method: 'GET',
    path: '/messages',
    options: {
        cors: true
    },
    handler: function (request, h) {
        return new Promise((resolve) => {
            MongoClient.connect(url, function(err, client) {
                const collection = client.db(dbName).collection(collectionName);
                collection.find().toArray()
                .then(messages => {
                     resolve({messages}); 
                });
            });
        });
        
    }
});

// Start the server
async function start() {

    try {
        await server.start();
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }

    console.log('Server running at:', server.info.uri);
};

start();