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
}

