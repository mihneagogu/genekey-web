interface Channel {
    keys: [number, number];
    name: string;
}
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
    aminoacid: string;
    keywords: string[];
    channel: Channel;

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
        this.aminoacid = json.aminoacid;
        this.keywords = json.keywords;
        this.channel = json.channel;
    }


    /*
        constructs the object form the items
     */
    public static fromItems(index: number, codone: number, shadow: KeyStatus, gift: KeyStatus, siddhi: KeyStatus, 
                            organs: string[], emotions: string[], partner: number, dilemma: string,
                            aminoacid: string, keywords: string[], channel: Channel): GeneKey {
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
        const shadowC = new KeyStatus(this.shadow.type, this.shadow.description.slice());
        const giftC = new KeyStatus(this.gift.type, this.gift.description.slice());
        const siddhiC = new KeyStatus(this.siddhi.type, this.siddhi.description.slice());
        const organsC: string[] = this.organs.map((org) => org.slice());
        const emotionsC: string[] = this.emotions.map(em => em.slice());
        const dilemmaC: string = this.dilemma.slice();
        const aminoacid: string = this.aminoacid.slice();
        const { keys, name } = this.channel;
        const channel_c: Channel = { keys: [keys[0], keys[1]], name: name.slice() };
        const keywords_c: string[] = this.keywords.map(s => s.slice());

        return GeneKey.fromItems(this.index, this.codone, shadowC, giftC, siddhiC, organsC, emotionsC, this.partner, dilemmaC, aminoacid, keywords_c, channel_c);
    }

    /*
        Constructs a deepclone of a genekey with the new specified ID
     */
    deeplConeId(newId: number): GeneKey {
        let gk = this.deepClone();
        gk.index = newId;
        return gk;
    }

    // Gets the codone associated with this key
    private getCodone(): CodoneRing {
        return codoneLibrary[this.codone];
    }

    // Gets the partner key associated to this genekey
    private getPartner(): GeneKey {
        return geneKeyLibrary[this.partner];
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


    // Formats the emotions into a single string
    private formatOrgans(): string {
        let organsText: string = "";
        this.organs.forEach(org => organsText += `${org} `);
        return organsText;
    }
    /*
     * Formats an HTML element to be shown based on the genekey
     */

    public formatHTML(): HTMLElement {
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
        const codoneButton = html.querySelector('button#codone-btn')!;
        const partnerButton = html.querySelector('button#partner-btn')!;

        codoneButton.addEventListener('click', () => {
            sectionUl.appendChild(this.getCodone().formatHTML());
        });
        partnerButton.addEventListener('click', () => {
            sectionUl.appendChild(this.getPartner().formatHTML());
        });

        return html;
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
    let aminoacid: string = 'valine';
    let keywords: string[] = ['discipline', 'influence'];
    let channel: Channel = {keys: [index, 7], name: 'Channel of facilitation'};

    let gk: GeneKey = GeneKey.fromItems(index, GKConstants.MaxCodone, shadow, gift, siddhi, organs, ['em1', 'em2'], 23, 'dilemma some', aminoacid, keywords, channel);
    let json: string = JSON.stringify(gk);
    console.log(json);
}


