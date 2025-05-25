var apiKey = "604dd4a364e3a6fd3e4e86915fc5af03";
var lang = "en";
var display = {};
var SearchedCityhistory = [];
hideSideBar();

console.log(window.history);
console.log(navigator.bluetooth);
console.log(navigator.usb);
console.log("wifi: " + navigator.connection.effectiveType);
console.log(navigator.vendor);
console.log(navigator.userAgent);
console.log("Is the User On-Line: " + navigator.onLine);
console.log("User's Language: " + navigator.language);

if (navigator.language.includes("zh")) {
  document.getElementById("language").value = "中文繁體";
  refreshLang("zh");
  lang = "zh_tw";
} else {
  document.getElementById("language").value = "English";
  refreshLang("English");
}
window.onload = function () {
  var urlInput = new URLSearchParams(window.location.search);
  var query = urlInput.get("q");
  var urlInputLang = urlInput.get("lang");
  if (query == "current") {
    getCurrentLocation();
  } else if (query) {
    document.getElementById("loading").innerHTML = "Loading";
    document.getElementById("cityInput").value = query;
    getWeather();
  }
  if (urlInputLang) {
    if (urlInputLang.includes("zh") || urlInputLang.includes("chinese")) {
      document.getElementById("language").value = "中文繁體";
      refreshLang(urlInputLang);
    } else {
      document.getElementById("language").value = "English";
      refreshLang("English");
    }
  }
};

function showSideBar() {
  document.getElementById("sideBar").style.display = "revert";
}
function hideSideBar() {
  document.getElementById("sideBar").style.display = "none";
}
document.getElementById("showSideBar").addEventListener("click", function () {
  showSideBar();
});
document.getElementById("closeSideBar").addEventListener("click", function () {
  hideSideBar();
});
document.getElementById("search").addEventListener("click", function () {
  getWeather();
});
document
  .getElementById("currentLocation")
  .addEventListener("click", function () {
    getCurrentLocation();
  });
document.getElementById("reload").addEventListener("click", function () {
  window.location.reload();
});
document.getElementById("copy").addEventListener("click", function () {
  navigator.clipboard.writeText(getCopyURL());
  document.getElementById("isCopied").innerHTML = display.message.copy;
  setTimeout(function () {
    document.getElementById("isCopied").innerHTML = "";
  }, 1000);
});
document.getElementById("shareWeb").addEventListener("click", function () {
  navigator.share({
    title: document.title,
    text: "Weather website",
    url: getCopyURL(),
  });
});
document.getElementById("language").addEventListener("click", function () {
  var selectedLanguage = document.getElementById("language").value;
  refreshLang(selectedLanguage);
});
function getCopyURL() {
  var copyLocation;
  var copyLanguage;
  if (document.getElementById("cityInput").value != "") {
    copyLocation = "q=" + document.getElementById("cityInput").value;
  } else {
    copyLocation = "q=current";
  }
  if (document.getElementById("language").value == "English") {
    copyLanguage = "&lang=en-us";
  } else {
    copyLanguage = "&lang=zh-tw";
  }
  return "/?" + copyLocation + copyLanguage;
}
function refreshLang(langinput) {
  if (langinput == "English") {
    lang = "en_us";
    display = {
      weather: "Weather: ",
      temp: "Temperature: ",
      tempMax: "Highest Temperature： ",
      tempMin: "Lowest Temperature： ",
      humidity: "Humidity： ",
      windSpeed: "Wind Speed： ",
      windSpeedUnit: "meter/second",
      alert: {
        needEnter: "You need to enter the city name",
      },
      message: {
        copy: "Link copied",
      },
      ui: {
        title: "Weather",
        textInput: "Search city",
        searchButton: "Search",
        currentLocationButton: "Current Location",
        copyLinkButton: "Copy Link",
        shareButton: "Share",
        reloadButton: "Reload",
        showSideBar: "Show side-bar",
        historyTitle: "History",
      },
    };
  } else {
    lang = "zh_tw";
    display = {
      weather: "天氣: ",
      temp: "溫度: ",
      tempMax: "最高溫度： ",
      tempMin: "最低溫度： ",
      humidity: "濕度： ",
      windSpeed: "風速： ",
      windSpeedUnit: "米/秒",
      alert: {
        needEnter: "請輸入城市名稱",
      },
      message: {
        copy: "鏈結已被複製",
      },
      ui: {
        title: "天氣",
        textInput: "尋找城市",
        searchButton: "尋找",
        currentLocationButton: "目前位置",
        copyLinkButton: "複製鏈結",
        shareButton: "分享",
        reloadButton: "重新載入",
        showSideBar: "顯示側邊欄",
        historyTitle: "歷史記錄",
      },
    };
  }
  document.getElementById("title").innerHTML = display.ui.title;
  document.getElementById("search").innerHTML = display.ui.searchButton;
  document.getElementById("currentLocation").innerHTML =
    display.ui.currentLocationButton;
  document.getElementById("cityInput").placeholder = display.ui.textInput;
  document.getElementById("copy").innerHTML = display.ui.copyLinkButton;
  document.getElementById("shareWeb").innerHTML = display.ui.shareButton;
  document.getElementById("reload").innerHTML = display.ui.reloadButton;
  document.getElementById("showSideBar").innerHTML = display.ui.showSideBar;
  document.getElementById("historyTitle").innerHTML = display.ui.historyTitle;
}
function getWeather() {
  document.getElementById("loading").innerHTML = "Loading";
  if (document.getElementById("cityInput").value == "") {
    alert("⚠ " + display.alert.needEnter);
    document.getElementById("loading").innerHTML = "";
  } else {
    var city = document.getElementById("cityInput").value;
    var urlbase = "https://api.openweathermap.org/data/2.5/weather?q=";
    var url =
      urlbase +
      city +
      "&appid=" +
      apiKey +
      "&lang=" +
      lang +
      "&units=metric"; /* add '&lang=zh_tw&units=metric' 如果是中文*/
    startWebRequest(url);
  }
}

function getCurrentLocation() {
  document.getElementById("loading").innerHTML = "Loading";
  navigator.geolocation.getCurrentPosition(
    (position) => {
      console.log(position);
      var lat = position.coords.latitude;
      var lon = position.coords.longitude;
      startWebRequest(
        "https://api.openweathermap.org/data/2.5/weather?lat=" +
          lat +
          "&lon=" +
          lon +
          "&appid=" +
          apiKey +
          "&lang=" +
          lang +
          "&units=metric"
      );
    },
    (error) => {
      alert("You need to accept the location!");
      document.getElementById("loading").innerHTML = "";
    }
  );
}

function startWebRequest(URLinput) {
  fetch(URLinput)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.cod == 200) {
        console.log(data);
        var box = "<div class='frame'>";

        var weatherHtml =
          "<br>" +
          box +
          "<h2 id='name'>" +
          data.name +
          "," +
          data.sys.country +
          "</h2>" +
          "<p>" +
          display.weather +
          data.weather[0].description +
          "</p>" +
          "<p>" +
          display.temp +
          data.main.temp +
          " °C</p>" +
          "<p>" +
          display.tempMax +
          data.main.temp_max +
          " °C</p>" +
          "<p>" +
          display.tempMin +
          data.main.temp_min +
          " °C</p>" +
          "<p>" +
          display.humidity +
          data.main.humidity +
          "%</p>" +
          "<p>" +
          display.windSpeed +
          data.wind.speed +
          display.windSpeedUnit +
          "</p>" +
          "</div>";
        document.title = "Search: " + data.name;
        document.getElementById("loading").innerHTML = "";
        console.log(weatherHtml);
        SearchedCityhistory.push(data.name);

        document.getElementById("historyDisplay").innerHTML =
          reverseList(SearchedCityhistory).join("<br>");
        document.getElementById("weather").innerHTML = weatherHtml;
      } else {
        document.getElementById("loading").innerHTML = "";
        alert(
          "⚠ Failed search weather!" +
            "\n" +
            "\n" +
            "● Check city spelling" +
            "\n" +
            "● Error code: " +
            data.cod
        );
        console.error("Api error: " + data.cod);
      }
    })
    .catch(function (error) {
      document.getElementById("loading").innerHTML = "";
      console.error("Error: " + error);
      if (navigator.onLine == false) {
        alert("⚠ You are off line, please check your internet");
      } else {
        alert("An Error Occered");
      }
    });
}
function reverseList(InputList) {
  var reversed = [];
  for (var indexReverse = InputList.length; indexReverse >= 0; indexReverse--) {
    reversed.push(InputList[indexReverse]);
  }
  return reversed;
}
