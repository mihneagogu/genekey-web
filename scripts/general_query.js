"use strict";
/*
 * Produces the result of a given query
 */
function generalQuery(query) {
    if (!query) {
        // Either null, undefined, or ''
        return { _type: GKQueryDiscriminant.QUERY_ERR, value: 'Invalid query' };
    }
    let args = query.split(' ').map(s => s.toLowerCase());
    if (args.length === 0) {
        return { _type: GKQueryDiscriminant.QUERY_ERR, value: 'The query must have at least 1 command' };
    }
    if (args[0].toLowerCase() === 'allorgans') {
        // Corner case when the person wants all keys which have a certain organ related to them
        if (!args[1]) {
            return queryErrorFrom('You wanted to find all the keys related to an organ, but you gave me no organ!');
        }
        let org = args[1];
        let organKeys = geneKeyLibrary.filter(gk => gk.organs.filter(organ => organ === org).length > 0);
        let collection = new QueryGKCollection(organKeys, `All the keys related to ${org}`, org);
        return { _type: GKQueryDiscriminant.TYPE_QUERY_GK_COLLECTION, value: collection };
    }
    switch (args[0]) {
        case 'genekey':
        case 'gk': {
            return gkQuery(args.slice(1));
        }
        case 'codon':
        case 'codone': {
            return codoneQuery(args.slice(1));
        }
        default: {
            return queryErrorFrom('I do not recognize this command');
        }
    }
}
class QueryGKCollection {
    constructor(keys, msg, organ) {
        this.keys = keys;
        this.msg = msg;
        this.organ = organ;
    }
    /*
     * Formats the given QueryGKCollection into an HTML element
     */
    formatHTML() {
        let html = document.createElement('li');
        html.className = 'card';
        html.innerHTML = `<h2>Genekeys related to '${this.organ}'</h2>`;
        let keyButton = (gk) => {
            let btn = document.createElement('button');
            btn.textContent = `GeneKey ${gk.index}`;
            btn.addEventListener('click', () => {
                sectionUl.appendChild(gk.formatHTML());
            });
            return btn;
        };
        // Add the generated buttons to the page
        let buttons = this.keys.map(gk => keyButton(gk));
        buttons.forEach(bt => html.appendChild(bt));
        return html;
    }
}
var GKQueryDiscriminant;
(function (GKQueryDiscriminant) {
    GKQueryDiscriminant[GKQueryDiscriminant["TYPE_QUERY_GENE"] = 0] = "TYPE_QUERY_GENE";
    GKQueryDiscriminant[GKQueryDiscriminant["TYPE_QUERY_CODONE"] = 1] = "TYPE_QUERY_CODONE";
    GKQueryDiscriminant[GKQueryDiscriminant["TYPE_CODONE_BLUES"] = 2] = "TYPE_CODONE_BLUES";
    GKQueryDiscriminant[GKQueryDiscriminant["TYPE_PARTNER_BLUES"] = 3] = "TYPE_PARTNER_BLUES";
    GKQueryDiscriminant[GKQueryDiscriminant["TYPE_CHANNEL_BLUES"] = 4] = "TYPE_CHANNEL_BLUES";
    GKQueryDiscriminant[GKQueryDiscriminant["TYPE_QUERY_GK_COLLECTION"] = 5] = "TYPE_QUERY_GK_COLLECTION";
    GKQueryDiscriminant[GKQueryDiscriminant["QUERY_ERR"] = 6] = "QUERY_ERR";
})(GKQueryDiscriminant || (GKQueryDiscriminant = {}));
function queryErrorFrom(err) {
    return { _type: GKQueryDiscriminant.QUERY_ERR, value: err };
}
/*
 * Queries "gk ..." with given args
 */
function gkQuery(args) {
    if (args[0] && +args[0]) {
        let maybeId = +args[0];
        let id = Math.floor(maybeId);
        if (maybeId !== id) {
            return { _type: GKQueryDiscriminant.QUERY_ERR, value: 'You gave me a number with decimal points' };
        }
        if (id < 1 || id > 64) {
            return { _type: GKQueryDiscriminant.QUERY_ERR, value: 'Invalid index, Genekey must be in [1..=64]' };
        }
        let gk = geneKeyLibrary[id];
        if (!args[1]) {
            return { _type: GKQueryDiscriminant.TYPE_QUERY_GENE, value: { gk: gk, msg: gk.toJson() } };
        }
        return gkObjQuery(gk, args.splice(1));
    }
    return { _type: GKQueryDiscriminant.QUERY_ERR, value: 'I see you like gene keys, but you gave me no number' };
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
                // format all the blue attributes from the children
                return { _type: GKQueryDiscriminant.TYPE_CODONE_BLUES, value: { gk: gk, codone: codone, msg: codone.toJson() } };
            }
            return codoneObjQuery(codoneLibrary[gk.codone], args.splice(1));
        }
        if (param === 'partner') {
            if (!args[1]) {
                // just want the partner, so format blues
                return { _type: GKQueryDiscriminant.TYPE_PARTNER_BLUES, value: { gk: gk, msg: result } };
            }
            return gkObjQuery(gk.getPartner(), args.splice(1));
        }
        if (param === 'channel') {
            if (args[1]) {
                return queryErrorFrom('You cannot ask for anything more when trying to get a channel \
                              Try "gk 12 channel"');
            }
            return { _type: GKQueryDiscriminant.TYPE_CHANNEL_BLUES, value: { gk: gk, msg: result } };
        }
        // Just a standard query of the properties
        return { _type: GKQueryDiscriminant.TYPE_QUERY_GENE, value: { gk: gk, msg: result } };
    }
    return { _type: GKQueryDiscriminant.QUERY_ERR, value: `I do not recognize a query of '${param}' on a Genekey` };
}
/*
 * Queries "codone ..." with given args
 */
function codoneQuery(args) {
    if (args[0] && +args[0]) {
        let number = +args[0];
        if (number < 1 || number > 21) {
            return queryErrorFrom('Codones range from 0 to 21');
        }
        if (Math.floor(number) !== number) {
            return queryErrorFrom('You gave me a decimal number, that\'s not allowed');
        }
        if (!args[1]) {
            return { _type: GKQueryDiscriminant.TYPE_QUERY_CODONE, value: { codone: codoneLibrary[number], msg: codoneLibrary[number].toJson() } };
        }
        return codoneObjQuery(codoneLibrary[number], args.slice(1));
    }
    return queryErrorFrom('You need to give me a codone number!');
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
        return { _type: GKQueryDiscriminant.TYPE_QUERY_CODONE, value: { codone: codone, keys: keys, msg: jsonKeys } };
    }
    let { result, succeeded } = codone.query(param);
    if (!succeeded) {
        return { _type: GKQueryDiscriminant.QUERY_ERR, value: `Invalid codone query of '${param}'` };
    }
    return { _type: GKQueryDiscriminant.TYPE_QUERY_CODONE, value: { codone: codone, msg: result } };
}
//# sourceMappingURL=general_query.js.map