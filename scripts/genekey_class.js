"use strict";
class GeneKey {
    /*
        constructs the object from the json
     */
    constructor(json) {
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
    static fromItems(index, codone, shadow, gift, siddhi, organs, emotions, partner, dilemma) {
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
        let organsC = this.organs.map((org) => org.slice());
        let emotionsC = this.emotions.map(em => em.slice());
        let dilemmaC = this.dilemma.slice();
        return GeneKey.fromItems(this.index, this.codone, shadowC, giftC, siddhiC, organsC, emotionsC, this.partner, dilemmaC);
    }
    /*
        Constructs a deepclone of a genekey with the new specified ID
     */
    deeplConeId(newId) {
        let gk = this.deepClone();
        gk.index = newId;
        return gk;
    }
    // Gets the codone associated with this key
    getCodone() {
        return codoneLibrary[this.codone];
    }
    // Gets the partner key associated to this genekey
    getPartner() {
        return geneKeyLibrary[this.partner];
    }
    /*
     *  Queries the given gene key
     */
    query(query) {
        // Use object syntax so it's easy to get the properties
        let answer = query_params(query, this);
        return answer;
    }
    // Formats the emotions into a single string
    formatEmotions() {
        let emotionsText = "";
        this.emotions.forEach(em => emotionsText += `${em} `);
        return emotionsText;
    }
    /*
     * Formats an HTML element to be shown based on the genekey
     */
    formatHTML() {
        let html = document.createElement('li');
        html.id = `gk-${this.index}`;
        html.className = 'card';
        html.innerHTML = `<h2>GeneKey ${this.index}</h2>
        <button id="codone-btn">Codone ${this.codone}</button>
        <div>\
Shadow: NAME\
            <p>${this.shadow.description}</p>
        </div>
        <div>
            Gift: NAME
            <p>${this.gift.description}</p>
        </div>
        <div>
            Siddhi: NAME
            <p>${this.siddhi.description}</p>
        </div>
        <p>Emotions: ${this.formatEmotions()}</p>
        <button id="partner-btn">Partner: GeneKey ${this.partner}</button>
        <p>Dilemma: ${this.dilemma}</p>
        `;
        // Add the click listeners for the codone and partner button
        const codoneButton = html.querySelector('button#codone-btn');
        const partnerButton = html.querySelector('button#partner-btn');
        codoneButton.addEventListener('click', () => console.log(this.getCodone()));
        partnerButton.addEventListener('click', () => console.log(this.getPartner()));
        console.log(html);
        console.log(codoneButton, partnerButton);
        return html;
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
            return { result: ans, succeeded: true };
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
    let gk = GeneKey.fromItems(index, GKConstants.MaxCodone, shadow, gift, siddhi, organs, ['em1', 'em2'], 23, 'dilemma some');
    let json = JSON.stringify(gk);
    console.log(json);
}
//# sourceMappingURL=genekey_class.js.map