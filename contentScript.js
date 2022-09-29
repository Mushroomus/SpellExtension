(() => {

    // additional function to search for key in object array, when it is found 
    // we are chaning "enabled" value in buttonList 
    function changeEnable( nameFind, enableSet ) {
        for (var i in buttonList) {
          if (buttonList[i].name == nameFind) {
             buttonList[i].enabled = enableSet;
             break; 
          }
        }
     };
    

    // we are setting every button at the beginning "Enabled" to know button need to be show on site 
    function estaminateButtons()
    {
       chrome.storage.local.get(null, function(items) {
           Object.entries(items).forEach(([key, value]) => {
               console.log("Key Value: " + key + " Value: " + value);
               if(value == "off")
                   changeEnable(key,"false");
           });
       });
    }

    // helping list - we know button have to be show, addition to Url
      var buttonList = [
        {name: "Voices", urlChange: "spell=Voices%20from%20Below", enabled: "true"},
        {name: "All", urlChange: "spell=Exorcism%2CHeadless%20Horseshoes%2CBruised%20Purple%20Footprints%2CChromatic%20Corruption%2CPutrescent%20Pigmentation%2CGangreen%20Footprints%2CCorpse%20Gray%20Footprints%2CVoices%20from%20Below%2CPumpkin%20Bombs%2CHalloween%20Fire%2CViolent%20Violet%20Footprints%2CRotten%20Orange%20Footprints%2CSpectral%20Spectrum%2CSinister%20Staining%2CDie%20Job%2CTeam%20Spirit%20Footprints", enabled: "true"},
        {name: "High Paint", urlChange: "spell=Chromatic%20Corruption%2CSpectral%20Spectrum", enabled: "true"},
        {name: "Low Paint", urlChange: "spell=Putrescent%20Pigmentation%2CSinister%20Staining%2CDie%20Job", enabled: "true"},
        {name: "High Footprints", urlChange: "spell=Rotten%20Orange%20Footprints%2CHeadless%20Horseshoes", enabled: "true"},
        {name: "Low Footprints",urlChange: "spell=Bruised%20Purple%20Footprints%2CCorpse%20Gray%20Footprints%2CViolent%20Violet%20Footprints%2CTeam%20Spirit%20Footprints", enabled: "true"},
        {name: "Gangreen", urlChange: "spell=Gangreen%20Footprints", enabled: "true"},
        {name: "Exo", urlChange: "spell=Exorcism", enabled: "true"},
        {name: "Fire", urlChange: "spell=Halloween%20Fire", enabled: "true"},
        {name: "Pumpkin", urlChange: "spell=Pumpkin%20Bombs", enabled: "true"},
        {name: "ExoPumpkin", urlChange: "spell=Exorcism%2CPumpkin%20Bombs", enabled: "true"}
    ];

    chrome.runtime.onMessage.addListener( (message,sender,response) => {
    if (message.type === "NEW")
    {
        estaminateButtons();

        // wait 200 miliseonds - estaminateButtons is async function so we have to wait when it ends 
        setTimeout(function () {
            advancedSettingsLoaded(message.tabUrl);;
          }, 200);
    }
});

const advancedSettingsLoaded = (tabUrl) => {
    // settings up new Url to be opened 
       function urlValue(urlChange) { 
        return function() {
            if( tabUrl.includes("?") )
            {
                if( tabUrl.includes("spell") )
                {
                    if( tabUrl.indexOf("&", tabUrl.indexOf("spell") ) == -1 )
                    {
                        tabUrl = tabUrl.replace( tabUrl.substr( tabUrl.indexOf("spell"), 
                        tabUrl.length - tabUrl.indexOf("spell")  ), '');
                        window.open(tabUrl + urlChange, "_self");
                    }
                    else
                    {
                        tabUrl =  tabUrl.replace( tabUrl.substr( tabUrl.indexOf("spell"), 
                        tabUrl.indexOf("&", tabUrl.indexOf("spell") )  - tabUrl.indexOf("spell") + 1 ), '');
                        window.open(tabUrl + "&" + urlChange, "_self");
                    }
                }
                else
                    window.open(tabUrl + "&" + urlChange, "_self");
            }
            else
                window.open(tabUrl + "?" + urlChange, "_self");
        };
      }

    // assign functions to array 
    var funcs = [];

    for (let i = 0; i < buttonList.length; i++) {

            if( buttonList[i].enabled == "true")
            {
                var urlChange = buttonList[i]["urlChange"];
                funcs[i] = urlValue(urlChange);
            }
        };

        // adding css style to site - buttons
        var link = document.createElement("link");
        link.href = chrome.runtime.getURL('button.css');
        link.type = "text/css";
        link.rel = "stylesheet";
        document.getElementsByTagName("head")[0].appendChild(link);

    // creating buttons and injecting to site
    for(let i=0; i< buttonList.length; i++ )
    {
        if( buttonList[i].enabled == "true")
        {
            var name = buttonList[i]["name"];
            var urlChange = buttonList[i]["urlChange"];

            var buttonName = "spellBtn" + name;
            var buttonName  = document.createElement("button");
            backpackSearchMenu = document.getElementById("search-crumbs");

            buttonName.innerHTML = name;
            buttonName.className = "spellButton";
            buttonName.title = "Click to find " + name + " Spells";

            backpackSearchMenu.appendChild(buttonName);
            buttonName.addEventListener("click", funcs[i]);
        }
    }
}

})();