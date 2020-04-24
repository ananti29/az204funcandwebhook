module.exports = async function (context, req, connectionInfo) {

    try {
        context.log("negotiate was successful");

        context.res = {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            },
            body: {
                connectionInfo
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