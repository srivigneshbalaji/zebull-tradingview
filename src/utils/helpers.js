
var isLoggingEnabled = false;
export function logMessage(message, level = 0) {
    if (isLoggingEnabled) {
        const now = new Date();
        // tslint:disable-next-line:no-console
        if (level == 0) {
            console.info(`${now.toLocaleTimeString()}.${now.getMilliseconds()}> ${message}`);
        } else if (level == 1) {
            console.warn(`${now.toLocaleTimeString()}.${now.getMilliseconds()}> ${message}`)
        }
        else if (level == 2) {
            console.error(`${now.toLocaleTimeString()}.${now.getMilliseconds()}> ${message}`)
        }
    }
}



export function setLogging(flag) {
    isLoggingEnabled = flag
}


export function getErrorMessage(error) {
    if (error === undefined) {
        return '';
    } else if (typeof error === 'string') {
        return error;
    }
    return error.message;
}