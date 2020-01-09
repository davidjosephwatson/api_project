'use strict';

let Resort_Id = '999004';
const APP_ID = 'a791f2e5';
const APP_KEY = '84ca8d0ee1f7be1519277d91e17dd080';
const REPORT_ROOT = 'http://api.weatherunlocked.com/api/';

const APP_KEY_GIPHY = 'h4UHJpML5W5XsTnhiWq5sF82nUFbdMSC';
const GIPHY_ROOT = 'http://api.giphy.com/v1/gifs/search?';

let days = ["Sun","Mon","Tue","Wed","Thur","Fri","Sat"];
let months = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];

function pingReport(searchTerm) {
    let url = `${REPORT_ROOT}snowreport/${Resort_Id}?app_id=${APP_ID}&app_key=${APP_KEY}`
    makeApiCall(url, displayReportResults)
    }

function pingForecast(numOfDays) {
    let url = `${REPORT_ROOT}resortforecast/${Resort_Id}?num_of_days=${numOfDays}&app_id=${APP_ID}&app_key=${APP_KEY}`
    makeApiCall(url, displayForecastResults)
}

function makeApiCall(url, onComplete) {
    fetch(url)
    .then(result => result.json())
    .then(resultJson => {
        onComplete(resultJson)
    })
    .catch(error => alert('Something went wrong. Try again later.'));
}

function displayError() {
    $('.feedback').text("User Not Found")
}

    
function displayReportResults(resultJson) {
    $('.report-results').empty();
    Resort_Id = resultJson.resortid;
    $(".report-results").append(

        `<div class="location-and-date">
          <h1 class="location-and-date_location">${resultJson.resortname}, ${resultJson.resortcountry}</h1>
          <div>${resultJson.reportdate}</div>
        </div>

        <div class="current-temperature">
          <div class="current-temperature__icon-container">
            <img src="./images/mostly-sunny.svg" class="current-temperature__icon" alt="current-temperature__icon">
          </div>
          <div class="current-temperature__content-container">
            <div class="current-temperature__value">${resultJson.lastsnow_in}</div>
            <div class="current-temperature__summary">Inches</div>
            <div class="current-temperature__summary">${resultJson.conditions}</div>
          </div>
        </div>
        `
        )


    $('.results').removeClass('hidden');
    pingGiphy(resultJson.conditions);
}

function pingGiphy(searchGiphy) {
  let searchTerm = searchGiphy.replace(/ /g,'%20')
  let url = `${GIPHY_ROOT}q=${searchTerm}&api_key=${APP_KEY_GIPHY}&limit=1`
  makeApiCall(url, displayGiphyResults)
}

function displayGiphyResults(resultJson) {
  $('.current-temperature__icon').attr('src', resultJson.data[0].images.downsized_large.url)
}

function displayForecastResults(resultJson) {
    console.log(resultJson);
    $('.current-report-results').empty();
        $(".current-report-results").append(
          `<div class="current-stats">
            <div>
              <div class="current-stats__value">${resultJson.forecast[0].base.temp_f}&#8457</div>
              <div class="current-stats__label">Base</div>
              <div class="current-stats__value">${resultJson.forecast[0].upper.temp_f}&#8457</div>
              <div class="current-stats__label">Top</div>
            </div>
            <div>
              <div class="current-stats__value">${resultJson.forecast[0].mid.windspd_mph}</div>
              <div class="current-stats__label">Wind</div>
              <div class="current-stats__value">${resultJson.forecast[0].mid.freshsnow_in} in</div>
              <div class="current-stats__label">Fresh</div>
            </div>
            <div>
              <div class="current-stats__value">${resultJson.forecast[0].snow_in} in</div>
              <div class="current-stats__label">Snow</div>
              <div class="current-stats__value">${resultJson.forecast[0].rain_in} in</div>
              <div class="current-stats__label">Rain</div>
            </div>
          </div>`
          )
          
        $(".forecast-results").append (
          `<h2 class="next-num-days__heading">Forecast</h2>`
        )

        for (let i =1; i<resultJson.forecast.length; i++) {
          let obj = resultJson.forecast[i];
          var dateParts = obj.date.split("/");
          var dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
          let dateString = `${months[dateObject.getMonth()]} ${dateObject.getDate()}, ${dateObject.getFullYear()}` 

          if (obj.time !== "13:00") continue;
          $(".forecast-results").append (
          `<div class="next-num-days">
            <div class="next-num-days__container">
              <div class="next-num-days__row">

                <div class="next-num-days__date">
                ${days[dateObject.getDay()]}
                  <div class="next-7-days__label">${dateString}</div>
                </div>

                <div class="next-num-days__low">
                ${obj.snow_in}
                  <div class="next-num-days__label">Snow</div>
                </div>

                <div class="next-num-days__high">
                ${obj.upper.temp_f}&#8457;
                  <div class="next-num-days__label">Temp</div>
                </div>

                <div class="next-num-days__icon">
                <img src="http://www.weatherunlocked.com/Images/icons/1/${obj.base.wx_icon}" alt="weather icon">
                </div>

                <div class="next-num-days__rain">
                  ${obj.upper.feelslike_f}&#8457;
                  <div class="next-num-days__label">Feels Like</div>
                </div>

                <div class="next-num-days__wind">
                  ${obj.upper.windspd_mph}mph
                  <div class="next-num-days__label">Wind</div>
                </div>
              </div>
            </div>
          </div>`
        )
    }
    $('.results').removeClass('hidden');
}

function addEventListener() {
    $("form").submit(e=>{
        e.preventDefault();
        $('.feedback').text('');
        let searchTerm = $("option:selected").val();
        let numOfDays = $("select[name=forecast-days] option:selected").val(); 
        pingReport(searchTerm);
        pingForecast(numOfDays);
    })
}

$(function() {
    addEventListener();
})