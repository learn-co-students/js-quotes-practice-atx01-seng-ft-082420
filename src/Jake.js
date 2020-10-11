document.addEventListener('DOMContentLoaded', () => {
    console.log('its working');
    fetch('http://localhost:3000/quotes?_embed=likes')
      .then(data => data.json())
      .then(json => {
        for (const quote of json) {
          createQuoteCard(quote);
        }
      });
  });
  
  function createQuoteCard(quote) {
    const ul = document.querySelector('#quote-list');
  
    // Create li element
    const li = document.createElement('li');
    const blockQ = document.createElement('blockquote');
    const p = document.createElement('p');
    const foot = document.createElement('footer');
    const br = document.createElement('br');
    const successBtn = document.createElement('button');
    const dangerBtn = document.createElement('button');
    const span = document.createElement('span');
  
    blockQ.className = 'blockqoute';
    p.className = 'mb-0';
    p.innerText = quote.quote;
    foot.className = 'blockqoute-footer';
    foot.innerText = quote.author;
    successBtn.className = 'btn-success';
    //   successBtn.innerText = 'Likes';
    successBtn.innerText = 'Likes ';
    span.innerText = quote.likes.length;
    successBtn.append(span);
    dangerBtn.className = 'btn-danger';
    dangerBtn.innerText = 'Delete';
    //   dangerBtn.id = quote.id;
    li.append(blockQ, p, foot, br, successBtn, dangerBtn);
    ul.append(li);
  
    dangerBtn.addEventListener('click', () => {
      fetch(`http://localhost:3000/quotes/${quote.id}`, {
        method: 'DELETE'
      }).then(function() {
        li.remove();
      });
    });
  
    successBtn.addEventListener('click', () => {
      let updateLikes = parseInt(span.innerText) + 1;
      let date = Date.now();
  
      fetch('http://localhost:3000/likes', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          quoteId: quote.id,
          createdAt: date
        })
      })
        .then(res => res.json())
        .then(() => (span.innerText = updateLikes));
    });
  }
  
  const form = document.querySelector('#new-quote-form');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const quote = document.querySelector('#new-quote').value;
    const author = document.querySelector('#author').value;
    postNewQuote(quote, author);
  });
  
  function postNewQuote(quote, author) {
    return fetch('http://localhost:3000/quotes?_embed=likes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        quote: quote,
        author: author,
        likes: []
      })
    })
      .then(data => data.json())
      .then(quote => createQuoteCard(quote));
  }
  