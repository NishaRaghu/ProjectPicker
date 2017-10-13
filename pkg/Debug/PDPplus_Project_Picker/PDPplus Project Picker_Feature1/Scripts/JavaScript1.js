// Load the cross-domain library JS file
                                              
$.getScript(scriptbase + "SP.RequestExecutor.js", execCrossDomainRequest);
});


// Initialize the RequestExecutor with the app web URL.
var executor = new SP.RequestExecutor(<app web url>);
// Illustrates how to use the executeAsync method.
// Function to prepare and issue the request to get
//  SharePoint data.
function execCrossDomainRequest() {
    var executor;

    // Initialize the RequestExecutor with the app web URL.
    executor = new SP.RequestExecutor(appweburl);

    // Issue the call against the host web.
    // To get the title using REST we can hit the endpoint:
    //      app_web_url/_api/SP.AppContextSite(@target)/web/title?@target='siteUrl'
    // The response formats the data in the JSON format.
    // The functions successHandler and errorHandler attend the
    //      success and error events respectively.
    executor.executeAsync(
        {
            url:
                appweburl +
                "/_api/SP.AppContextSite(@target)/web/title?@target='" +
                hostweburl + "'",
            method: "GET",
            headers: { "Accept": "application/json; odata=verbose" },
            success: successHandler,
            error: errorHandler
        }
         );
}

// Function to handle the success event.
// Prints the host web's title to the page.
function successHandler(data) {
    var jsonObject = JSON.parse(data.body);

    document.getElementById("HostwebTitle").innerHTML =
        "<b>" + jsonObject.d.Title + "</b>";
}

// Function to handle the error event.
// Prints the error message to the page.
function errorHandler(data, errorCode, errorMessage) {
    document.getElementById("HostwebTitle").innerText =
        "Could not complete cross-domain call: " + errorMessage;
}