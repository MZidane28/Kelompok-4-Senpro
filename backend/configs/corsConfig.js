let allowedOrigins = ['http://localhost:3000', 'https://www.empati.biz.id'];

const corsConfig = () => {
    if(process.env.environment == "production") {
        return {
            origin: function(origin, callback){
                // allow requests with no origin 
                // (like mobile apps or curl requests)
                return callback(null, true);
            } ,
            credentials :true
        }
    } else {
        return {
            origin: function(origin, callback){
                // allow requests with no origin 
                // (like mobile apps or curl requests)
                return callback(null, true);
            },
            credentials :true
        }
    }
}

module.exports = corsConfig