class GeneKey {
    index: number;
    shadow: KeyStatus;
    gift: KeyStatus;
    siddhi: KeyStatus;
    organs: string[]; // really a set, but JSON doesn't support

    /*
        constructs the object from the json
     */
    public constructor(json:any) {
        this.index = json.index;
        this.shadow = json.shadow;
        this.gift = json.gift;
        this.siddhi = json.siddhi;
        this.organs = json.organs;
    }


    /*
        constructs the object form the items
     */
    public static fromItems(index: number, shadow: KeyStatus, gift: KeyStatus, siddhi: KeyStatus, organs: string[]): GeneKey {
        let gkObj = {
            index: index,
            shadow: shadow,
            gift: gift,
            siddhi: siddhi,
            organs: organs
        }
        return new GeneKey(gkObj);

    }


    /*
        Constructs a deepclone of a genekey
     */
    public deepClone(): GeneKey {
        let shadowC = new KeyStatus(this.shadow.type, this.shadow.description);
        let giftC = new KeyStatus(this.gift.type, this.gift.description);
        let siddhiC = new KeyStatus(this.siddhi.type, this.siddhi.description);
        let organsC: string[] = [];
        this.organs.forEach((org) => organsC.push(org));

        return GeneKey.fromItems(this.index, shadowC, giftC, siddhiC, organsC);
    }

    /*
        Constructs a deepclone of a genekey with the new specified ID
     */
    deeplConeId(newId: number): GeneKey {
        let gk = this.deepClone();
        gk.index = newId;
        return gk
    }

    /*
        Queries the given gene key
     */
    public query(query: string) {
        // Use object syntax so it's easy to get the properties
        let gkObj = this as any;
        let trimmedQuery: string = query.trim();
        let property: string[] = Object.keys(gkObj).filter(k => k == trimmedQuery);
        if (property.length == 1) {  
            // Asked for an actual propery
            console.log(gkObj[trimmedQuery].toString());
            return;
        }
        console.log("Invalid query");
    }
}

enum StatusType {
    SHADOW, GIFT, SIDDHI
}

class KeyStatus {
    type: StatusType;
    description: string;
    public constructor(type: StatusType, description: string) {
        this.type = type;
        this.description = description;
    }

    public toString(): string {
        return `${this.type} => ${this.description}`;
    }
}

function example() {
    let gift = new KeyStatus(StatusType.GIFT, "gift");
    let shadow = new KeyStatus(StatusType.SHADOW, "shadow");
    let siddhi = new KeyStatus(StatusType.SIDDHI, "siddhi");
    let organs: string[] = ['plamani', 'inima', 'rinichi'];
    let index = 1;

    let gk: GeneKey = GeneKey.fromItems(index, shadow, gift, siddhi, organs);
    let json: string = JSON.stringify(gk);
    console.log(json);
}

