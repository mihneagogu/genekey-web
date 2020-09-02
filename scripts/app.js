"use strict";
const queryForm = document.getElementById('query-form');
if (queryForm) {
    queryForm.addEventListener('submit', (e) => {
        console.log('submitted to query form');
        e.preventDefault();
        let inp = queryForm.querySelector('input');
        if (inp) {
            console.log(inp.value);
            inp.value = '';
        }
    }, false);
}
console.log(generalQuery('gk 32'));
console.log(generalQuery('gk 32 emotions'));
console.log(generalQuery('gk 32 dilemma'));
console.log(generalQuery('gk 32 partner'));
console.log(generalQuery('gk 32 codone keys'));
console.log(generalQuery('gk 32 organs'));
console.log(generalQuery('allorgans inima'));
//# sourceMappingURL=app.js.map