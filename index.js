document.querySelector('form').addEventListener('submit', handleSubmitForm); 

var state = {
}

function onLoad() {
    if (localStorage.length > 0){
        let userData = JSON.parse(JSON.stringify(localStorage))
        for(let key in userData) {
            state.users = []
            state.users.push(JSON.parse(userData[key]))
            addCard(state.users[state.users.length-1])
        }
    }else{
        state.users = []
    }
}

function handleSubmitForm(e) {
    e.preventDefault();
    let person = {
        name: '', 
        age: '', 
        count: ''
    }
    let input = document.querySelector('input'); 
    if(input.value === "Name" || input.value.trim() === "" || input.value==="null" || input.value==="undefined"){
        alert("Invalid Entry")
    } else if (input.value.indexOf(' ') > 0) {
        alert("Invalid Entry: No White Spaces Allowed")
    } else {
        fetch(`https://api.agify.io/?name=${input.value}`)
            .then(res => res.json())
            .then(res => {
                person.name = res.name 
                person.age = res.age || "X"
                person.count = res.count || "X"
            })
            .then(res => state.users.push(person))
            .then(res => addCard(person))
            .then(res => localStorage.setItem(`${person.name}`, JSON.stringify(person)))
        
        input.value = ""
    }
}

function deleteElement() {
    const id = event.target.id
    const cardToDelete = document.getElementById(id);
    cardToDelete.parentNode.remove()

    this.state.users = this.state.users.filter(el => el.name !== id)
    localStorage.removeItem(`${id}`)
}

function addingCard() {
    let section = document.querySelector('section')
    let article = document.createElement('article')
    return state.users.map(user => {
        article.innerHTML = `
            <div id=${user.name}>
                <div class="name">${user.name}</div>
                <button class="delete" id=${user.name} onclick="deleteElement()">X</button><br>
                <div class="age">${user.age}</div>
                <div class="count">Sample Size: ${user.count}</div>
            </div>
        `
        article.classList.add('person-card')
        section.appendChild(article);
    })
}

function addCard() {
    if(state.users.length < 9) {
        addingCard()
    } else if(state.users.length >= 9) {
        let cardToRemoveFromLocalStorage = state.users[0]    
        localStorage.removeItem(`${cardToRemoveFromLocalStorage.name}`)

        state.users = state.users.slice(1)
        var cardToRemoveFromState = document.getElementById("cards")
        cardToRemoveFromState.removeChild(cardToRemoveFromState.childNodes[0])
        
        addingCard()
    }
}