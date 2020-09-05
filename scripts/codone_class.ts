class CodoneRing implements Queryable {
    index: number;
    keys: number[];
    name: string;
    description: string;

    public constructor(index: number, keys: number[], name: string, description: string) {
        this.index = index;
        this.keys = keys;
        this.name = name,
        this.description = description;
    }


    query(query: string): ImplicitQueryRes {
        let ans: ImplicitQueryRes = query_params(query, this);
        return ans;
    }

    static fromJson(json: any): CodoneRing {
        return new CodoneRing(json.index, json.keys, json.name, json.description);
    }

    public toString(): string {
        return `Inel de codon ${this.name} cu indicele ${this.index}.\n Descriere: ${this.description}, chei: ${this.keys}`;
    }

    public toJson(): string {
        return JSON.stringify(this);
    }

    public getGeneKeys(): GeneKey[] {
        let geneKeys: GeneKey[] = [];
        this.keys.forEach(k => geneKeys.push(geneKeyLibrary[k]));
        return geneKeys;
    }

    private keyAt(index: number): GeneKey {
        return geneKeyLibrary[this.keys[index]];
    }

    static examplePrint() {
        let codone: CodoneRing = new CodoneRing(0, [1,2,3], "Codone 0", "I am the 0th codone");
        console.log(codone.toJson());
    }

    public deepClone(): CodoneRing {
        let keysC: number[] = [];
        this.keys.forEach(k => keysC.push(k));
        return new CodoneRing(this.index, keysC, this.name.slice(), this.description.slice());
    }

    public deepCloneId(id: number): CodoneRing {
        let codone = this.deepClone();
        codone.index = id;
        return codone;
    }

    /*
     * Formats an HTML element to be shown based on the codone ring
     */
    public formatHTML(): HTMLElement {
        let html = document.createElement('li');
        html.id = `codone-${this.index}`;
        html.className = 'card';

        html.innerHTML = `<h2>Codone ${this.index}</h2>
            <p>Name: ${this.name}</p>
            <p>Description: ${this.description}</p>
            <div>Keys:</div>
        `;

        // Creates a new button using the key number this.keys[index]
        let keyButton = (index): HTMLElement => {
            let btn = document.createElement('button');
            btn.id = `key-${index}`;
            btn.textContent = `GeneKey ${this.keys[index]}`;
            btn.addEventListener('click', () => {
                sectionUl.appendChild(this.keyAt(index).formatHTML());
            });
            return btn;
        }

        for (let i = 0; i < this.keys.length; i++) {
            html.appendChild(keyButton(i));
        }

        return html;
    }
}

