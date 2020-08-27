enum GKConstants {
    MinKey = 1,
    MaxKey = 64,
    MinCodone = 1,
    MaxCodone = 21
}

/*
 * Queries a given object seeing if the query is one of the properties
 */
function query_params(query: string, queried: any): string {
    if (!queried) {
        console.log("made me query a null or undefined object");
        return "Query on null object";
    }
    let trimmedQuery: string = query.trim();
    let property: string[] = Object.keys(queried).filter(k => k == trimmedQuery);
    if (property.length == 1) {  
        // Asked for an actual propery
        let answer: string = queried[trimmedQuery].toString();
        return answer;
    }
    return "Invalid query";
}