"use strict";
class GeneKey {
    /*
        constructs the object from the json
     */
    constructor(json) {
        this.index = json.index;
        this.codoneIndex = json.codoneIndex;
        this.shadow = json.shadow;
        this.gift = json.gift;
        this.siddhi = json.siddhi;
        this.organs = json.organs;
    }
    /*
        constructs the object form the items
     */
    static fromItems(index, codoneIndex, shadow, gift, siddhi, organs) {
        let gkObj = {
            index: index,
            codoneIndex: codoneIndex,
            shadow: shadow,
            gift: gift,
            siddhi: siddhi,
            organs: organs
        };
        return new GeneKey(gkObj);
    }
    toJson() {
        return JSON.stringify(this);
    }
    /*
        Constructs a deepclone of a genekey
     */
    deepClone() {
        let shadowC = new KeyStatus(this.shadow.type, this.shadow.description.slice());
        let giftC = new KeyStatus(this.gift.type, this.gift.description.slice());
        let siddhiC = new KeyStatus(this.siddhi.type, this.siddhi.description.slice());
        let organsC = [];
        this.organs.forEach((org) => organsC.push(org.slice()));
        return GeneKey.fromItems(this.index, this.codoneIndex, shadowC, giftC, siddhiC, organsC);
    }
    /*
        Constructs a deepclone of a genekey with the new specified ID
     */
    deeplConeId(newId) {
        let gk = this.deepClone();
        gk.index = newId;
        return gk;
    }
    /*
     *  Queries the given gene key
     */
    query(query) {
        // Use object syntax so it's easy to get the properties
        let answer = query_params(query, this);
        console.log(answer);
        return answer;
    }
}
var StatusType;
(function (StatusType) {
    StatusType["SHADOW"] = "SHADOW";
    StatusType["GIFT"] = "GIFT";
    StatusType["SIDDHI"] = "SIDDHI";
})(StatusType || (StatusType = {}));
class KeyStatus {
    constructor(type, description) {
        this.type = type;
        this.description = description;
    }
    typeToString() {
        if (this.type === StatusType.GIFT) {
            return "GIFT";
        }
        if (this.type === StatusType.SHADOW) {
            return "SHADOW";
        }
        return "SIDDHI";
    }
    toString() {
        return `${this.type} => ${this.description}`;
    }
    query(query) {
        if (query.trim() === 'type') {
            let ans = this.typeToString();
            console.log(ans);
            return ans;
        }
        let answer = query_params(query, this);
        console.log(answer);
        return answer;
    }
}
function example() {
    let gift = new KeyStatus(StatusType.GIFT, "gift");
    let shadow = new KeyStatus(StatusType.SHADOW, "shadow");
    let siddhi = new KeyStatus(StatusType.SIDDHI, "siddhi");
    let organs = ['plamani', 'inima', 'rinichi'];
    let index = 0;
    let gk = GeneKey.fromItems(index, GKConstants.MaxCodone, shadow, gift, siddhi, organs);
    let json = JSON.stringify(gk);
    console.log(json);
}
//# sourceMappingURL=genekey_class.js.map