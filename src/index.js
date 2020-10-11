const likesUrl = "http://localhost:3000/quotes?_embed=likes"
const quotesUrl = "http://localhost:3000/quotes/"
const ulQuote = document.querySelector("#quote-list")
const formSub = document.querySelector("#new-quote-form")

document.addEventListener("DOMContentLoaded", () => {

    fetch(likesUrl).then(res => res.json()).then(quotes => quotes.forEach(quote => renderQuotes(quote)))

    // submit button displays new quote and Author on the page w/o refreash
    formSub.addEventListener("submit", event => {
        event.preventDefault()

        fetch(quotesUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify({
                quote: event.target[0].value,
                author: event.target[1].value,
                likes: event.target[2].value
            })
        })
        .then(res => res.json())
        .then(newQuote => renderQuotes(newQuote))
    })

})

function renderQuotes(quote){
    // console.log(quote.author)


    const li = document.createElement("li")
    li.setAttribute("class", "quote-card")

    const blockquote = document.createElement("blockquote")
    blockquote.setAttribute("class", "blockquote")
    
    const p = document.createElement("p")
    p.setAttribute("class", "mb-0")
    p.innerText = quote.quote

    const footer = document.createElement("footer")
    footer.setAttribute("class", "blockquote-footer")
    footer.innerText = quote.author

    const br = document.createElement("br")

    const succBtn = document.createElement("button")
    succBtn.setAttribute("class", "btn-success")
    succBtn.innerText = "Likes:"
    const span = document.createElement("span")
    span.innerText = quote.likes.length
    succBtn.addEventListener("click", () => {
        let timestamp = Math.round((new Date()).getTime() / 1000);

        fetch("http://localhost:3000/likes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify({
                quoteId: quote.id,
                createdAt: timestamp
            })
        })
        .then(res => res.json())
        .then(() => {span.innerText++})
    })

    const delBtn = document.createElement("button")
    delBtn.setAttribute("class", "btn-danger")
    delBtn.innerText = "Delete"
    delBtn.addEventListener("click", () => {
        fetch(quotesUrl + quote.id, {
            method: "DELETE"
        })
        .then(() => {li.remove()})
    })

    ulQuote.append(li)
    li.append(blockquote)
    blockquote.append(p, footer, br, succBtn, delBtn)
    succBtn.append(span)
}