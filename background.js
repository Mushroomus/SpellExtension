/*
function searchSpells(word){
    var query = word.selectionText;
    
    if(query.includes('Vintage'))
    {
        query = query.replace('Vintage','');
        query = query.replace(' ', '');
    }

    if(query.includes('Strange'))
    {
        query = query.replace('Strange', '');
        query = query.replace(' ', '');
    }
    
    query = "https://backpack.tf/classifieds?item=" + query + 
    "&spell=Exorcism%2CHeadless%20Horseshoes%2CBruised%20Purple%20Footprints%2CChromatic%20Corruption%2CPutrescent%20Pigmentation%2CGangreen%20Footprints%2CCorpse%20Gray%20Footprints%2CVoices%20from%20Below%2CPumpkin%20Bombs%2CHalloween%20Fire%2CViolent%20Violet%20Footprints%2CRotten%20Orange%20Footprints%2CSpectral%20Spectrum%2CSinister%20Staining%2CDie%20Job%2CTeam%20Spirit%20Footprints";

    console.log("Create url");
    chrome.tabs.create({url: query});  
};

chrome.contextMenus.removeAll(function() {
    chrome.contextMenus.create({
    id: "scrapContest",
    title: "Find Spells!",
    contexts:["selection"],  // ContextType
    documentUrlPatterns : ["https://scrap.tf/auctions/*"]
    });
});  

chrome.contextMenus.onClicked.addListener(searchSpells);  
*/

chrome.tabs.onUpdated.addListener( (tabId, changeInfo,tab) => {

    if(tab.url)
    {
        if(tab.url.includes("https://backpack.tf/classifieds"))
        {
            chrome.tabs.sendMessage( tabId, {
                type: "NEW",
                tabUrl: tab.url
            });
        }
        else if(tab.url.includes("https://backpack.tf/profiles") ||
            tab.url.includes("https://backpack.tf/stats") || tab.url.includes("https://backpack.tf/u"))
        {
            chrome.tabs.sendMessage( tabId, {
                type: "newOneButton"
            });
        }  
    }
});


