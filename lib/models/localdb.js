const mongoose = require('mongoose');

module.exports = function useMongoAuthState(mongO) {
    if (!mongO) {
        console.error("MongoDB URL is required");
        process.exit(1);
    }

    if (global.db) return global.db; 
    return mongoose.connect(mongO, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then((connection) => {
        console.log("✅ MongoDB Connected");
        global.db = connection;
        return connection;
    }).catch((err) => {
        console.error(err);
        process.exit(1);
    });
};
      
