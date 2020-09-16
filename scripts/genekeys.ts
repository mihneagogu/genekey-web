// Model genekey for index 0
let gkModel =[{"index":0,"codone":21,"shadow":{"type":"SHADOW","description":"shadow"},"gift":{"type":"GIFT","description":"gift"},"siddhi":{"type":"SIDDHI","description":"siddhi"},"organs":["plamani","inima","rinichi"], "emotions": ["frica", "semne"], "partner": 45, "dilemma": "Eternal dilemma", "aminoacid": "valine", "keywords": ["virtue", "dignity"], "channel": {"keys": [0, 64], "name": "Some channel"}}];
let gk0 = new GeneKey(gkModel[0]);

let geneKeyLibrary: GeneKey[] = [gk0];
// Push an array of 64 mock genekeys
for (let i = 1; i <= GKConstants.MaxKey; i++) {
    geneKeyLibrary.push(gk0.deeplConeId(i));
}

