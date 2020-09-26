"use strict";
class CodoneRing {
    constructor(index, keys, name, description) {
        this.index = index;
        this.keys = keys;
        this.name = name,
            this.description = description;
    }
    /*
     * Formats the blue attributes from all the gene keys
     */
    formatBlues() {
        let div = document.createElement('div');
        this.getGeneKeys().forEach(gk => div.appendChild(gk.blues()));
        return div;
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
    keyAt(index) {
        return geneKeyLibrary[this.keys[index]];
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
    /*
     * Formats an HTML element to be shown based on the codone ring
     */
    formatHTML() {
        let html = document.createElement('li');
        html.id = `codone-${this.index}`;
        html.className = 'card';
        html.innerHTML = `<h2>Codone ${this.index}</h2>
            <p>Name: ${this.name}</p>
            <p>Description: ${this.description}</p>
            <div>Keys:</div>
        `;
        // Creates a new button using the key number this.keys[index]
        let keyButton = (index) => {
            let btn = document.createElement('button');
            btn.id = `key-${index}`;
            btn.textContent = `GeneKey ${this.keys[index]}`;
            btn.addEventListener('click', () => {
                sectionUl.appendChild(this.keyAt(index).formatHTML());
            });
            return btn;
        };
        for (let i = 0; i < this.keys.length; i++) {
            html.appendChild(keyButton(i));
        }
        return html;
    }
}
//# sourceMappingURL=codone_class.js.map