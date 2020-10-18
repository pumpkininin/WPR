const btnStart = document.querySelector(".btn-start");
const btnSubmitContainer = document.querySelector(".attempt")
//const btnReviewContainer = document.querySelector(".review")
const btnSubmit = document.querySelector(".btn-submit");
const btnTryAgain = document.querySelector(".btn-review")
document.querySelector("#attempt-quiz").classList.add("hidden");
document.querySelector("#review-quiz").classList.add("hidden");
btnSubmit.addEventListener("click",event =>{
    const answer_pack = createAnswerPack();
    pack_id = document.querySelector("#attempt-quiz").childNodes[1].id
    submitAPI(pack_id ,answer_pack).then(response =>{
        document.querySelector(".score").innerHTML = `${response.score}/10`
        document.querySelector(".percent").innerHTML = `${response.score*10}%`
        document.querySelector(".text").innerHTML = `${response.scoreText}`
        var inputs = document.getElementsByTagName('input');
        for(let i = 0; i < inputs.length; i++)
        {
            if(inputs[i].type == 'radio')
            {
                inputs[i].disabled = true;
            }
        }
        var inputContainer = document.getElementsByTagName('span');
        for(let i = 0; i < inputs.length; i++)
        {
            inputContainer[i].removeEventListener('click',chooseAnswer);
            
        }
        for (const [key, value] of Object.entries(response.correctAnswers)){
            
            const answerList = document.getElementById(`${key}`).childNodes
            for(i of answerList){
                if(i.classList.contains("selected")){
                        if(i.id === String(value)){
                            i.classList.add('correct')
                        }else{
                            i.classList.add('wrong')
                        }
                }
            }
            answerList[value].classList.add('selected')
        }
        //console.log(response.correctAnswers);
    })
    btnSubmitContainer.classList.add('hidden')
    document.querySelector("#review-quiz").classList.remove("hidden")
})
btnStart.addEventListener("click",createQuestion);
async function getAPI(){
    let response = await fetch("https://wpr-quiz-api.herokuapp.com/attempts",{
    method: "POST",
    headers:{
        'Content-Type': 'application/json'
    },
});
let result = await response.json();
return result;
};

const question_contanier = getAPI();
function createQuestion(){
    question_contanier.then(result => {
        questionContanier = document.createElement("div")
        questionContanier.id = result._id
        for(let key = 0; key <result.questions.length; key++) {
            const breakQues = document.createElement("div")
            breakQues.className = "break-question"
            
            const questionForm = document.createElement('form');
            const questionNo = document.createElement('h2')
            questionNo.innerHTML = `Question ${Number(key)+1} of 10`;
            questionForm.appendChild(breakQues)
            questionForm.appendChild(questionNo)
            const question = document.createElement('p')
            let questionBox = document.createElement('div')
            questionBox.className = `question-box-${key}`
            questionBox.id = result.questions[key]._id
            newBreakQues1 = breakQues.cloneNode(true)
            questionForm.appendChild(newBreakQues1)
            questionForm.appendChild(question)
            
            newBreakQues2 = breakQues.cloneNode(true)
            questionForm.appendChild(newBreakQues2)
            questionForm.appendChild(questionBox)
            question.innerHTML = escapeHtml(result.questions[key].text);
            for(answerIndex in result.questions[key].answers){
                const input = document.createElement("span")
                input.id = answerIndex
                input.addEventListener("click",chooseAnswer )
                const breakInput = document.createElement('br');
                const answer = document.createElement('input');
                answer.type = 'radio'
                answer.id = "question" + String(key+1);
                answer.name = `q${key}`
                const answerLabel = document.createElement('label')
                answerLabel.for = answer.id;
                answerLabel.innerHTML = escapeHtml(result.questions[key].answers[answerIndex])
                input.appendChild(answer)
                input.appendChild(answerLabel)
                input.appendChild(breakInput)
                questionBox.appendChild(input)
            }
            
            questionContanier.appendChild(questionForm)
            
        }
        
        document.querySelector("#attempt-quiz").classList.remove("hidden")
        document.querySelector("#attempt-quiz").insertBefore(questionContanier,document.querySelector(".break-question"))
        document.querySelector("#introduction").classList.add("hidden")
        
        
    }).catch(error => {
        alert(error)
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
    const answer = event.currentTarget
    const parent = answer.parentNode;
    const answerList = parent.childNodes;
    for(i of answerList){
        if(i.classList.contains("selected")){
            i.classList.remove("selected");
        }
    }
    answer.classList.add("selected");
    answer.childNodes[0].checked = true;
    
}


answer_pack = {
    "answers":{
        
    }
}

async function submitAPI(pack_id, answer_pack){
    const URL = 'https://wpr-quiz-api.herokuapp.com/attempts/' + String(pack_id)+ '/submit'
    let response = await fetch(URL,{
        method: 'POST',
        headers: {'Content-Type': 'application/json'
    },
    body: JSON.stringify(answer_pack)
    
});
let result = await response.json();
return result;
}


function createAnswerPack() {
    const sectionAttempt = document.querySelector("#attempt-quiz").childNodes
    const formContainer = sectionAttempt[1].childNodes
    for(let i  = 0; i < formContainer.length; i++) {
        const questionBox = document.querySelector(`.question-box-${i}`)
        const questionId = questionBox.id
        const answerList = questionBox.childNodes
        for(j of answerList) {
            if(j.className === "selected"){
                answer_pack['answers'][questionId] = j.id
            }
        }
        
    }
    return answer_pack
    
}