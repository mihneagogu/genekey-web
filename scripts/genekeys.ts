// Model genekey for index 0
const gkModel =[{"index":0,"codone":21,"shadow":{"type":"SHADOW","description":"shadow"},"gift":{"type":"GIFT","description":"gift"},"siddhi":{"type":"SIDDHI","description":"siddhi"},"organs":["plamani","inima","rinichi"], "emotions": ["frica", "semne"], "partner": 45, "dilemma": "Eternal dilemma", "aminoacid": "valine", "iching": "some iching", "keywords": ["virtue", "dignity"], "channel": {"keys": [0, 64], "name": "Some channel"}}];
const gk0 = new GeneKey(gkModel[0]);


const geneKeyLibrary: GeneKey[] = [gk0];

// Libraries for the value tables
const dilemmaLibrary: string[] = [];
const aminoacidLibrary = {};
const organLibrary = {};
const keywordLibrary = {};
// Push an array of 64 mock genekeys
for (let i = 1; i <= GKConstants.MaxKey; i++) {
    const gk: GeneKey = gk0.deeplConeId(i);
    geneKeyLibrary.push(gk);
    dilemmaLibrary.push(`Dilemma: ${gk.dilemma} for GK ${gk.index}`);
    addToLibrary(aminoacidLibrary, gk.aminoacid, gk.index);
    gk.organs.forEach(org => addToLibrary(organLibrary, org, gk.index));
    gk.keywords.forEach(kw => addToLibrary(keywordLibrary, kw, gk.index));
}


const sortedKeywords = Object.entries(keywordLibrary).sort(([k1, arr1], [k2, arr2] ) => {
    if (k1 < k2) {
        return -1;
    }
    if (k1 === k2) {
        return 0;
    }
    return 1;
});

function addToLibrary(library, property, toAdd) {
    const keys = library[property];
    if (!keys) {
        library[property] = [toAdd];
    } else {
        keys.push(toAdd);
    }
}

function printLibrary(lib) {
    console.log(lib);
}

console.log(sortedKeywords);
printLibrary(aminoacidLibrary);
printLibrary(organLibrary);
printLibrary(keywordLibrary);

