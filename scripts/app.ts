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

dilemmasBtn.addEventListener('click', () => {
    let maybeLib: HTMLElement | null = document.getElementById(DILEMMA_LIBRARY_ID);
    if (maybeLib) {
       if (maybeLib.style.display === 'none') {
            maybeLib.style.display = 'block';
       } else {
            maybeLib.style.display = 'none';
       }
    } else {
        // not created yet
        const lib: HTMLElement = document.createElement('div');
        lib.id = DILEMMA_LIBRARY_ID;
        lib.className = 'linebreaker';
        dilemmaLibrary.forEach(line => lib.textContent += `${line}\n`);

        sectionUl.appendChild(lib);
    }
});

aminoacidsBtn.addEventListener('click', () => {
    console.log(aminoacidLibrary);
});

organsBtn.addEventListener('click', () => {
    console.log(sortedOrgans);
});


keywordsBtn.addEventListener('click', () => {
    console.log(sortedKeywords);
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

