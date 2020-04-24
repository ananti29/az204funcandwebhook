module.exports = async function (context, req) {
    

    var bookmark = context.bindings.bookmarkdocument;

    try {
        if (bookmark) {
            context.log("bookmark found ", { bookmark: bookmark.url });
            context.res = {
                headers: {
                    "Content-Type": "application/json"
                },
                body: {
                    "url": bookmark.url
                }

            };
        }
        else {
            context.log.warn("bookmark not found ", { bookmark: req.query.id });
            context.res = {
                status: 404,
                headers: {
                    "Content-Type": "application/json"
                },
                body: {
                    "message": "No bookmarks found"
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