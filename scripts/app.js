"use strict";
let mainSection = document.getElementById('gk-section');
let sectionUl = mainSection.querySelector('ul');
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
            let answer = generalQuery(inp.value);
            console.log(answer);
            inp.value = '';
            switch (answer._type) {
                case GKQueryDiscriminant.QUERY_ERR: {
                    sectionUl.textContent = '';
                    let err = document.createElement('li');
                    err.className = 'card';
                    err.textContent = answer.value;
                    sectionUl.appendChild(err);
                    break;
                }
                case GKQueryDiscriminant.TYPE_QUERY_GENE: {
                    let ans = answer.value;
                    sectionUl.appendChild(ans.gk.formatHTML());
                    break;
                }
                case GKQueryDiscriminant.TYPE_QUERY_CODONE: {
                    let ans = answer.value;
                    sectionUl.appendChild(ans.codone.formatHTML());
                    break;
                }
                default: {
                    let ans = answer.value;
                    sectionUl.appendChild(ans.formatHTML());
                    break;
                }
            }
        }
    }, false);
}
//# sourceMappingURL=app.js.map