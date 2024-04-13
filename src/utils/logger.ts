export const LogLevel = {
    INFO: 0,
    VERBOSE: 1,
    ERROR: 2
}

export function WriteLog(message: string, level: number){
    const queryString = window.location.search;
    const searchParams = new URLSearchParams(queryString);
    const shouldLog = searchParams.has("log") && searchParams.get("log") === "1";

    if(shouldLog){
        switch (level){
            case LogLevel.INFO:
                console.info(message);
                break;

            case LogLevel.VERBOSE:
                console.debug(message);
                break;

            case LogLevel.ERROR:
                console.error(message);
                break;
                        
        }
    }

}