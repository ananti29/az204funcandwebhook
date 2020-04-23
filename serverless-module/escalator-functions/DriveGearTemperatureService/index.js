module.exports = async function (context, req) {
    context.log("Drive Gear Temperature Service triggered");
    if (req.body && req.body.readings) {
        try {
            req.body.readings.forEach(function (reading) {
                if (reading.temperature <= 25) {
                    reading.status = "OK";
                } else if (reading.temperature <= 50) {
                    reading.status = "CAUTION";
                } else {
                    reading.status = "DANGER";
                }
                context.log("Reading is " + reading.status, {
                    temperature: reading.temperature,
                    status: reading.status
                });
            });

            context.res = {
                status: 200, /* Defaults to 200 */
                headers: {
                    "Content-Type": "application/json"
                },
                body: {
                    "readings": req.body.readings
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
                    "readings": "Internal error happened. Please try again later"
                }
            };
        }

    } else {
        context.log.error("array of readings not found ", req.body);
        context.res = {
            status: 400,
            headers: {
                "Content-Type": "application/json"
            },
            body: {
                "readings": "Please send an array of readings in the request body"
            }
        };
    }
};