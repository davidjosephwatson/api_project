'use strict';

let RESORT_ID = '999004';
let APP_ID = 'a791f2e5';
let APP_KEY = '84ca8d0ee1f7be1519277d91e17dd080';



function pingWeather(searchTerm) {
    fetch(`https://api.weatherunlocked.com/api/snowreport/${RESORT_ID}?app_id=${APP_ID}&app_key=${APP_KEY}`)
    .then(result => result.json())
    .then(resultJson => {
        if (resultJson.status === 'error') {
            displayError();
        } else {
            displayResults(resultJson);
        }
        console.log(resultJson);
      })
    .catch(error => alert('Something went wrong. Try again later.')); 
    }

function displayError() {
    $('.feedback').text("User Not Found")
}
    
function displayResults(resultJson) {
    $('.results-list').empty();
    $(".results-list").append(
        `<h2>Resort Name</h2><br>
        ${resultJson.resortname}<br>
        <h2>Current Conditions</h2><br>
        ${resultJson.conditions}<br>
        <h2>Last Snow</h2><br>
        ${resultJson.lastsnow}<br>
        `)
    $('.results').removeClass('hidden');
}
    
function addEventListener() {
    $("form").submit(e=>{
        e.preventDefault();
        $('.feedback').text('');
        let searchTerm = $("input[type=text]").val();
        pingWeather(searchTerm);
    })
}
    
$(function() {
    addEventListener();
})
    //basic forcast request
    // fetch(`api.weatherunlocked.com/api/resortforecast/999001?app_id={APP_ID}&app_key={APP_KEY}`)

    //for the forecast up to 7 days, can change
    // fetch(`api.weatherunlocked.com/api/resortforecast/999001?num_of_days=7&app_id={APP_ID}&app_key={APP_KEY}`)