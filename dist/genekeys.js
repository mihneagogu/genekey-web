// Model genekey for index 0
var gkModel = [{ "index": 0, "gift": { "type": 1, "description": "gift" }, "siddhi": { "type": 2, "description": "siddhi" }, "shadow": { "type": 0, "description": "shadow" }, "organs": ["inima", "piept", "rinichi"] }];
var gk1 = new GeneKey(gkModel[0]);
var geneKeys = [gk1];
// Push an array of 64 mock genekeys
for (var i = 1; i <= 64; i++) {
    geneKeys.push(gk1.deeplConeId(i));
}
