const mainSection = document.getElementById('gk-section')!;
const sectionUl = mainSection.querySelector('ul')!;

const dilemmasBtn = document.getElementById('dilemmas-btn')!;
const aminoacidsBtn = document.getElementById('aminoacids-btn')!;
const organsBtn = document.getElementById('organs-btn')!;
const keywordsBtn = document.getElementById('keywords-btn')!;

const DILEMMA_LIBRARY_ID = "dielmmas-lib";
const AMINOACID_LIBRARY_ID = "aminoacid-lib";
const ORGANS_LIBRARY_ID = "organs-lib";
const KEYWORDS_LIBRARY_ID = "keywords-lib";

/*
 * Handles the 'click' event listener of a given library button
 */
function handleLibraryClick(libId: string, formatFun: (el: HTMLElement) => void) {
    let maybeLib: HTMLElement | null = document.getElementById(libId);
    if (maybeLib) {
       if (maybeLib.style.display === 'none') {
            maybeLib.style.display = 'block';
       } else {
            maybeLib.style.display = 'none';
       }
    } else {
        // not created yet
        const lib: HTMLElement = document.createElement('li');
        lib.id = libId;
        lib.className = 'linebreaker';
        lib.classList.add('card');
        formatFun(lib);

        sectionUl.appendChild(lib);
    }

}

dilemmasBtn.addEventListener('click', () => {
    handleLibraryClick(DILEMMA_LIBRARY_ID, (htmlEl: HTMLElement) => {
            dilemmaLibrary.forEach(line => htmlEl.textContent += `${line}\n\n`);
        });
});

aminoacidsBtn.addEventListener('click', () => {
    handleLibraryClick(AMINOACID_LIBRARY_ID, (htmlEl: HTMLElement) => {

        Object.keys(aminoacidLibrary).forEach(acid => {
            const keys: number[] = aminoacidLibrary[acid];
            let keysString = "";
            keys.forEach(k => keysString += `${k} `);

            htmlEl.textContent += `Acid: ${acid.toUpperCase()} has keys: ${keysString}\n\n`;
        });
    });
});

organsBtn.addEventListener('click', () => {
    handleLibraryClick(ORGANS_LIBRARY_ID, (htmlEl: HTMLElement) => {
        for (let i = 0; i < sortedOrgans.length; i++) {
            let [org, keys]: [string, number[]] = sortedOrgans[i];
            let keysString = "";

            keys.forEach(k => keysString += `${k} `);
            htmlEl.textContent += `Organ ${org.toUpperCase()} has keys: ${keysString}\n\n`;

        }
    });
});


keywordsBtn.addEventListener('click', () => {
    handleLibraryClick(KEYWORDS_LIBRARY_ID, (htmlEl: HTMLElement) => {
        for (let i = 0; i < sortedKeywords.length; i++) {
            let [kw, keys]: [string, number[]] = sortedKeywords[i];
            let keysString = "";

            keys.forEach(k => keysString += `${k} `);
            htmlEl.textContent += `Keyword ${kw.toUpperCase()} has keys: ${keysString}\n\n`;

        }
    });
});


const queryForm = document.getElementById('query-form');
if (queryForm) {
    queryForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let inp = queryForm.querySelector('input');
        if (inp) {

            if (!inp.value) {
                // If there is no input, just clear the list
                sectionUl.textContent = '';
                return;
            }
            let answer: GKQueryResult = generalQuery(inp.value);
            console.log(answer);
            inp.value = '';
            switch (answer._type) {
                case GKQueryDiscriminant.QUERY_ERR: {
                    sectionUl.textContent = '';
                    let err: HTMLElement = document.createElement('li');
                    err.className = 'card';
                    err.textContent = answer.value as string;
                    sectionUl.appendChild(err);
                    break;
                }
                case GKQueryDiscriminant.TYPE_QUERY_GENE: {
                    let ans = answer.value as QueryGene;
                    sectionUl.appendChild(ans.gk.formatHTML());
                    break;
                }
                case GKQueryDiscriminant.TYPE_QUERY_CODONE: {
                    let ans = answer.value as QueryCodone;
                    sectionUl.appendChild(ans.codone.formatHTML());
                    break;
                }
                case GKQueryDiscriminant.TYPE_CODONE_BLUES: {
                    let ans = answer.value as QueryCodone; 
                    sectionUl.appendChild(ans.codone.formatBlues());
                    break;
                }
                case GKQueryDiscriminant.TYPE_PARTNER_BLUES: {
                    const ans = answer.value as QueryGene;
                    sectionUl.appendChild(ans.gk.bluesWithPartner());
                    break;
                }
                case GKQueryDiscriminant.TYPE_CHANNEL_BLUES: {
                    const ans = answer.value as QueryGene;
                    sectionUl.appendChild(ans.gk.bluesWithChannel());
                    break;
                }
                default: {
                    let ans = answer.value as QueryGKCollection;
                    sectionUl.appendChild(ans.formatHTML());
                    break;
                }
            }

        }
    }
    , false);
}

