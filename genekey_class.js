"use strict";
class GeneKey {
    /*
        constructs the object from the json
     */
    constructor(json) {
        this.index = json.index;
        this.shadow = json.shadow;
        this.gift = json.gift;
        this.siddhi = json.siddhi;
        this.organs = json.organs;
    }
    /*
        constructs the object form the items
     */
    static fromItems(index, shadow, gift, siddhi, organs) {
        let gkObj = {
            index: index,
            shadow: shadow,
            gift: gift,
            siddhi: siddhi,
            organs: organs
        };
        return new GeneKey(gkObj);
    }
    /*
        Constructs a deepclone of a genekey
     */
    deepClone() {
        let shadowC = new KeyStatus(this.shadow.type, this.shadow.description);
        let giftC = new KeyStatus(this.gift.type, this.gift.description);
        let siddhiC = new KeyStatus(this.siddhi.type, this.siddhi.description);
        let organsC = [];
        this.organs.forEach((org) => organsC.push(org));
        return GeneKey.fromItems(this.index, shadowC, giftC, siddhiC, organsC);
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
/*
 * Queries a given object seeing if the query is one of the properties
 */
function query_params(query, queried) {
    if (!queried) {
        console.log("made me query a null or undefined object");
        return "Query on null object";
    }
    let trimmedQuery = query.trim();
    let property = Object.keys(queried).filter(k => k == trimmedQuery);
    if (property.length == 1) {
        // Asked for an actual propery
        let answer = queried[trimmedQuery].toString();
        return answer;
    }
    return "Invalid query";
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
    let index = 1;
    let gk = GeneKey.fromItems(index, shadow, gift, siddhi, organs);
    let json = JSON.stringify(gk);
    console.log(json);
}
//# sourceMappingURL=genekey_class.js.map