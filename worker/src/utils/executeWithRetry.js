const sleep = require('./sleep');

module.exports = async (func, errorHandler, maxRetry = 10, retryDelay = 1000) => {
    let retry = 0;
    while (true) {
        if (retry > 0) {
            console.log(`Retrying in ${retryDelay} milliseconds...`);
            await sleep(retryDelay);
        }

        try {
            retry++;
            return await func();
        }
        catch (exception) {
            errorHandler(exception);
            if (retry > maxRetry) {
                console.log(`Exceeded maximum allowed retry`);
                throw exception;
            }
        }
    }
}