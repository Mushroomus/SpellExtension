chrome.tabs.onUpdated.addListener( (tabId, changeInfo,tab) => {
    if (tab.url && tab.url.includes("https://backpack.tf/classifieds") )
    {
        if( changeInfo.status === 'complete')
        {
            chrome.tabs.sendMessage( tabId, {
                type: "NEW",
                tabUrl: tab.url,
                tabToClose: tabId    
            });
         }
    }
});


