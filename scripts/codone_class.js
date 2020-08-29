"use strict";
class CodoneRing {
    constructor(index, keys, name, description) {
        this.index = index;
        this.keys = keys;
        this.name = name,
            this.description = description;
    }
    query(query) {
        let ans = query_params(query, this);
        return ans;
    }
    static fromJson(json) {
        return new CodoneRing(json.index, json.keys, json.name, json.description);
    }
    toString() {
        return `Inel de codon ${this.name} cu indicele ${this.index}.\n Descriere: ${this.description}, chei: ${this.keys}`;
    }
    toJson() {
        return JSON.stringify(this);
    }
    getGeneKeys() {
        let geneKeys = [];
        this.keys.forEach(k => geneKeys.push(geneKeyLibrary[k]));
        return geneKeys;
    }
    static examplePrint() {
        let codone = new CodoneRing(0, [1, 2, 3], "Codone 0", "I am the 0th codone");
        console.log(codone.toJson());
    }
    deepClone() {
        let keysC = [];
        this.keys.forEach(k => keysC.push(k));
        return new CodoneRing(this.index, keysC, this.name.slice(), this.description.slice());
    }
    deepCloneId(id) {
        let codone = this.deepClone();
        codone.index = id;
        return codone;
    }
}
//# sourceMappingURL=codone_class.js.map