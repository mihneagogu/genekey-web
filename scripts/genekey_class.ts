interface Channel {
    keys: [number, number];
    name: string;
}

function formatChannel(chan: Channel): HTMLElement {
    const div: HTMLElement = document.createElement('div');
    const [left, right] = chan.keys;
    const blueLeft = geneKeyLibrary[left].blues();
    const blueRight = geneKeyLibrary[right].blues();

    div.innerHTML = `<h3>${chan.name}</h3>`;
    div.appendChild(blueLeft);
    div.appendChild(blueRight);

    return div;
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
    iching: string;
    keywords: string[];
    channel: Channel;

    /*
        constructs the object from the json
     */
    public constructor(json:any) {
        this.index = json.index;
        this.codone = json.codone;
        this.shadow = KeyStatus.fromJson(json.shadow);
        this.gift = KeyStatus.fromJson(json.gift);
        this.siddhi = KeyStatus.fromJson(json.siddhi);
        this.organs = json.organs;
        this.emotions = json.emotions;
        this.partner = json.partner;
        this.dilemma = json.dilemma;
        this.aminoacid = json.aminoacid;
        this.iching = json.iching;
        this.keywords = json.keywords;
        this.channel = json.channel;
    }

    public bluesWithChannel(): HTMLElement {
        return formatChannel(this.channel);
    }

    public bluesWithPartner(): HTMLElement {
        let div: HTMLElement = document.createElement('div');
        const thisBlue = this.blues();
        const partnerBlue = this.getPartner().blues();
        div.appendChild(thisBlue);
        div.appendChild(partnerBlue);
        return div;
    }

    /*
     * Returns the blue attributes from a genekey, 
     * as a HTML element
     */
    public blues(): HTMLElement {
        let html = document.createElement('li');
        html.id = `gk-${this.index}`;
        html.className = 'card';

        html.innerHTML = `<h2>GeneKey ${this.index}</h2>
        <p>Emotions: ${this.formatEmotions()}</p>
        <p>Organs: ${this.formatOrgans()}</p>
        <p>Dilemma: ${this.dilemma}</p>
        <p>Aminoacid: ${this.aminoacid}</p>
        <p>Keywords: ${this.formatKeywords()}</p>
        `;

        console.log("binded to");
        console.log(this.siddhi);
        html.appendChild(this.siddhi.toButton(html));
        html.appendChild(this.gift.toButton(html));
        html.appendChild(this.shadow.toButton(html));

        return html;
        
    }


    /*
        constructs the object form the items
     */
    public static fromItems(index: number, codone: number, shadow: KeyStatus, gift: KeyStatus, siddhi: KeyStatus, 
                            organs: string[], emotions: string[], partner: number, dilemma: string,
                            aminoacid: string, iching: string, keywords: string[], channel: Channel): GeneKey {
        let gkObj = {
            index: index,
            codone: codone,
            shadow: KeyStatus.fromJson(shadow),
            gift: KeyStatus.fromJson(gift),
            siddhi: KeyStatus.fromJson(siddhi),
            organs: organs,
            emotions: emotions,
            partner: partner,
            dilemma: dilemma,
            aminoacid: aminoacid,
            iching: iching,
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
        const iching_c: string = this.iching.slice();

        return GeneKey.fromItems(this.index, this.codone, shadowC, giftC, siddhiC, organsC, emotionsC, this.partner, dilemmaC, aminoacid, iching_c, keywords_c, channel_c);
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
    public  getPartner(): GeneKey {
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


    // Fromats all the keywords into one string
    private formatKeywords(): string {
        let keywords: string = "";
        this.keywords.forEach(kw => keywords += `${kw} `);;
        return keywords;
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
        <p>Aminoacid: ${this.aminoacid}</p>
        <p>Iching: ${this.iching}</p>
        <p>Keywords: ${this.formatKeywords()}</p>
        <p>Channel: ${this.channel.name}</p>
        <p>Emotions: ${this.formatEmotions()}</p>
        <p>Organs: ${this.formatOrgans()}</p>
        <button id="partner-btn">Partner: GeneKey ${this.partner}</button>
        <p>Dilemma: ${this.dilemma}</p>
        `;

        html.appendChild(this.siddhi.toButton(html));
        html.appendChild(this.gift.toButton(html));
        html.appendChild(this.shadow.toButton(html));

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

    public static fromJson(json: any): KeyStatus {
        const type: StatusType = json.type as StatusType;
        const desc: string = json.description as string;
        return new KeyStatus(type, desc);
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

    // Formats the keystatus so that it shows description on click
    public toButton(gkElement: HTMLElement): HTMLElement {

        const btn: HTMLElement = document.createElement('button');

        btn.className = 'alt';
        btn.textContent = this.typeToString();

        const desc: HTMLElement = document.createElement('p');
        const id: string = `${this.type.toString()}-para`;
        desc.id = id;
        desc.textContent = this.description;

        btn.addEventListener('click', () => {
            if (gkElement.querySelector(`#${id}`)) {
                if (desc.style.display === 'none') {
                    desc.style.display = 'block';
                    return;
                }
                desc.style.display = 'none';
            } else {
                gkElement.appendChild(desc);
            }
        }); 

        return btn;
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

    let gk: GeneKey = GeneKey.fromItems(index, GKConstants.MaxCodone, shadow, gift, siddhi, organs, ['em1', 'em2'], 23, 'dilemma some', aminoacid, 'some iching', keywords, channel);
    let json: string = JSON.stringify(gk);
    console.log(json);
}


