chrome.tabs.onUpdated.addListener( (tabId, changeInfo,tab) => {

    if(tab.url)
    {
        if(changeInfo.status === 'complete')
        {
            if(tab.url.includes("https://backpack.tf/classifieds"))
            {
                chrome.tabs.sendMessage( tabId, {
                    type: "NEW",
                    tabUrl: tab.url, 
                });
            }
            else if(tab.url.includes("https://backpack.tf/profiles") || tab.url.includes("https://backpack.tf/stats"))
            {
                if( changeInfo.status === 'complete')
                {
                    chrome.tabs.sendMessage( tabId, {
                        type: "newOneButton",
                    });
                 }
            }
        }
    }
});


