let allowedOrigins = ['http://localhost:3000', 'https://www.empati.biz.id'];

const corsConfig = () => {
    if(process.env.environment == "production") {
        return {
            origin: function(origin, callback){
                // allow requests with no origin 
                // (like mobile apps or curl requests)
                if(!origin) return callback(null, true);


                if(allowedOrigins.indexOf(origin) === -1){
                    var msg = 'The CORS policy for this site does not ' +
                            'allow access from the specified Origin.';
                    return callback(new Error(msg), false);
                }
                return callback(null, true);
            } ,
            credentials :true
        }
    } else {
        return {
            origin: function(origin, callback){
                // allow requests with no origin 
                // (like mobile apps or curl requests)
                if(!origin) return callback(null, true);

                if(allowedOrigins.indexOf(origin) === -1){
                    var msg = 'The CORS policy for this site does not ' +
                            'allow access from the specified Origin.';
                    return callback(new Error(msg), false);
                }
                return callback(null, true);
            },
            credentials :true
        }
    }
}

module.exports = corsConfig