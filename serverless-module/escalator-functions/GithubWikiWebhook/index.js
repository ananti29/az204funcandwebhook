const Crypto = require("crypto");

module.exports = async function (context, req) {
    

    try {
        const WEBHOOKSECRET = process.env.WEBHOOK_SECRET;
        if (!WEBHOOKSECRET) {
            context.log.warn("Webhook secret is missing");

            context.res = {
                status: 400,
                headers: {
                    "Content-Type": "application/json"
                },
                body: {
                    message: "webhook secret is missing"
                }
            };
        }

        const hmac = Crypto.createHmac("sha1", WEBHOOKSECRET);
        const signature = hmac.update(JSON.stringify(req.body)).digest("hex");
        const shaSignature = `sha1=${signature}`;
        const gitHubSignature = req.headers["x-hub-signature"];

        if (!shaSignature.localeCompare(gitHubSignature)) {
            if (req.body.pages[0].title) {
                context.log("github wiki webhook successful", {
                    sha: req.body.pages[0].sha
                });

                for (let index = 0; index < req.body.pages.length; index++) {
                    const page = req.body.pages[index];
                    context.res = {
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: {
                            page: page.title,
                            action: page.action,
                            event: req.headers["x-github-event"],
                            sha: page.sha,
                            url: page.html_url,
                            sender_login: req.body.sender.login,
                            sender_id: req.body.sender.id,
                            summary: page.summary
                        }
                    };   
                }

            } else {
                context.log.warn("Invalid payload for github Wiki event", req.body);

                context.res = {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: {
                        message: "Invalid payload for Wiki event"
                    }
                };
            }

        } else {
            context.log.warn("Signatures don't match", {
                shaSignature: shaSignature,
                gitHubSignature: gitHubSignature
            });

            context.res = {
                status: 401,
                headers: {
                    "Content-Type": "application/json"
                },
                body: {
                    message: "Signatures don't match"
                }
            };
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