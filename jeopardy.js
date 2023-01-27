// categories is the main data structure for the app; it looks like this:

//  [
//    { title: "Math",
//      clues: [
//        {question: "2+2", answer: 4, showing: null},
//        {question: "1+1", answer: 2, showing: null}
//        ...
//      ],
//    },
//    { title: "Literature",
//      clues: [
//        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//        {question: "Bell Jar Author", answer: "Plath", showing: null},
//        ...
//      ],
//    },
//    ...
//  ]

let categories = [];

/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */

async function getCategoryIds() {
    const res = await axios.get(`http://jservice.io/api/random?count=6`);
    return res.data.map(function(obj){
        return obj.category_id;
    })
}

/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */

async function getCategory(catId) {
    const res = await axios.get(`http://jservice.io/api/category?id=${catId}`);
    const clues = [];
    console.log(res);

        for (let i=0; i <= 4; i++){
        if (res.data.clues.length > 50){
            const clue = res.data.clues[Math.floor(Math.random()*res.data.clues.length)];
            clues.push( {question: clue.question, answer: clue.answer, showing: null} );
        } else if (res.data.clues.length >= 5){
            const clue = res.data.clues[i];
            clues.push( {question: clue.question, answer: clue.answer, showing: null} );
        } else {
            alert(`Category ${i+1} generated less than 5 clues - Try again :(`)
            location.reload();
            break;
        }}

    categories.push( { title: res.data.title, clues: clues } );
}

/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

async function fillTable() {
    $(`thead`).append(`<tr id="rowCat">`);
    for (let i=0; i <= 5; i++){
        $(`#rowCat`).append(`<th class='cat${i+1}'>${categories[i].title}</th>`);
    }
    for (let i=0; i <= 4; i++){
        $(`tbody`).append(`<tr class='row${i+1}'></tr>`);
        for (let j=0; j <= 5; j++){
            const currQ = categories[j].clues[i].question;
            const currA = categories[j].clues[i].answer;
            const currClass = `<td class='cat${j+1}clue${i+1}'>?</td>`
            $(`.row${i+1}`).append(`${currClass}`);
        }   
    }
}

/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

function handleClick(evt) {
    $(`td`).on(`click`, function(evt){
        const catClue = $(this)[0].classList[0];
        const catNum = catClue[3];
        const clueNum = catClue[8];
        const currQ = (categories[catNum-1].clues[clueNum-1].question);
        const currA = (categories[catNum-1].clues[clueNum-1].answer);

        if (categories[catNum-1].clues[clueNum-1].showing === null){
            evt.target.innerHTML = `${currQ}`;
            categories[catNum-1].clues[clueNum-1].showing = `question`;
        } else if (evt.target.innerText !== `?`){
            evt.target.innerHTML = `${currA}`;
            categories[catNum-1].clues[clueNum-1].showing = `answer`;
        }
    })
}

/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

function showLoadingView() {
    $(`thead`).empty();
    $(`tbody`).empty();
    $(`#spin-container`).show();
}

/** Remove the loading spinner and update the button used to fetch data. */

function hideLoadingView() {
    $(`#spin-container`).hide();
}

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function setupAndStart() {
    showLoadingView()
    const cats = await getCategoryIds();
    for (let id of cats){
        await getCategory(id);
    }
    hideLoadingView();
    fillTable();
    handleClick();
}

/** On click of start / restart button, set up game. */
$(`#start`).on(`click`, function(){
    categories = [];
    setupAndStart();
    $(`#start`).attr(`id`, `restart`);
    $(`#restart`).text(`Restart Game`);
})

/** On page load, add event handler for clicking clues */

// TODO

// moved to line 135