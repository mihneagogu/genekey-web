enum GKConstants {
    MinKey = 1,
    MaxKey = 64,
    MinCodone = 1,
    MaxCodone = 21
}

/*
 * Queries a given object seeing if the query is one of the properties
 */
interface ImplicitQueryRes {
    result: string,
    succeeded: boolean
}
function query_params(query: string, queried: any): ImplicitQueryRes {
    if (!queried) {
        return { result: 'Query on null object', succeeded: false};
    }
    let trimmedQuery: string = query.trim();
    let property: string[] = Object.keys(queried).filter(k => k == trimmedQuery);
    if (property.length == 1) {  
        // Asked for an actual propery
        let answer: string = queried[trimmedQuery].toString();
        return {result: answer, succeeded: true};
    }
    return {result: 'Invalid query', succeeded: false};
}
