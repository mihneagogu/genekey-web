"use strict";
// Model genekey for index 0
let gkModel = [{ "index": 0, "gift": { "type": 1, "description": "gift" }, "siddhi": { "type": 2, "description": "siddhi" }, "shadow": { "type": 0, "description": "shadow description" }, "organs": ["inima", "piept", "rinichi"] }];
let gk1 = new GeneKey(gkModel[0]);
let geneKeys = [gk1];
// Push an array of 64 mock genekeys
for (let i = 1; i <= 64; i++) {
    geneKeys.push(gk1.deeplConeId(i));
}
//# sourceMappingURL=genekeys.js.map