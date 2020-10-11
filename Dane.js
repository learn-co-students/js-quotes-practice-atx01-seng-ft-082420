let addToy = false;
let toyURL = "http://localhost:3000/toys"
​
document.addEventListener("DOMContentLoaded", () => {
​
  //Labeling constants that are elements on the DOM that I know I will interact with
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyCollection = document.querySelector("#toy-collection")
  const addToyForm = document.querySelector(".add-toy-form")
  
  //Fetch to our API for toy data
  fetch(toyURL)
  //then taking the JSON string and converting to a JSON object
  .then(function(resp){
    return resp.json()
  })
  //Then we are taking the JSON object (this is an array of toys) and running through renderToy
  .then(function(toys){
    //Using forEach to loop through each toy in the toy array
    toys.forEach(function(toy){
      //invoke our renderToy function, giving it our toyObject
      renderToy(toy)
    })
  })
  //Using arrow functions instead, this is identical to above^^
  // fetch(toyURL)
  // .then(resp => resp.json())
  // .then(toys => toys.forEach(toy => {
  //   renderToy(toy)
  // })
​
​
  //created a function that, when given a toy Object, creates a card with it's information and renders it on the page
  function renderToy(toy) {
    //example toy Object taken from a console.log(toy)
    // id: 1, name: "Woody", image: "http://www.pngmart.com/files/3/Toy-Story-Woody-PNG-Photos.png", likes: 5}
    
    //all information for card was taken directly from readme
​
    //create card and label it with class
    let toyCard = document.createElement('div')
    toyCard.className = "card"
    toyCard.innerHTML = "<h2>Woody</h2>"
    
    //h2 with toy name
    let toyName = document.createElement('h2')
    toyName.innerText = toy.name
​
    //toy image with class toy-avatar and src toy image
    let toyImage = document.createElement('img')
    toyImage.src = toy.image 
    toyImage.className = "toy-avatar"
​
    //p el with toy like count
    let toyLikes = document.createElement('p')
    toyLikes.innerText = toy.likes 
​
    //button with class like-btn
    let likeBtn = document.createElement('button')
    likeBtn.className = "like-btn"
    likeBtn.innerText = "like"
    //add event listener to like button, that triggers increaseLikes function (defined ln 75)
    likeBtn.addEventListener("click", function(){
      increaseLikes()
      // updateLikes()
    })
​
    //add everything to the toy card
    toyCard.append(toyName, toyImage, toyLikes, likeBtn)
    //add the toycard to the front end, otherwise nobody can see anything
    toyCollection.append(toyCard)
    
    //I combined the front end update and calling the backend update into one function. This is an optomistic render.
    function increaseLikes(){
      //create a variable that is equal to the value of the toyLikes element, converted from a string into an integer, and increased by one
      newLikes = (parseInt(toyLikes.innerText) + 1)
      //set the new front end value of that element to the new value of increased likes
      toyLikes.innerText = newLikes
      //update the backend, targetting that specific toy by id in the database, with the new like count
      updateLikes(toy.id, newLikes)
    }
​
    //function to update the backend of a specific toy (located by id) to a new "likes" value
    function updateLikes(toyId, likeCount){
​
      //Here I created an Object I called toyOption
      //this lets me to fetch(url, toyOption), and I do almost solely for aesthetic reasoning. I feel it helps clean and compartmentalize the code a bit.
      let toyOption = {
        //Patch method to update a DB
        method: "PATCH",
        //Same headers you are used to
        headers: 
        {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        //set attribute of likes to new likeCount value. With a PATCH you *only* need to send the attribute(s) you are altering.
        body: JSON.stringify({
          "likes": likeCount
        })
      } 
​
      
      //fetch(http//localhost:3000/toys/`${toyId}`, toyOption) is identical
      fetch(toyURL+'/'+toyId, toyOption)
      //This console.log is just to check my response, one option if you wanted to pessimistically render would be to check for the content of this response to see if your patch was successful
      .then(response => console.log(response))
    }
​
  } 
​
  //add event listener to our form, that on submit will postToy
  addToyForm.addEventListener('submit', function(e){
    //Prevent the page refresh
    e.preventDefault()
    //create empty toy object
    let toy = {}
    //give toy object keys matching the server keys, and values representing their value. e.target is the form, .name or .image is the way those input fields were identified(by name="name" and name="image") and thus can be called.
    toy.name = e.target.name.value
    toy.image = e.target.image.value
    //give this toy object to my postToy functiom
    postToy(toy)
  })
  
  //This function will take an Object (toy) and post it to our server
  function postToy(toy){
​
    //Here I created an Object I called toyOption
    //this lets me to fetch(url, toyOption), and I do almost solely for aesthetic reasoning. I feel it helps clean and compartmentalize the code a bit.
    let toyOption = {
      //This is a post request
      method: "POST",
      //Information needed by the browser, you will likely not do anything different than this for a while
      headers: 
      {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      //actual information being added to the DB, converted into a JSON string. We are matching the names of the attributes to our existing DB and the values from our toy Object passed into this function
      body: JSON.stringify({
        "name": toy.name,
        "image": toy.image,
        "likes": 0
      })
    } 
​
    //Fetch to our stored DB url, passing it our the url string and toyOption object
    fetch(toyURL, toyOption)
    //after that is completed, render that toy onto the front-end
    .then(renderToy(toy))
​
    //Continuing to clarify, toyOption here is just an Object that has all the information packaged into a variable. 
    //It is functionally identical to the code listed below
​
    //   fetch(toyURL, {
    //       method: "POST",
    //       headers: 
    //       {
    //         "Content-Type": "application/json",
    //         Accept: "application/json"
    //       },
    //       body: JSON.stringify({
    //         "name": toy.name,
    //         "image": toy.image,
    //         "likes": 0
    //       })
    //     })
    //   .then(renderToy(toy))
  }
​
  //This hides and shows the top bar. At the top of the page you can see they set addToy to false
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    //When you click the button, it changes addToy to the opposite of what addToy was, so a boolean toggle
    addToy = !addToy;
    //If addToy is true, show the top panel if it's false hide it
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});
