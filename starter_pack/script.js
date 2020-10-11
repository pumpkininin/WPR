    // TODO(you): Write the JavaScript necessary to complete the assignment.
    const btnStart = document.querySelector(".btn-start");
    
    btnStart.addEventListener("click",createQuestion);
    async function getAPI(data){
        let response = await fetch("https://wpr-quiz-api.herokuapp.com/attempts",{
        method: "POST",
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    let result = await response.json();
    return result;
};
const question_contanier = getAPI();
question_contanier.then(function(result) {
    const noOfQuest = result.questions.length
    console.log(noOfQuest)
    console.log(result)
})

function createQuestion(){
    question_contanier.then(function(result) {
        for(key in result.questions){
            const questionForm = document.createElement('form');
            const questionNo = document.createElement('h2')
            questionNo.innerHTML = "Question " + String(Number(key) + 1) + " of 10" 
            questionForm.appendChild(questionNo)
            const question = document.createElement('p')
            question.innerHTML = result.questions[0].text;
            for(answerIndex in result.questions.answer){
                const answer = document.createElement('input');
                answer.type = 'radio'
                answer.id = "question" + String(key+1);
                const answerLabel = document.createElement('label')
                answerLabel.for = answer.id;
                answerLabel.innerHTML = result.questions.answer[answerIndex]
            }
            document.querySelector("#attempt-quiz").appendChild(questionForm)
            
        }
    })
}







