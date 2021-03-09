const WRAPPERresult = document.querySelector("#wrapperResult")
const INPUTlat = document.querySelector("#inputLat")
const INPUTlon = document.querySelector("#inputLon")
const SEARCHbtn = document.querySelector("#searchBTN")
const RESETbtn = document.querySelector("#resetBTN")

SEARCHbtn.addEventListener("click", function(){
    getWeather(INPUTlat.value, INPUTlon.value, (error, data) => {
        if(error !== null) {
          console.error(error);
        }
        else {
          transformData(data.daily)
          printMap(INPUTlat.value, INPUTlon.value)
          if(!WRAPPERresult.classList.contains("written")){
            printData(data.current.weather[0])
          }
        }
      })
})

// -------------------------------------PRINT CURRENT

function printData(elem){
  WRAPPERresult.classList.add("written")
  let tag = document.createElement("p")
  let tagCont = document.createTextNode(`The current weather is ${elem.description}`)
  tag.appendChild(tagCont)
  WRAPPERresult.appendChild(tag)
}

//  ---------------------------------------CHARTIST

function transformData (array) {
  let data = {
    labels: ['Hoy', 'Mañana', 'Pasao', 'El siguiente', 'En 4 días', 'En 5 días', 'En 6 días', 'En una semana'],
    series: [
      [array[0].temp.min, array[1].temp.min, array[2].temp.min, array[3].temp.min, array[4].temp.min, array[5].temp.min, array[6].temp.min, array[7].temp.min],

      [array[0].temp.max, array[1].temp.max, array[2].temp.max, array[3].temp.max, array[4].temp.max, array[5].temp.max, array[6].temp.max, array[7].temp.max]
    ]
  }

  let options = {
    lineSmooth: false
  };

  let responsiveOptions = [
    ['screen and (min-width: 641px) and (max-width: 1024px)', {
      seriesBarDistance: 10,
      axisX: {
        labelInterpolationFnc: function (value) {
          return value;
        }
      }
    }],

    ['screen and (max-width: 640px)', {
      seriesBarDistance: 5,
      axisX: {
        labelInterpolationFnc: function (value) {
          return value[0];
        }
      }
    }],

    ['screen and (min-width: 768px)', {
      axisY: {
        offset: 60,
      }
    }]
  ];

  new Chartist.Line('.ct-chart', data, options, responsiveOptions);
}

// ---------------------------------------LEAFLET
function printMap(lat, lon){
  let mymap = L.map('mapid').setView([lat, lon], 13);

  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoibHVpc3lhZ29mIiwiYSI6ImNrbTIxYmN3ZTF5ZHMybnJ6M2RrYTVmNGQifQ.MyPx9Os8rxvhQDAVRN3ElQ'
  }).addTo(mymap);

  L.marker([lat, lon]).addTo(mymap)
}

// --------------------------------RESET & EVENTS

function reset(){
  INPUTlat.value = ""
  INPUTlon.value = ""
  document.querySelector("p").remove()
  WRAPPERresult.classList.remove("written")
  document.querySelector(".ct-chart").querySelectorAll('*').forEach(n => n.remove())
  document.querySelector("#mapid").remove()
  let mapbox = document.createElement("div")
  mapbox.setAttribute("id", "mapid")
  document.body.appendChild(mapbox)
  
  
}

RESETbtn.addEventListener("click", reset)

// 40.4218534,-3.6921458,284