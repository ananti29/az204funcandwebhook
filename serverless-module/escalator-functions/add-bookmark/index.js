module.exports = async function (context, req) {
    

    var bookmark = context.bindings.bookmarkdocument;
    try {
        if (bookmark) {
            context.log("bookmark already exists ", { bookmark: bookmark.url });
            
            context.res = {
                status: 422,
                headers: {
                    "Content-Type": "application/json"
                },
                body: {
                    "message": "Bookmark already exists."
                }

            };
        }
        else {

            // Create a JSON string of our bookmark.
            var bookmarkString = JSON.stringify({
                id: req.body.id,
                url: req.body.url
            });

            context.bindings.newbookmark = bookmarkString;
            context.bindings.newmessage = bookmarkString;

            context.log("bookmark added", {
                bookmark: bookmarkString
            });

            // Tell the user all is well.     
            context.res = {
                status: 200,
                headers: {
                    "Content-Type": "application/json"
                },
                body: {
                    "message": "bookmark added!"
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