
// set values in local chrome storage - to mark button is enabled or not
function setOnOff(inputId, key)
{
    if( inputId.checked == true )
        chrome.storage.local.set({[key]: 'on'});
    else
        chrome.storage.local.set({[key]: 'off'});
}


document.addEventListener("DOMContentLoaded", () => {

    chrome.storage.local.get(null, function(items) {

            let inputItems = document.getElementsByClassName("spell");

            for(let i=0; i < inputItems.length; i++)
            {
                // check particular id is in items 
                if( inputItems[i].id in items )
                {
                    // get through storage items and check if key(id of input in html) = 
                    // key value saved in storage - if they are the same 
                    // we need to check value to estimate button need to be turned on or off
                    Object.entries(items).forEach(([key, value]) => {
                        if( key == inputItems[i].id )
                        {
                            if(value == "off")
                                inputItems[i].checked = false; 
                            else if(value == "on")
                                inputItems[i].checked  = true;
                        }
                    });
                }
                else
                    inputItems[i].checked  = true;

                // add to every button listener which marks in storage button is on or off
                inputItems[i].addEventListener("change", function()
                {
                    setOnOff(inputItems[i], inputItems[i].id);
                });
            }
        
    });

});