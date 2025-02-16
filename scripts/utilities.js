"use strict";
var GKConstants;
(function (GKConstants) {
    GKConstants[GKConstants["MinKey"] = 1] = "MinKey";
    GKConstants[GKConstants["MaxKey"] = 64] = "MaxKey";
    GKConstants[GKConstants["MinCodone"] = 1] = "MinCodone";
    GKConstants[GKConstants["MaxCodone"] = 21] = "MaxCodone";
})(GKConstants || (GKConstants = {}));
function query_params(query, queried) {
    if (!queried) {
        return { result: 'Query on null object', succeeded: false };
    }
    let trimmedQuery = query.trim();
    let property = Object.keys(queried).filter(k => k == trimmedQuery);
    if (property.length == 1) {
        // Asked for an actual propery
        let answer = queried[trimmedQuery].toString();
        return { result: answer, succeeded: true };
    }
    return { result: 'Invalid query', succeeded: false };
}
//# sourceMappingURL=utilities.js.map