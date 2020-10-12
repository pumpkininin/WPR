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
            let questionBox = document.createElement('div')
            questionBox.className = "question-box"
            questionForm.appendChild(question)
            questionForm.appendChild(questionBox)
            question.innerHTML = escapeHtml(result.questions[0].text);
            
            
            for(answerIndex in result.questions[key].answers){
                const input = document.createElement("span")
                questionBox.addEventListener("click",chooseAnswer)
                const breakInput = document.createElement('br');
                console.log(result.questions[key].answers[answerIndex])
                const answer = document.createElement('input');
                answer.type = 'radio'
                answer.id = "question" + String(key+1);
                answer.name = "q"+ String(Number(key)+1);
                answer.addEventListener("click",chooseAnswer)
                const answerLabel = document.createElement('label')
                answerLabel.for = answer.id;
                answerLabel.innerHTML = escapeHtml(result.questions[key].answers[answerIndex])
                input.appendChild(answer)
                input.appendChild(answerLabel)
                input.appendChild(breakInput)
                questionBox.appendChild(input)
                
            }
            
            document.querySelector("#attempt-quiz").appendChild(questionForm)
            
        }
    })
}
function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
 }
 function chooseAnswer(event){
     const answer = event.target
     const selectedAnswer = document.querySelector(".selected");
     if(selectedAnswer){
         selectedAnswer.classList.remove("selected")
     }
     const node =document.body.answer.chlidNodes;
     console.log(node)
     answer.classList.add("selected")

 }






