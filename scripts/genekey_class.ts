class GeneKey implements Queryable {
    index: number;
    codone: number;
    shadow: KeyStatus;
    gift: KeyStatus;
    siddhi: KeyStatus;
    organs: string[]; // really a set, but JSON doesn't support
    emotions: string[];
    partner: number;
    dilemma: string;

    /*
        constructs the object from the json
     */
    public constructor(json:any) {
        this.index = json.index;
        this.codone = json.codone;
        this.shadow = json.shadow;
        this.gift = json.gift;
        this.siddhi = json.siddhi;
        this.organs = json.organs;
        this.emotions = json.emotions;
        this.partner = json.partner;
        this.dilemma = json.dilemma;
    }


    /*
        constructs the object form the items
     */
    public static fromItems(index: number, codone: number, shadow: KeyStatus, gift: KeyStatus, siddhi: KeyStatus, organs: string[], emotions: string[], partner: number, dilemma: string): GeneKey {
        let gkObj = {
            index: index,
            codone: codone,
            shadow: shadow,
            gift: gift,
            siddhi: siddhi,
            organs: organs,
            emotions: emotions,
            partner: partner,
            dilemma: dilemma,
        }
        return new GeneKey(gkObj);

    }

    public toJson(): string {
        return JSON.stringify(this);
    }


    /*
        Constructs a deepclone of a genekey
     */
    public deepClone(): GeneKey {
        let shadowC = new KeyStatus(this.shadow.type, this.shadow.description.slice());
        let giftC = new KeyStatus(this.gift.type, this.gift.description.slice());
        let siddhiC = new KeyStatus(this.siddhi.type, this.siddhi.description.slice());
        let organsC: string[] = this.organs.map((org) => org.slice());
        let emotionsC: string[] = this.emotions.map(em => em.slice());
        let dilemmaC: string = this.dilemma.slice();

        return GeneKey.fromItems(this.index, this.codone, shadowC, giftC, siddhiC, organsC, emotionsC, this.partner, dilemmaC);
    }

    /*
        Constructs a deepclone of a genekey with the new specified ID
     */
    deeplConeId(newId: number): GeneKey {
        let gk = this.deepClone();
        gk.index = newId;
        return gk;
    }

    /*
     *  Queries the given gene key
     */
    public query(query: string): ImplicitQueryRes {
        // Use object syntax so it's easy to get the properties
        let answer: ImplicitQueryRes = query_params(query, this);
        return answer;

    }

    // Formats the emotions into a single string
    private formatEmotions(): string {
        let emotionsText: string = "";
        this.emotions.forEach(em => emotionsText += `${em} `);
        return emotionsText;
    }
}


enum StatusType {
    SHADOW = 'SHADOW', GIFT = 'GIFT', SIDDHI = 'SIDDHI'
}

class KeyStatus implements Queryable {
    type: StatusType;
    description: string;
    public constructor(type: StatusType, description: string) {
        this.type = type;
        this.description = description;
    }

    public typeToString(): string {
        if (this.type === StatusType.GIFT) {
            return "GIFT";
        }
        if (this.type === StatusType.SHADOW) {
            return "SHADOW";
        }
        return "SIDDHI";
    }

    public toString(): string {
        return `${this.type} => ${this.description}`;
    }

    public query(query: string): ImplicitQueryRes {
        if (query.trim() === 'type') {
            let ans: string = this.typeToString();
            console.log(ans);
            return {result: ans, succeeded: true};
        }
        let answer: ImplicitQueryRes = query_params(query, this);
        console.log(answer);
        return answer;
    }
}

function example() {
    let gift = new KeyStatus(StatusType.GIFT, "gift");
    let shadow = new KeyStatus(StatusType.SHADOW, "shadow");
    let siddhi = new KeyStatus(StatusType.SIDDHI, "siddhi");
    let organs: string[] = ['plamani', 'inima', 'rinichi'];
    let index = 0;

    let gk: GeneKey = GeneKey.fromItems(index, GKConstants.MaxCodone, shadow, gift, siddhi, organs, ['em1', 'em2'], 23, 'dilemma some');
    let json: string = JSON.stringify(gk);
    console.log(json);
}


