(() => {

    // additional function to search for a "name" in buttonList, when it is found 
    // we are changing "enabled" value in buttonList 
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
               if(value == "off")
                   changeEnable(key,"false");
           });
       });
    }

    // additional function to set "enabled" - "additonalSpell" in buttonList 
    function estaminateAdditional()
    {
        chrome.storage.local.get("additionalButton", function(result){

            var value = Object.values(result)[0];

            if(value == "off")
                buttonList[11].enabled = "false";
        });
    }

    // helping list - we know which button have to be show + which url should have particular button
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
        {name: "ExoPumpkin", urlChange: "spell=Exorcism%2CPumpkin%20Bombs", enabled: "true"},
        {name: "additionalButton", enabled: "true" }
    ];

    chrome.runtime.onMessage.addListener( (message,sender,response) => {
    if (message.type === "NEW")
    {
        // that code is running when we are on /classfields

        estaminateButtons();

        // wait 200 miliseonds - estaminateButtons is async function so we have to wait when it ends 
        setTimeout(function () {
            advancedSettingsLoaded(message.tabUrl);;
          }, 200);
    }
    else if(message.type === "newOneButton")
    {
        //that code is running when we are on /stats or /profile

        estaminateAdditional();

        setTimeout(function() {
            if( buttonList[11].enabled === 'true')
                mutattionObserver();
        }, 200);
    }
});

function removeAttribues( hrefValueChange, attribute)
{
    var changeHref =  hrefValueChange.substr(  hrefValueChange.indexOf(attribute) , 
    hrefValueChange.indexOf("&",  hrefValueChange.indexOf(attribute) ) -  hrefValueChange.indexOf(attribute)  );
    
    hrefValueChange =  hrefValueChange.replace( '&' + changeHref, '');
    return hrefValueChange;
}

function mutattionObserver()
{
        // setting up MutationObserver, because popup shows dynamically - we need to monitor website when it pops up 
        const targetNode = document.getElementById("page-content");
        const config = { attributes: true, childList: true, subtree: true };
    
        var helper = document.getElementsByClassName('item-popover');
    
        const callback = (mutationList, observer) => {
            for (const mutation of mutationList) {
                if( mutation.attributeName === 'class' && helper.length == 1 && document.getElementById("newButtonListings") == null)
                {
                    var hrefValue = document.getElementById('popover-search-links').getElementsByClassName("btn btn-default btn-xs")[0].href;
                    hrefValue = hrefValue + '&' + buttonList[1].urlChange;

                    // get all spelled items without craftable etc.
                    if(hrefValue.includes("&craftable="))
                       hrefValue = removeAttribues(hrefValue, 'craftable=')

                    if(hrefValue.includes("&killstreak="))
                        hrefValue = removeAttribues(hrefValue, 'killstreak=')
                    
                    if(hrefValue.includes("&quality="))
                        hrefValue = removeAttribues(hrefValue, 'quality=')
                                
                    if(hrefValue.includes("&killstreak\_tier"))
                        hrefValue = removeAttribues(hrefValue, 'killstreak\_tier=')

                    var newA = document.createElement("a");
                    newA.href = hrefValue;
    
                    var newButton = document.createElement("button");

                    newButton.innerText = "Spells";
                    newButton.className = "spellButton";
                    newButton.title = "Click to get spell listings";
                    newButton.style.height = '20px';
                    newButton.style.width = '50px';
                    newButton.style.marginLeft = '0px';
                    newButton.style.fontSize = '11px';
                    newButton.style.marginTop = '5px';
                    newButton.style.lineHeight = '0';
                    newButton.style.padding = '0px 0px';
    
                    var newDiv = document.createElement("div");
                    newDiv.id = "newButtonListings";

                    newA.appendChild(newButton);
                    newDiv.appendChild(newA);
    
                    document.getElementsByClassName('popover-content')[0].appendChild(newDiv);
                }
            }
          };   
        const observer = new MutationObserver(callback);
        observer.observe(targetNode, config);
}


const advancedSettingsLoaded = (tabUrl) => {
    
        if( buttonList[11].enabled === 'true')
            mutattionObserver();
            
       // settings up new Url to be opened 
       function urlValue(urlChange) { 

            // back to first page 
            if( tabUrl.includes("?page=") )
            {
                var changePage = tabUrl.substr( tabUrl.indexOf("?page=") , 
                tabUrl.indexOf("&", tabUrl.indexOf("?page=") ) - tabUrl.indexOf("?page=") );

                tabUrl = tabUrl.replace(changePage, "?page=1");
            }
 

            if( tabUrl.includes("?") )
            {
                if( tabUrl.includes("spell") )
                {
                    if( tabUrl.indexOf("&", tabUrl.indexOf("spell") ) == -1 )
                    {
                        var replaceText = tabUrl.substr( tabUrl.indexOf("spell") , 
                        tabUrl.length - tabUrl.indexOf("spell")  );

                        return tabUrl.replace(replaceText, '') + '' + urlChange;
                    }
                    else
                    {
                        var replaceText = tabUrl.substr( tabUrl.indexOf("spell"), 
                        tabUrl.indexOf("&", tabUrl.indexOf("spell") )  - tabUrl.indexOf("spell") + 1 );

                        return tabUrl.replace(replaceText, '');
                    }
                }
                else
                {
                    console.log("Doesn't contain spell ");
                    return tabUrl + "&" + urlChange;
                }
            }
            else
               return tabUrl + "?" + urlChange;


        }

        // adding css style to site - buttons
        var link = document.createElement("link");
        link.href = chrome.runtime.getURL('button.css');
        link.type = "text/css";
        link.rel = "stylesheet";
        document.getElementsByTagName("head")[0].appendChild(link);

    // creating <a> with href and <button> and injecting to site
    for(let i=0; i< buttonList.length - 1; i++ )
    {
        if( buttonList[i].enabled == "true")
        {
            var urlChange = buttonList[i]["urlChange"];

            var newA = document.createElement("a");
            
            newA.href = urlValue(urlChange);

            var name = buttonList[i]["name"];

            var buttonName = "spellBtn" + name;
            var buttonName  = document.createElement("button");
            backpackSearchMenu = document.getElementById("search-crumbs");

            buttonName.innerHTML = name;
            buttonName.className = "spellButton";
            buttonName.title = "Click to find " + name + " Spells";


            newA.appendChild(buttonName);
            backpackSearchMenu.appendChild(newA);
        }
    }
}
})();
