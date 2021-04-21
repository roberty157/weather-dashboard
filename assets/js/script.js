//open weather api
//robert152
//robertyeam@gmail.com
//UCI@stapler
//api: a216fc008611e9efe1fe2bdd571d9885

cityListEl = $('.list-group');

//first make an api call to get the lat and lon of the city
//then make another api call for a forecast

currentWeatherEl =$('#currentWeather');

currentIconEl =$('#currentIcon');

currentTitleEl =$('#currentTitle');
currentTempEl = $('#currentTemp');
currentHumEl = $('#currentHum');
currentSpEl =$('#currentSp');
currentUVEl = $('#currentUV');

forecastEl =$('#forecast');

//searchButtonEl = $("#searchButton");
searchInput = $('input[name="searchInput"]');

searchFormEl = $("#searchForm");




searchFormEl.on("submit",function(event){
    currentTitleEl.empty();
    currentIconEl.empty();


    event.preventDefault();
    //console.log(searchInput.val()==='');
    var city = searchInput.val();
    APIcall(city);
    $('input[type="text"]').val('');
})

function APIcall(input){
    currentTitleEl.empty();
    currentIconEl.empty();
    
    var url = `https://api.openweathermap.org/data/2.5/weather?q=${input}&units=imperial&appid=a216fc008611e9efe1fe2bdd571d9885`;
    
    fetch(url)
    .then(function(response){
        return response.json();
        
        
    })
    .then(function(data){
        //console.log(data);
        if(data["cod"]==200){

            addCity(input);
            //console.log(data["coord"]);
            var lat = data.coord.lat;
            var lon = data.coord.lon;
            getWeather(lat,lon);

            //console.log(input);
            //console.log(currentTitleEl);
            
            //string.charAt(0).toUpperCase() + string.slice(1);
            currentTitleEl.text(input.charAt(0).toUpperCase() + input.slice(1));
                       
        }else{
            var errorMsg = $('<div>');
            errorMsg.css('color','red');
            errorMsg.text('invalid city');
            //console.log(errorMsg);
            currentTitleEl.append(errorMsg);
            
        }
        /*
        
        */
        //console.log("lat",lat);
        //console.log("lon",lon);
        //getWeather(lat,lon);
    });

    //using coord go to onecall
    function getWeather(lat,lon){
        var oneCallUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly,alerts&appid=a216fc008611e9efe1fe2bdd571d9885`;
        fetch(oneCallUrl)
        .then(function(response){
            return response.json();
        })
        .then(function(data){
            //console.log(data);
            displayWeather(data);
        })

    }

    function displayWeather(data){
        var current = data["current"];
        var forecast = data["daily"];
        //console.log(current);
        //console.log(forecast);
        //console.log(forecast.slice(1,6));
        //.subarray(1,6)
        currentTempEl.text(current["temp"]);
        currentHumEl.text(current["humidity"]);
        currentSpEl.text(current["wind_speed"]);
        currentUVEl.text(current["uvi"]);
        displayUVI(current["uvi"]);

        //console.log(current["weather"][0]["icon"]);
        var iconcode = current["weather"][0]["icon"];
        var iconEl = makeIconEl(iconcode);
        

        currentIconEl.append(iconEl);
        //$('#wicon').attr('src', iconurl);
        //var iconcode = current["weather"]["icon"];
        //console.log(iconcode);

        //display 5 day forecast
        forecast = forecast.slice(1,6);

        //console.log(forecast.length);
        var forecastElList = forecastEl.children().children(".bg-primary").children(".card-body");
        for(var i=0;i<forecast.length;i++){
            var forecastItem = forecastElList[i];
            //date
            forecastItem.children[0].textContent = moment.unix(forecast[i]["dt"]).format("MM/DD/YYYY");
            //temp
            forecastItem.children[2].children[0].textContent = forecast[i]["temp"]["day"];
            //console.log(forecastItem);
            //humidity
            forecastItem.children[3].children[0].textContent = forecast[i]["humidity"];

            //make icon el
            var iconcode = forecast[i]["weather"][0]["icon"];
            //console.log(iconcode);
            var iconEl = makeIconEl(iconcode);
            //console.log(iconEl[0].outerHTML);
            
            forecastItem.children[1].innerHTML =iconEl[0].outerHTML;            
        }
        
    }
    
    
}

function displayUVI(index){
    currentUVEl.css('color','white');
    if(index <= 2){
        //green "low"
        // #008000
        currentUVEl.css('background-color','#008000');
    }else if(index <= 5){
        //yellow "moderate"
        // #FFFF00
        currentUVEl.css('background-color','#FFFF00');
    }else if(index <= 7){
        //orange "high"
        // #FFA500
        currentUVEl.css('background-color','#FFA500');
    }else if(index <= 10){
        //red "very high"
        // #FF0000
        currentUVEl.css('background-color','FF0000');
    }else{
        //violet "extreme"
        // #EE82EE
        currentUVEl.css('background-color','#EE82EE');
    }
}

function makeIconEl(iconcode){
    //return an html element with correct src
    var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
    var iconEl = $('<img>');
    iconEl.attr('src',iconurl);
    return iconEl;
}



var cityLst = JSON.parse(localStorage.getItem("cityList"));
if(cityLst === null){
    cityLst =[];
    localStorage.setItem("cityList",JSON.stringify(cityLst));
}
function addCity(city){
    //console.log(cityLst.includes(city));
    cityCap = city.charAt(0).toUpperCase() + city.slice(1)
    if(!cityLst.includes(cityCap)){
        cityLst.unshift(cityCap);
        localStorage.setItem("cityList",JSON.stringify(cityLst));
    }

    displayCityList(cityLst);

}
function displayCityList(){
    //cityListEl.append()
    cityListEl.empty();
    var cityLstObj =JSON.parse(localStorage.getItem("cityList"));

    cityLstObj.forEach(element=>{
        var cityItem = $("<li>");
        cityItem.attr("class","list-group-item");

        cityItem.text(element);
        cityItem.on('click',function(event){
            event.preventDefault();
            //console.log(element);
            APIcall(element);
        })
        cityListEl.append(cityItem);
        //console.log(cityItem);
    })
    /*
    for(var i =0;i<cityLstObj.length;i++){
        var cityItem = $("<li>");
        cityItem.attr("class","list-group-item");

        cityItem.text(cityLstObj[i]);
        let name = cityLstObj[i];
        cityItem.on('click',function(event){
            event.preventDefault();
            console.log(name);
        })
        cityListEl.append(cityItem);
        console.log(cityItem);
    }
    */
}
displayCityList();
