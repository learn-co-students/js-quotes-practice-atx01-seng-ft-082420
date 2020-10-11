const quoteURL = 'http://localhost:3000/quotes?_embed=likes'
const likesURL = 'http://localhost:3000/likes'

document.addEventListener("DOMContentLoaded", () => {
  const quoteCollection = document.querySelector('#quote-list')
  const quoteForm = document.querySelector("#new-quote-form")


fetch(quoteURL)
  .then(resp => resp.json())
  .then(quotes => quotes.forEach(quote => {
      renderQuote(quote)  
    }))

    function renderQuote(quote) {
        // console.log(quote)
        let quoteCard = document.createElement('li')
        quoteCard.className = 'quote-card'
        
        let blockQuote = document.createElement('blockquote')
        blockQuote.className = 'blockquote'

        let p = document.createElement('p')
        p.className = "mb-0"
        p.innerText = quote.quote
        let footer = document.createElement('footer')
        footer.className = 'blockquote-footer'
        footer.innerText = quote.author
        // console.log(footer)

        let likeButton = document.createElement('button')
        likeButton.className = 'btn-success'
        likeButton.innerText = 'Like '

        let likes = document.createElement('span')
        likes.innerText = quote.likes.length
        likeButton.append(likes)
        

        //add event listener to like button
        likeButton.addEventListener("click", function(){
          increaseLikes()
        })

        let deleteButton = document.createElement('button') 
        deleteButton.className = 'btn-danger'
        deleteButton.innerText = 'Delete'
        
        
        // console.log(quote)
        quoteCard.append(blockQuote, p, footer, likeButton, deleteButton)
        quoteCollection.append(quoteCard)


        deleteButton.addEventListener('click', () => {
            fetch(`http://localhost:3000/quotes/${quote.id}`, {
                method: 'DELETE'
            })
            .then(function(){
                quoteCard.remove()
            })

        })



    function increaseLikes() {
      //this updates the likes on the front end
        newLikes = (parseInt(likes.innerText) + 1)
        likes.innerText = newLikes

        updateLikes(quote.id, newLikes)
    }

    function updateLikes(quoteId, likeCount) {
        // console.log(quoteId)
        let date = Date.now()
        let quoteOption = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                quoteId: quoteId,
                createdAt: date
            })
    }
    fetch(likesURL, quoteOption)
    .then(resp => console.log(resp))


    }

    
    quoteForm.addEventListener("submit", function(e){
        e.preventDefault()
        let quote = {}
        quote.quote = e.target.quote.value
        quote.author = e.target.author.value

        postQuote(quote)
    })

    function postQuote(quote){
        // console.log(quote)
      let quoteOption = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                quote: quote.quote,
                author: quote.author,
                likes: []
            })
        }
        fetch(quoteURL, quoteOption)
        .then(resp => resp.json())
        .then(quote => renderQuote(quote))
      }






      
    }

        
        
    //     .then( response => response.json())
    //     .then( newQuote => {
    
    //         let newQuotesHTML = `
    //         <li class='quote-card'>
    //            <blockquote class="blockquote">
    //             <p class="mb-0">${newQuote.quote}</p>
    //            <footer "class="blockquote-footer">${newQuote.author}</footer>
    //            <br>
    //            <button class='btn-success'>Likes: <span>0</span></button>
    //            <button class='btn-danger'>Delete</button>
    //            </blockquote>
    //        </li>
    //           `
    //           quoteCollection.innerHTML += newQuotesHTML
    //           console.log(e.target.reset())
    //         })

    // })
})