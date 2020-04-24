module.exports = async function (context, req) {
    

    // Try to grab principal, rate and term from the query string and
    // parse them as numbers
    const principal = parseFloat(req.query.principal);
    const rate = parseFloat(req.query.rate);
    const term = parseFloat(req.query.term);
    try {
        if ([principal, rate, term].some(isNaN)) {
            // If any empty or non-numeric values, return a 400 response with an
            // error message
            context.log.warn("principal, rate or term is empty or not a number ", {
                principal: principal,
                rate: rate,
                term: term
            });

            context.res = {
                status: 400,
                headers: {
                    "Content-Type": "application/json"
                },
                body: {
                    message: "Please supply principal, rate and term in the query string"
                }
            };
        } else {
            const interestResult = principal * rate * term;
            // Otherwise set the response body to the product of the three values
            if (interestResult) {
                context.log("interest rate calculation successful ", {
                    principal: principal,
                    rate: rate,
                    term: term,
                    result: interestResult
                });
    
                context.res = {
                    status: 200,
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: {
                        principal: principal,
                        rate: rate,
                        term: term,
                        result: interestResult
                    }
                };
            }
         
        }
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