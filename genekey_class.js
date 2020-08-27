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
        Queries the given gene key
     */
    query(query) {
        // Use object syntax so it's easy to get the properties
        let gkObj = this;
        let trimmedQuery = query.trim();
        let property = Object.keys(gkObj).filter(k => k == trimmedQuery);
        if (property.length == 1) {
            // Asked for an actual propery
            console.log(gkObj[trimmedQuery].toString());
            return;
        }
        console.log("Invalid query");
    }
}
var StatusType;
(function (StatusType) {
    StatusType[StatusType["SHADOW"] = 0] = "SHADOW";
    StatusType[StatusType["GIFT"] = 1] = "GIFT";
    StatusType[StatusType["SIDDHI"] = 2] = "SIDDHI";
})(StatusType || (StatusType = {}));
class KeyStatus {
    constructor(type, description) {
        this.type = type;
        this.description = description;
    }
    toString() {
        return `${this.type} => ${this.description}`;
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