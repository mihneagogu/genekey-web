"use strict";
/*
 * Produces the result of a given query
 */
function generalQuery(query) {
    if (!query) {
        // Either null, undefined, or ''
        return 'Invalid query';
    }
    let args = query.split(' ');
    if (args.length === 0) {
        return 'The query must have at least 1 command';
    }
    switch (args[0].toLowerCase()) {
        case 'genekey':
        case 'gk': {
            return gkQuery(args.slice(1));
        }
        case 'codon':
        case 'codone': {
            return codoneQuery(args.slice(1));
        }
        default: {
            return 'I do not recognize this command';
        }
    }
}
/*
 * Queries "gk ..." with given args
 */
function gkQuery(args) {
    if (args[0] && +args[0]) {
        let maybeId = +args[0];
        let id = Math.floor(maybeId);
        if (maybeId !== id) {
            return 'You gave me a number with decimal points';
        }
        if (id < 1 || id > 64) {
            return 'Invalid index, Genekey must be in [1..=64]';
        }
        let gk = geneKeyLibrary[id];
        if (!args[1]) {
            return { gk: gk, msg: gk.toJson() };
        }
        return gkObjQuery(gk, args.splice(1));
    }
    return 'I see you like gene keys, but you gave me no number';
}
/*
 * Queries the given genekey with the given args
 * Ex: if the command run is "gk 32 <arg2> <arg3> ... <argn>"
 * then this query would be called on the 32nd genekey
 * with args = {arg2, arg3, ... , argn}
 * PRE: args is guaranteed to have length of at least 1
 */
function gkObjQuery(gk, args) {
    let param = args[0].toLowerCase();
    let { result, succeeded } = gk.query(param);
    if (succeeded) {
        if (param === 'codone') {
            // Querying the codone of a genekey, call codoneObjQuery
            if (!args[1]) {
                // just asked for the codone, nothing else
                let codone = codoneLibrary[gk.codone];
                return { gk: gk, codone: codone, msg: codone.toJson() };
            }
            return codoneObjQuery(codoneLibrary[gk.codone], args.splice(1));
        }
        // Just a standard query of the properties
        return { gk: gk, msg: result };
    }
    return `I do not recognize a query of '${param}' on a Genekey`;
}
/*
 * Queries "codone ..." with given args
 */
function codoneQuery(args) {
    return 'codone!';
}
/*
 * Queries the given codone with the given args
 * Ex: if the command run is "codone 15 <arg2> <arg3> ... <argn>"
 * then this query would be called on the 15th codone
 * with args = {arg2, arg3, ... , argn}
 */
function codoneObjQuery(codone, args) {
    let param = args[0].toLowerCase();
    if (param === 'keys') {
        let keys = codone.keys.map((k) => geneKeyLibrary[k]);
        let jsonKeys = JSON.stringify(keys);
        return { codone: codone, keys: keys, msg: jsonKeys };
    }
    let { result, succeeded } = codone.query(param);
    if (!succeeded) {
        return `Invalid codone query of '${param}'`;
    }
    return { codone: codone, msg: result };
}
//# sourceMappingURL=general_query.js.map