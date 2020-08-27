var GeneKey = /** @class */ (function () {
    /*
        constructs the object from the json
     */
    function GeneKey(json) {
        this.index = json.index;
        this.shadow = json.shadow;
        this.gift = json.gift;
        this.siddhi = json.siddhi;
        this.organs = json.organs;
    }
    /*
        constructs the object form the items
     */
    GeneKey.fromItems = function (index, shadow, gift, siddhi, organs) {
        var gkObj = {
            index: index,
            shadow: shadow,
            gift: gift,
            siddhi: siddhi,
            organs: organs
        };
        return new GeneKey(gkObj);
    };
    GeneKey.prototype.deepClone = function () {
        var shadowC = new KeyStatus(this.shadow.type, this.shadow.description);
        var giftC = new KeyStatus(this.gift.type, this.gift.description);
        var siddhiC = new KeyStatus(this.siddhi.type, this.siddhi.description);
        var organsC = [];
        this.organs.forEach(function (org) { return organsC.push(org); });
        return GeneKey.fromItems(this.index, shadowC, giftC, siddhiC, organsC);
    };
    GeneKey.prototype.deeplConeId = function (newId) {
        var gk = this.deepClone();
        gk.index = newId;
        return gk;
    };
    return GeneKey;
}());
var StatusType;
(function (StatusType) {
    StatusType[StatusType["SHADOW"] = 0] = "SHADOW";
    StatusType[StatusType["GIFT"] = 1] = "GIFT";
    StatusType[StatusType["SIDDHI"] = 2] = "SIDDHI";
})(StatusType || (StatusType = {}));
var KeyStatus = /** @class */ (function () {
    function KeyStatus(type, description) {
        this.type = type;
        this.description = description;
    }
    return KeyStatus;
}());
function example() {
    var gift = new KeyStatus(StatusType.GIFT, "gift");
    var shadow = new KeyStatus(StatusType.SHADOW, "shadow");
    var siddhi = new KeyStatus(StatusType.SIDDHI, "siddhi");
    var organs = ['plamani', 'inima', 'rinichi'];
    var index = 1;
    var gk = GeneKey.fromItems(index, shadow, gift, siddhi, organs);
    var json = JSON.stringify(gk);
    console.log(json);
}
console.log("Imported: ", gk1.siddhi);
example();
