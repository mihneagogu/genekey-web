"use strict";
// Model genekey for index 0
let gkModel = [{ "index": 0, "codoneIndex": 21, "shadow": { "type": "SHADOW", "description": "shadow" }, "gift": { "type": "GIFT", "description": "gift" }, "siddhi": { "type": "SIDDHI", "description": "siddhi" }, "organs": ["plamani", "inima", "rinichi"] }];
let gk0 = new GeneKey(gkModel[0]);
let geneKeyLibrary = [gk0];
// Push an array of 64 mock genekeys
for (let i = 1; i <= 64; i++) {
    geneKeyLibrary.push(gk0.deeplConeId(i));
}
//# sourceMappingURL=genekeys.js.map