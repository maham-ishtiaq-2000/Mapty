'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.displayingWorkOuts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const workOut = document.querySelector(".workout")
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');



let map;
let mapEvent;



navigator.geolocation.getCurrentPosition(function(position){
    const latitude = position.coords.latitude
    const longitude = position.coords.longitude
    console.log(`https://www.google.com/maps/@${position.coords.latitude},${position.coords.longitude}z?entry=ttu`)
    const coords = [latitude,longitude]
    console.log(coords)
    map = L.map('map').setView(coords, 15);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    L.marker(coords).addTo(map)
        .bindPopup("Current Location")
        .openPopup();

    //Handling click on map
    map.on('click',function(mapE){
        form.classList.remove("hidden")
        inputDistance.focus() //This will focus on inputDistance
        mapEvent = mapE

    })
},function(){
    alert("Could not get position")
})


let workouts = []
form.addEventListener("submit",function(e){
    e.preventDefault()
    const date = new Date()
    let dateWorkOut =  `${months[date.getMonth()]} ${date.getDate()}`
    //Clear Input fields
    console.log(mapEvent)
        const {lat,lng} = mapEvent.latlng
        const markerCoordinates = [lat,lng]
        L.marker(markerCoordinates).addTo(map)
        .bindPopup(L.popup({
            maxWidth : 250,
            minWidth : 250,
            autoClose : false,
            closeOnClick : false,
            
        })).setPopupContent(`${inputType.value} on ${dateWorkOut}`)
        .openPopup();
       
        workouts = workouts.concat({
            inputType : inputType.value,
            inputDistance : inputDistance.value,
            inputDuration : inputDuration.value,
            inputCadence : inputCadence.value,
            inputElevation : inputElevation.value,
            lat :lat,
            lng : lng,
            dateWorkOut
        })
       
        form.classList.add("hidden")
        console.log(workouts)
        inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = ""
        displayingWorkOuts()
       
})


function displayingWorkOuts(){
    containerWorkouts.innerHTML = ""
    let workOutType,symbol
    
    workouts.forEach((val,index) => {
        if(val.inputType == "Running"){
            workOutType = val.inputCadence
            symbol = "🦶🏼"
        }
        else{
            workOutType = val.inputElevation
            symbol = "⚡️"
        }
        console.log(val)
    const html = 
    `
    <li class="workout workout--${val.inputType.toLowerCase()}" data-id=${index}>
    <h2 class="workout__title">${val.inputType} on ${val.dateWorkOut}</h2>
    <div class="workout__details">
      <span class="workout__icon">🚴‍♀️</span>
      <span class="workout__value">${val.inputDistance}</span>
      <span class="workout__unit">km</span>
    </div>
    <div class="workout__details">
      <span class="workout__icon">⏱</span>
      <span class="workout__value">${val.inputDuration}</span>
      <span class="workout__unit">min</span>
    </div>
    <div class="workout__details">
      <span class="workout__icon">${symbol}</span>
      <span class="workout__value">${workOutType}</span>
      <span class="workout__unit">km/h</span>
    </div>
  </li>
    `
    containerWorkouts.insertAdjacentHTML
    ('beforeEnd',html);
;
    })
}

let currentWorkOut;
containerWorkouts.addEventListener("click", function(event) {
    event.preventDefault()
    // Check if the clicked element is a workout item
    if (event.target.classList.contains("workout")) {
      // Get the data-id of the selected workout item
      const workoutId = event.target.dataset.id;
      console.log("Selected workout ID:", workoutId);
      currentWorkOut = workouts[workoutId]
    }
    moveMapToSelectedWorkOut(currentWorkOut)
  });


  function moveMapToSelectedWorkOut(currWorkOut){
    console.log(currWorkOut)
    map.setView([currWorkOut.lat,currWorkOut.lng], 16);

    // Add a tile layer (e.g., OpenStreetMap)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    }).addTo(map)
    .setPopupContent(`${currWorkOut.inputType} on ${currWorkOut.dateWorkOut}`)
    .openPopup();
  }

console.log(inputType)
inputType.addEventListener('change',function(e){
    inputElevation.closest(".form__row").classList.toggle('form__row--hidden')
    inputCadence.closest(".form__row").classList.toggle('form__row--hidden')
})