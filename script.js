// Initializing global variables
var lat;
var long;
var cities;

// Displaying the information from the local storage
var localStorageCont = JSON.parse(localStorage.getItem("city_list"));
if (localStorageCont===null) {
    cities = [];
}
else {
    cities = localStorageCont
}


 // Re-rendering of the HTML to display the appropriate content
 function displayCityWeather(city) {
   $("#show_city").text(city);
   var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=69712313de0b3188381f1b726de5c5a9";
   
   $.ajax({
     url: queryURL,
     method: "GET"
   }).then(function(response) {
       console.log(response);
       var date = moment.unix(response.dt).format("MM/DD/YYYY");
       $("#show_city").text(city + " (" + date + ")");

       var temperature = ((response.main.temp - 273.15)*(9/5) + 32).toFixed(1);
       $("#temp_val").text(temperature + " °F");
       var wind_speed = response.wind.speed;
       $("#wind_val").text(wind_speed + " MPH");

       var iconcode = response.weather[0].icon;
       var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
       let locationIcon = $('.weather-icon');
       $('locationIcon').attr('src', iconurl);

       var iconImage = $('<img></img>');
       iconImage.attr('src', "icons/" +iconcode+ ".png");
       $(".weather-icon").empty();
       $(".weather-icon").append(iconImage);

       lat = parseInt(response.coord.lat);
       long = parseInt(response.coord.lon);
       displayCityWeatherWithLatLong(lat,long);

   });

   
 }

 function displayCityWeatherWithLatLong(lat,long) {
    var queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat="+ lat+ "&lon=" + long + "&appid=69712313de0b3188381f1b726de5c5a9";

   $.ajax({
     url: queryURL,
     method: "GET"
   }).then(function(response) {
       console.log(response);
       var humidity = response.current.humidity;
       $("#humid_val").text(humidity + " %");
       var uvi = response.current.uvi;
       $("#uv_val").text(uvi);
       if (Number(uvi)<=2){
        $("#uv_val").css('background-color', 'green');
       } 
       else if (Number(uvi)<=5&Number(uvi)>2){
        $("#uv_val").css('background-color', 'yellow');
       }
       else if (Number(uvi)<=7&Number(uvi)>5){
        $("#uv_val").css('background-color', 'orange');
       }
       else if (Number(uvi)>7){
        $("#uv_val").css('background-color', 'red');
       }
       var forecast = response.daily;
       renderForecast(forecast);


   });

 }



  // Adding click event listeners to all elements with a class of "city"
  $(document).on("click", ".city", savedCityClick);




 // Function for displaying cities
 function renderButtons() {

   $("#cities-view").empty();

   for (var i = 0; i < cities.length; i++) {
       
     var a = $("<button>");
     a.addClass("city");
     a.attr("data-name", cities[i]);
     a.text(cities[i]);
     var linebreak = $("<br>");
     $("#cities-view").prepend(a, linebreak);
   }
 }

 // This function handles events where the Search button is clicked
 $("#button-addon2").on("click", function(event) {
   event.preventDefault();
   var city = $("#search-city").val().trim();
   if (cities.indexOf(city) === -1){
    cities.push(city);
   }
   localStorage.setItem("city_list", JSON.stringify(cities));

   renderButtons();
   $("#show_city").text(city);
   displayCityWeather(city);
 });



 // Calling the renderButtons function to display the search history buttons
 renderButtons();

 function savedCityClick(event) {
    event.preventDefault(); 
    var city = $(this).attr("data-name");
    displayCityWeather(city)
 }

//  Rendering of the HTML to display 5-day weather forecast
function renderForecast(forecast) {
    $("#five_day_forecast").empty();
    for (var i=0; i<5; i++) {
        var date = moment.unix(forecast[i].dt).format("MM/DD/YYYY");
        var iconecode = forecast[i].weather[0].icon;
        var temp = ((forecast[i].temp.day - 273.15)*(9/5) + 32).toFixed(1);
        var humid = forecast[i].humidity;
        var forecast_day = $(`
        <div class="card" id = "five_days_weather" style="width: 18rem;">
            <div class="card-body">
                <h5 class="card-title">${date}</h5>
                <img src="icons/${iconecode}.png"</img>
                <p class="card-text">${"Temp: " + temp + " °F"}</p>
                <p class="card-text">${"Humidity: " + humid + "%"}</p>
            </div>
      </div>`)
    
      $("#five_day_forecast").append(forecast_day);
    }


}

 