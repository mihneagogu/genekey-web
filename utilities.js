"use strict";
var GKConstants;
(function (GKConstants) {
    GKConstants[GKConstants["MinKey"] = 1] = "MinKey";
    GKConstants[GKConstants["MaxKey"] = 64] = "MaxKey";
    GKConstants[GKConstants["MinCodone"] = 1] = "MinCodone";
    GKConstants[GKConstants["MaxCodone"] = 21] = "MaxCodone";
})(GKConstants || (GKConstants = {}));
/*
 * Queries a given object seeing if the query is one of the properties
 */
function query_params(query, queried) {
    if (!queried) {
        console.log("made me query a null or undefined object");
        return "Query on null object";
    }
    let trimmedQuery = query.trim();
    let property = Object.keys(queried).filter(k => k == trimmedQuery);
    if (property.length == 1) {
        // Asked for an actual propery
        let answer = queried[trimmedQuery].toString();
        return answer;
    }
    return "Invalid query";
}
//# sourceMappingURL=utilities.js.map