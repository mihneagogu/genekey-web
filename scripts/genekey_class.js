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
        this.aminoacid = json.aminoacid;
        this.keywords = json.keywords;
        this.channel = json.channel;
    }
    /*
        constructs the object form the items
     */
    static fromItems(index, codone, shadow, gift, siddhi, organs, emotions, partner, dilemma, aminoacid, keywords, channel) {
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
            aminoacid: aminoacid,
            keywords: keywords,
            channel: channel,
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
        const shadowC = new KeyStatus(this.shadow.type, this.shadow.description.slice());
        const giftC = new KeyStatus(this.gift.type, this.gift.description.slice());
        const siddhiC = new KeyStatus(this.siddhi.type, this.siddhi.description.slice());
        const organsC = this.organs.map((org) => org.slice());
        const emotionsC = this.emotions.map(em => em.slice());
        const dilemmaC = this.dilemma.slice();
        const aminoacid = this.aminoacid.slice();
        const { keys, name } = this.channel;
        const channel_c = { keys: [keys[0], keys[1]], name: name.slice() };
        const keywords_c = this.keywords.map(s => s.slice());
        return GeneKey.fromItems(this.index, this.codone, shadowC, giftC, siddhiC, organsC, emotionsC, this.partner, dilemmaC, aminoacid, keywords_c, channel_c);
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
    // Formats the emotions into a single string
    formatOrgans() {
        let organsText = "";
        this.organs.forEach(org => organsText += `${org} `);
        return organsText;
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
        <p>Organs: ${this.formatOrgans()}</p>
        <button id="partner-btn">Partner: GeneKey ${this.partner}</button>
        <p>Dilemma: ${this.dilemma}</p>
        `;
        // Add the click listeners for the codone and partner button
        const codoneButton = html.querySelector('button#codone-btn');
        const partnerButton = html.querySelector('button#partner-btn');
        codoneButton.addEventListener('click', () => {
            sectionUl.appendChild(this.getCodone().formatHTML());
        });
        partnerButton.addEventListener('click', () => {
            sectionUl.appendChild(this.getPartner().formatHTML());
        });
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
    let aminoacid = 'valine';
    let keywords = ['discipline', 'influence'];
    let channel = { keys: [index, 7], name: 'Channel of facilitation' };
    let gk = GeneKey.fromItems(index, GKConstants.MaxCodone, shadow, gift, siddhi, organs, ['em1', 'em2'], 23, 'dilemma some', aminoacid, keywords, channel);
    let json = JSON.stringify(gk);
    console.log(json);
}
//# sourceMappingURL=genekey_class.js.map