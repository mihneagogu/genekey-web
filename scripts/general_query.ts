/*
 * Produces the result of a given query
 */
function generalQuery(query: string): GKQueryResult {
    if (!query) {
        // Either null, undefined, or ''
        return {_type: GKQueryDiscriminant.QUERY_ERR, value: 'Invalid query'};
    }
    let args: string[] = query.split(' ').map(s => s.toLowerCase());
    if (args.length === 0) {
        return {_type: GKQueryDiscriminant.QUERY_ERR, value: 'The query must have at least 1 command'};
    }

    if (args[0].includes('all')) {
        // allorgans ... | alldilemmas ... | allkeywords ... | allaminoacids ...
        return allQuery(args);
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

/*
 * 'allorgans', 'alldilemmas', 'allkeywords', 'allaminoacids' query
 */
function allQuery(args: string[]): GKQueryResult {
        if (!args[1]) {
            return queryErrorFrom('You must give me another argument. What organ/keyword/dilemma/acid are you looking for?');
        }
        //
        // Finds all keys which have args[1] in genekey[property]
        const patternMatch = (property: string, propertyIsArray: boolean) => {
            // Search for NEEDLE in the genekey 'haystack'
            const needle: string = args.splice(1).map(arg => arg).join(" ");
            let matchingKeys: GeneKey[] = [];
            let collection: QueryGKCollection;

            if (propertyIsArray) {
                // Ex: search for 'lungs' in every genekey's organ list (which is string[])
                matchingKeys = geneKeyLibrary.filter(gk => gk[property].filter(element => element.toLowerCase() === needle).length > 0);
            } else {
                // just a single string property
                matchingKeys = geneKeyLibrary.filter(gk => gk[property].toLowerCase() === needle);
            }
            collection = new QueryGKCollection(matchingKeys, `All keys related to ${needle}`, needle);

            return {_type: GKQueryDiscriminant.TYPE_QUERY_GK_COLLECTION, value: collection };
        }

        switch (args[0]) {
            case 'allorgans' : {
                return patternMatch('organs', true);
            }
            case 'alldilemmas' : {
                return patternMatch('dilemma', false);
            }
            case 'allkeywords' : {
                return patternMatch('keywords', true);
            }
            case 'allaminoacids' : {
                return patternMatch('aminoacid', false);
            }
            default: {
                return queryErrorFrom("Available 'all' commands: 'allkeyowrds', 'allorgans', 'allaminoacids', 'alldilemmas'");
            }
        }
}


interface QueryGene {
    gk: GeneKey,
    codone?: CodoneRing,
    msg: string
}

interface QueryCodone {
    codone: CodoneRing, 
    keys?: GeneKey[],
    msg: string
}

class QueryGKCollection {
    keys: GeneKey[];
    msg: string;
    organ: string;

    constructor(keys: GeneKey[], msg: string, organ: string) {
        this.keys = keys;
        this.msg = msg;
        this.organ = organ;
    }

    /*
     * Formats the given QueryGKCollection into an HTML element
     */
    formatHTML(): HTMLElement {
        let html = document.createElement('li');
        html.className = 'card';
        html.innerHTML = `<h2>Genekeys related to '${this.organ}'</h2>`;

        let keyButton = (gk: GeneKey): HTMLElement => {
            let btn = document.createElement('button');
            btn.textContent = `GeneKey ${gk.index}`;
            btn.addEventListener('click', () => {
                sectionUl.appendChild(gk.formatHTML());
            });
            return btn;
        }

        // Add the generated buttons to the page
        let buttons = this.keys.map(gk => keyButton(gk));
        buttons.forEach(bt => html.appendChild(bt));
        return html;
        
    }
}

enum GKQueryDiscriminant {
    TYPE_QUERY_GENE,
    TYPE_QUERY_CODONE,
    TYPE_CODONE_BLUES,
    TYPE_PARTNER_BLUES,
    TYPE_CHANNEL_BLUES,
    TYPE_QUERY_GK_COLLECTION,
    QUERY_ERR
}

type GKQueryResult = {
    _type: GKQueryDiscriminant,
    value: QueryGene | QueryCodone | QueryGKCollection | string;
}

function queryErrorFrom(err: string): GKQueryResult {
    return {_type: GKQueryDiscriminant.QUERY_ERR, value: err };
}

/*
 * Queries "gk ..." with given args
 */
function gkQuery(args: string[]): GKQueryResult {
   if (args[0] && +args[0]) {
       let maybeId = +args[0];
       let id = Math.floor(maybeId);
       if (maybeId !== id) {
            return {_type: GKQueryDiscriminant.QUERY_ERR, value: 'You gave me a number with decimal points' };
       }
       if (id < 1 || id > 64) {
            return {_type: GKQueryDiscriminant.QUERY_ERR, value: 'Invalid index, Genekey must be in [1..=64]'};
       }
       let gk: GeneKey = geneKeyLibrary[id];
       if (!args[1]) {
        return {_type: GKQueryDiscriminant.TYPE_QUERY_GENE, value: { gk: gk, msg: gk.toJson() }};

       }
       return gkObjQuery(gk, args.splice(1));
   }
    return {_type: GKQueryDiscriminant.QUERY_ERR, value: 'I see you like gene keys, but you gave me no number'};
}

/*
 * Queries the given genekey with the given args
 * Ex: if the command run is "gk 32 <arg2> <arg3> ... <argn>"
 * then this query would be called on the 32nd genekey
 * with args = {arg2, arg3, ... , argn}
 * PRE: args is guaranteed to have length of at least 1
 */
function gkObjQuery(gk: GeneKey, args: string[]): GKQueryResult {
    let param: string = args[0].toLowerCase();

    let {result, succeeded} = gk.query(param);
    if (succeeded) {
        if (param === 'codone') {
            // Querying the codone of a genekey, call codoneObjQuery
            if (!args[1]) {
                // just asked for the codone, nothing else
                let codone: CodoneRing = codoneLibrary[gk.codone];
                // format all the blue attributes from the children
                return {_type: GKQueryDiscriminant.TYPE_CODONE_BLUES, value: { gk: gk, codone: codone, msg: codone.toJson() }};
            }
            return codoneObjQuery(codoneLibrary[gk.codone], args.splice(1));
        }
        if (param === 'partner') {
            if (!args[1]) {
                // just want the partner, so format blues
                return {_type: GKQueryDiscriminant.TYPE_PARTNER_BLUES, value: { gk: gk, msg: result }};
            }
            return gkObjQuery(gk.getPartner(), args.splice(1));
        }
        if (param === 'channel') {
            if (args[1]) {
                return queryErrorFrom('You cannot ask for anything more when trying to get a channel \
                              Try "gk 12 channel"');
            }
            return {_type: GKQueryDiscriminant.TYPE_CHANNEL_BLUES, value: { gk: gk, msg: result }};
        }
        // Just a standard query of the properties
        return {_type: GKQueryDiscriminant.TYPE_QUERY_GENE, value: { gk: gk, msg: result }};
    }
    return {_type: GKQueryDiscriminant.QUERY_ERR, value: `I do not recognize a query of '${param}' on a Genekey`};
}

/*
 * Queries "codone ..." with given args
 */
function codoneQuery(args: string[]): GKQueryResult {
    if (args[0] && +args[0]) {
        let number = +args[0];
        if (number < 1 || number > 21) {
            return queryErrorFrom('Codones range from 0 to 21');
        }
        if (Math.floor(number) !== number) {
            return queryErrorFrom('You gave me a decimal number, that\'s not allowed');
        }
        if (!args[1]) {
            return {_type: GKQueryDiscriminant.TYPE_QUERY_CODONE, value: { codone: codoneLibrary[number], msg: codoneLibrary[number].toJson() }};
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
function codoneObjQuery(codone: CodoneRing, args: string[]): GKQueryResult {

    let param: string = args[0].toLowerCase();
    if (param === 'keys') {
        let keys: GeneKey[] = codone.keys.map((k) => geneKeyLibrary[k]);
        let jsonKeys = JSON.stringify(keys);
        return {_type: GKQueryDiscriminant.TYPE_QUERY_CODONE, value: { codone: codone, keys: keys, msg: jsonKeys }};
    }
    let {result, succeeded} = codone.query(param);
    if (!succeeded) {
        return {_type: GKQueryDiscriminant.QUERY_ERR, value: `Invalid codone query of '${param}'`};
    }
    return {_type: GKQueryDiscriminant.TYPE_QUERY_CODONE, value: { codone: codone, msg: result }};
}
