type GeneralQueryResult = GKQueryResult | string;
function generalQuery(query: string): GeneralQueryResult {
    if (!query) {
        // Either null, undefined, or ''
        return 'Invalid query';
    }
    let args: string[] = query.split(' ');
    if (args.length === 0) {
        return 'The query must have at least 1 command';
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
            return 'I do not recognize this command';
        }
    }
    return '';
}

interface QueryGene {
    gk: GeneKey,
    msg: string,
}

interface QueryCodone {
    codone: CodoneRing, 
    msg: string
}

type GKQueryResult = QueryGene | QueryCodone | string;

function gkQuery(args: string[]): GKQueryResult {
   if (args[0] && +args[0]) {
       let maybeId = +args[0];
       let id = Math.floor(maybeId);
       if (maybeId !== id) {
            return 'You gave me a number with decimal points';
       }
       if (id < 1 || id > 64) {
            return 'Invalid index, Genekey must be in [1..=64]';
       }
       if (!args[1]) {
        return { gk: geneKeyLibrary[id], msg: geneKeyLibrary[id].toJson() };
       }
       return `Genekey ${id} with extra arguments...`;
   }
    return 'I see you like gene keys, but you gave me no number';
}

function codoneQuery(args: string[]): string {
    return 'codone!';
}