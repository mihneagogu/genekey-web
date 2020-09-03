let mainSection = document.getElementById('gk-section')!;
let sectionUl = mainSection.querySelector('ul')!;

const queryForm = document.getElementById('query-form');
if (queryForm) {
    queryForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let inp = queryForm.querySelector('input');
        if (inp) {
            let answer = generalQuery(inp.value);
            console.log(answer);
            inp.value = '';
        }
    }
    , false);
}

const newKey = geneKeyLibrary[32].formatHTML();
const newCodone = codoneLibrary[15].formatHTML();

sectionUl.appendChild(newKey);
sectionUl.appendChild(newCodone);

