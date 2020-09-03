let mainSection = document.getElementById('gk-section')!;
let sectionUl = mainSection.querySelector('ul')!;

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
                    let err = document.createElement('li');
                    err.className = 'card';
                    err.textContent = answer.value as string;
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
                default: {
                    console.log("ALL KEYS RELATED TO ORGAN");
                    break;
                }
            }

        }
    }
    , false);
}

const newKey = geneKeyLibrary[32].formatHTML();
const newCodone = codoneLibrary[15].formatHTML();

sectionUl.appendChild(newKey);
sectionUl.appendChild(newCodone);

