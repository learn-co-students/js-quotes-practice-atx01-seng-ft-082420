//Grabbing elements we want to work on 
const quotesUrl = "http://localhost:3000/quotes?_embed=likes"
const quoteList = document.querySelector("#quote-list")
const submitForm = document.querySelector("#new-quote-form")


//Getting the quotes from the server and appending them
fetch(quotesUrl)
.then(res => res.json())
.then(function(cards){
    for (const card of cards){
        createCard(card)
    }
})


//Add listener to submit button to create new quote card
submitForm.addEventListener('submit', function(e){
    e.preventDefault();
    addCard(e.target);
    submitForm.reset();
})


// Create quote card and append to DOM
function createCard(card){
        //P Tag
        let p = document.createElement('p')
        p.setAttribute('class','mb-0')
        p.innerText = card.quote
        
        //Footer 
        let footer = document.createElement('footer')
        footer.setAttribute('class','blockquote-footer')
        footer.innerText = card.author 
        
        //break 
        let b = document.createElement('br')
        
        //Span with Number of Likes 
        let span = document.createElement('span')
        span.innerText = card.likes.length
        
        //Like Button 
        let likeBtn = document.createElement('button')
        likeBtn.setAttribute('class','btn-success')
        likeBtn.innerText = "Likes: "
        likeBtn.setAttribute('id', card.id)
        likeBtn.addEventListener('click', function(e) {
            e.preventDefault()
            likeCard(e.target, span)
        })
        
        //List Item 
        let li = document.createElement('li')
        li.setAttribute('class','quote-card')
        
        //Delete Button 
        let delBtn = document.createElement('button')
        delBtn.setAttribute('class','btn-danger')
        delBtn.innerText = "Delete"
        delBtn.setAttribute('id', card.id)
        delBtn.addEventListener('click', function(e) {
            e.preventDefault()
            deleteCard(e.target, li)
        })

        //Edit Button
        let editBtn = document.createElement('button')
        editBtn.setAttribute('class', 'btn-success')
        editBtn.innerText = "Edit"
        editBtn.setAttribute('id', card.id)
        editBtn.addEventListener('click', function(e) {
            e.preventDefault()
            editCard(e.target, p, footer, li)
        })

        //Blockquote
        let block = document.createElement('blockquote')
        block.setAttribute('class','blockquote')
        
      
        //Append Elements
        likeBtn.append(span)
        block.append(p,footer,b,likeBtn,editBtn,delBtn)
        li.append(block)
        quoteList.append(li)
}


//Send post to server, use response to create a new card (otherwise return an alert)
function addCard(data){
    fetch(quotesUrl,{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            quote: data['new-quote'].value,
            author: data.author.value,
            likes: 0
        })
    })
    .then(res => res.json())
    .then(function(newQuote){
        createCard(newQuote)
    })
}


//Send a delete request, remove from dom if successful 
function deleteCard(button,li){
    //send delete request to server
    fetch(`http://localhost:3000/quotes/${button.id}`,{
        method: "DELETE"
    })
    //on success, remove from DOM
    .then(function(){
        li.remove()
    })
}


//Send a like request, update dom on success 
function likeCard(button,span){
    //send like request to server, will create a new like every time -- only takes quoteID
    fetch(`http://localhost:3000/likes`, {
         method: "POST",
         headers: {
             "Content-Type": "application/json",
             "Accept": "application/json"
         },
         body: JSON.stringify({
            quoteId: parseInt(button.id)
         })
    })
    .then(function(res) {
        return res.json()
    })
    .then(function(likeObj) {
        span.innerText = parseInt(span.innerText) + 1
    })
}

//Appends an edit form to the bottom of the card for user to fill out 
//User submits edit form to server
//On success --> changes quote card and removes edit form
function editCard(button,p,footer,li){
    let editForm = submitForm
    editForm.children[0].children[0].innerHTML = "Edit Quote"
    editForm.children[0].children[1].placeholder = p.innerHTML
    editForm.children[1].children[0].innerHTML = "Edit Author"
    editForm.children[1].children[1].placeholder = footer.innerHTML
    li.append(editForm)
    editForm.addEventListener('submit', function(e){
        e.preventDefault();
        fetch(`http://localhost:3000/quotes/${button.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                quote: p.innerHTML,
                author: footer.innerHTML
            })
        })
        .then(res => res.json())
        .then(function(e){
            p.innerHTML = e.target['#new-quote'].value
            footer.innerHTML = e.target.author.value
            editForm.remove()
        })
    })
}

