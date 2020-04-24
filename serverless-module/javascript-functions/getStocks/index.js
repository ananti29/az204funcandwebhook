module.exports = async function (context, req, stocks) {
    try {
        context.log("getstocks was successful");

        context.res = {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            },
            body: {
                stocks
            }
    
        };
    } catch (error) {
        context.log.error("internal error ", error);
        
        context.res = {
            status: 500,
            headers: {
                "Content-Type": "application/json"
            },
            body: {
                "message": "Internal error happened. Please try again later"
            }
        };
    }
 
};