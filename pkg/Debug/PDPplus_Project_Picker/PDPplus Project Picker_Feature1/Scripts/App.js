'use strict';

//ExecuteOrDelayUntilScriptLoaded(initializePage, "sp.js");

//function initializePage()
//{
//    var context = SP.ClientContext.get_current();
//    var user = context.get_web().get_currentUser();

//    // This code runs when the DOM is ready and creates a context object which is needed to use the SharePoint object model
//    $(document).ready(function () {
//        getUserName();
//    });

//    // This function prepares, loads, and then executes a SharePoint query to get the current users information
//    function getUserName() {
//        context.load(user);
//        context.executeQueryAsync(onGetUserNameSuccess, onGetUserNameFail);
//    }

//    // This function is executed if the above call is successful
//    // It replaces the contents of the 'message' element with the user name
//    function onGetUserNameSuccess() {
//        $('#message').text('Hello ' + user.get_title());
//    }

//    // This function is executed if the above call fails
//    function onGetUserNameFail(sender, args) {
//        alert('Failed to get user name. Error:' + args.get_message());
//    }
//}

//$(document).ready(function () {
//           createlist();
//});

//function createList()
//{
//    //Get the site url
//    var context = SP.ClientContext.get_current();

//    //Get its web
//    var web = context.Web;

//    ListCreationInformation createInfo = new ListCreationInformation();

//    createInfo.Title="MyList";

//    createInfo.Description="MyDescription";
//    createInfo.Update();
//    create.ExecuteQuery();

//}
//function createlist() {
//    // Create an announcement SharePoint list with the name that the user specifies.
//    //var hostUrl = decodeURIComponent(getQueryStringParameter("SPHostUrl"));
//    var currentcontext = new SP.ClientContext.get_current();
//    var hostcontext = new SP.AppContextSite(currentcontext, hostUrl);
//    var hostweb = hostcontext.get_web();
//    var listCreationInfo = new SP.ListCreationInformation();
//    var listTitle = document.getElementById("createList").value;
//    listCreationInfo.set_title(listTitle);
//    listCreationInfo.set_templateType(SP.ListTemplateType.announcements);
//    var lists = hostweb.get_lists();
//    var newList = lists.add(listCreationInfo);
//    context.load(newList);
//    context.executeQueryAsync(onListCreationSuccess, onListCreationFail);
//}

//function onListCreationSuccess() {
//    alert('List created successfully!');
//}

//function onListCreationFail(sender, args) {
//    alert('Failed to create the list. ' + args.get_message());
//}


//var hostweb;

//$(document).ready(function () {
               
 
//    $("#getHostWebTitle").click(function (event) {

//        getHostWebProperties();
//        event.preventDefault();
//    });
//});
//function getHostWebProperties() {
//    var hostUrl = decodeURIComponent(getQueryStringParameter("SPHostUrl"));
//    var currentcontext = new SP.ClientContext.get_current();
//    var hostcontext = new SP.AppContextSite(currentcontext, hostUrl);
//    var hostweb = hostcontext.get_web();
//    currentcontext.load(hostweb, "Title");
//    currentcontext.executeQueryAsync(onGetWebSuccess, onGetWebFail);
//}

//function getQueryStringParameter(param) {
//    var params = document.URL.split("?")[1].split("&");
//    for (var i = 0; i < params.length; i = i + 1) {
//        var singleParam = params[i].split("=");
//        if (singleParam[0] == param) {
//            return singleParam[1];
//        }
//    }
//}

//function onGetWebSuccess() {
//    alert("The title of the host web of this app is " + hostweb.get_title());
//}

//function onGetWebFail(sender, args) {
//    alert('Failed to get host web title. Error:' + args.get_message());
//}

// Define global variables.
var hostUrl = '';
var projectUid;

var ET;
var PC;
var project;
var projEntity;
var taskEntity;
var resEntity;
var fdls;
var publishedWithFlds;
var lupe;
var arrayOfBIFields = $.Deferred();
var appweburl;
var startMessage = new Object;
var BIFields;
var PTFields = new Array();
var ProjectFields = new Array();
var i;
var newnodeDD1;
var commonValues;

var enumfdl;
var fld;
var counter;
var lupe;
var ft;
var fldenttype;
var nm;

var opt;
var t;
var selectfield;
var selecttest;

$(document).ready(function () {
     //Check Language first 
    //Load that file according to the language 

    //$("#btnconfig").click(function () {

    //    $("#btnconfig").dialog('open');
    //});


    //getProjectFields();

    //getInBuiltProjectFields();
    console.log("Entering");
    getProjectUid();
    

});

function getProjectUid() {

    hostUrl = decodeURIComponent(getQueryStringParameter('SPHostUrl'));
    window.parent.postMessage('getprojectuid', hostUrl);
}
function getQueryStringParameter(paramToRetrieve) {
    var params =
        document.URL.split("?")[1].split("&");
    var strParams = "";
    for (var i = 0; i < params.length; i = i + 1) {
        var singleParam = params[i].split("=");
        if (singleParam[0] == paramToRetrieve)
            return singleParam[1];
    }
}
//3
if (window.addEventListener) {

    window.addEventListener("message", onMessage, false);

}
else {

    if (window.attachEvent) {

        window.attachEvent("onmessage", onMessage);
    }
}
// Get the project ID from the message.
function onMessage(event) {

    // Verify the message origin.
    if (hostUrl.indexOf(event.origin) != 0) return;

    // The expected message format is "<PDPProjectUid>00000000-0000-0000-0000-000000000000</PDPProjectUid>,"
    // so validate by using the length and the start and end tags.
    var length = event.data.length;
    if (length = 67) {
        var expectedStart = "<PDPProjectUid>";
        var expectedEnd = "</PDPProjectUid>";
        var endTagPosition = length - expectedEnd.length;
        var start = event.data.substr(0, expectedStart.length);
        var end = event.data.substr(endTagPosition, expectedEnd.length);

        // Parse out the project ID.
        if (start == expectedStart && end == expectedEnd) {
            projectUid = event.data.substr(expectedStart.length, 36);
            //$get('projectUid').innerText = projectUid;
            
            if (projectUid === "00000000-0000-0000-0000-000000000000") {
                console.log("Its a PDP Page");
                $get('projectUid').innerText = "Its a PDP Page";//check if its pdp page
                contactCE();//4

                //Currently an error in the following . the function not being called.
                window.addEventListener('message', getFieldsFromBasicInfo);//7

                //Add  spin code to wait until data is fetched
                //load_PDP();
            }

            else {
                                //load_Project();
                $get('projectUid').innerText = "Its a Project Page";//check if its a project page
            }
        }
    }
}

//contact Content Editor
function contactCE() {

    hostUrl = decodeURIComponent(getQueryStringParameter('SPHostUrl'));
    appweburl = decodeURIComponent(getQueryStringParameter("SPAppWebUrl"));

    var startMessage = new Object;
    startMessage.name = 'startMessaging';
    startMessage.appweburl = appweburl;
    startMessage.hostUrl = hostUrl;
    // startMessage.src = src;
    parent.postMessage(startMessage, "*");//5

}
function getFieldsFromBasicInfo(e) {//7    
    console.log("BIFields");
    if (e.data.name == "SendBasicInfo") {      

        BIFields = e.data.array.slice();
        
        console.log(BIFields);
        getCustomFields();
    }
}
function getCustomFields() {

    PC = PS.ProjectContext.get_current();
    fdls = PC.get_customFields();
    ET = PC.get_entityTypes();
    projEntity = ET.get_projectEntity();
    PC.load(fdls, 'Include(Name,Id,EntityType,FieldType,InternalName,LookupTable)');
    PC.load(projEntity);
    PC.executeQueryAsync(Success, Failure);
}

function Success() {

    enumfdl = fdls.getEnumerator();
    counter = 0

    while (enumfdl.moveNext()) {

        fld = enumfdl.get_current();
        ft = fld.get_fieldType();
        fldenttype = fld.get_entityType();


        lupe = fld.get_lookupTable();

        //|| ft == 9 (cost) || ft == 4 || ft == 27 || ft == 6 || ft == 17 || ft == 21(text)) {    
        //gets all the Text type ECF; Number value to be searched is via 21.

        if (ft == 21) {

            //Check if Project type
            if (fldenttype.get_name() == projEntity.get_name()) {              

                try {

                    nm = lupe.get_name();
                }
                catch (err) {
                    console.log(fld.get_name());
                   // PTFields.push(fld.get_name());
                }

            }
        }

    }
    //commonValues = PTFields.filter(function (value) {
    //    return BIFields.indexOf(value) > -1;
    //});

    //for (i = 0; i < commonValues.length; i++) {
    //    var opt = document.createElement("option");

    //    var t = document.createTextNode(commonValues[i]);
    //    opt.appendChild(t);
    //    newnodeDD1.appendChild(opt);
    //}

}

function Failure() {
    alert('Some Problem!');
}


