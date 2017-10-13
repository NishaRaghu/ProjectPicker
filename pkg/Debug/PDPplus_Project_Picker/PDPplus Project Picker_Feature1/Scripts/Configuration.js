'use strict';


// Define global variables.
var hostUrl = '';
var projectUid;
var table;
var tbody; var trbody;
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
var rowCount;
rowCount = 1;
var enumfdl;
var fld;
var counter;
var lupe;
var ft;
var fldenttype;
var nm;
var dis;
dis = 0;
var opt;
var t;
var selectfield;
var selecttest;
var countid;
countid = 0;
var rowindex;
rowindex = 1;
var cid;
var divforconfig;
var flag;
flag = 0;
var conFlag;
conFlag = 0;
var selectandor;
var visibleRows;
var firstVisRowValues;
var lastCountId;
lastCountId = 0;

$(document).ready(function () {
    //Check Language first 
    //Load that file according to the language 

    //$("#btnconfig").click(function () {

    //    $("#btnconfig").dialog('open');
    //});


    //getProjectFields();
    //getTasks();

    //getFields();
    //getInBuiltProjectFields();

    // getProjectSiteUrl('c2dc4e45-bb0f-e711-80cd-00155d408d01');
    getProjectUid();//1

    $(".ui-widget").dialog({
        autoOpen: true,
        show: 'slide',
        resizable: false,
        position: 'center',
        stack: true,
        height: 'auto',
        width: 'auto',
        modal: true
    });


    $(".ui-widget").dialog("open");




});

function getQueryStringParameter(paramToRetrieve) {
    var params =
        document.URL.split("?")[1].split("&");
    //console.log(document.URL);
    var strParams = "";
    for (var i = 0; i < params.length; i = i + 1) {
        var singleParam = params[i].split("=");
        if (singleParam[0] == paramToRetrieve)
            return singleParam[1];
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

    //var _ = require('underscore');

    if (e.data.name == "SendBasicInfo") {

        //$get('biFields').innerText = e.data.array;

        BIFields = e.data.array.slice();
        getCustomFields();

        //console.log(BIFields);
        //console.log(BIFields.length);
        //for (i = 0; i < BIFields.length; i++)

        //{
        //    var opt = document.createElement("option");

        //    var t = document.createTextNode(BIFields[i]);
        //    opt.appendChild(t);
        //    newnodeDD1.appendChild(opt);
        //}

        //for (i = 0; i < BIFields.length; i++) {
        //    console.log(BIFields[i]);
        //}
        //e.data.array.forEach(function (element) {
        //    BIFields[i] = element;
        //    console.log(BIFields[i]);
        //    i++;

        //});         


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

                //var rowfdl = tblCF.insertRow();

                try {

                    nm = lupe.get_name();
                }
                catch (err) {
                    PTFields.push(fld.get_name());
                }

            }
        }

    }
    commonValues = PTFields.filter(function (value) {
        return BIFields.indexOf(value) > -1;
    });

    for (i = 0; i < commonValues.length; i++) {
        var opt = document.createElement("option");

        var t = document.createTextNode(commonValues[i]);
        opt.appendChild(t);
        newnodeDD1.appendChild(opt);
    }
    //console.log(commonValues);
    //console.log(BIFields);
    //console.log(PTFields);
}

function Failure() {
    alert('Some Problem!');
}


function getProjectUid() {

    hostUrl = decodeURIComponent(getQueryStringParameter('SPHostUrl'));
    window.parent.postMessage('getprojectuid', hostUrl);//2
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

            if (projectUid === "00000000-0000-0000-0000-000000000000") {
                $get('projectUid').innerText = "Its a PDP Page";

                contactCE();//4
                //console.log("same and in PDP");
                //console.log("Listen ")
                window.addEventListener('message', getFieldsFromBasicInfo);//7

                //Add  spin code to wait until data is fetched
                load_PDP();
            }

            else {
                //load_Project();
                $get('projectUid').innerText = "Its a Project Page";

            }

            //Write ProjectUid to a span
            // $get('projectUid').innerText = projectUid;

            // console.log(typeof (projectUid));


            //getCustomFields();
        }
    }
}
function load_PDP() {
    //Chk if db exist if yes Read else create

    //If the required document library exixts then read else create . Check File as well.

    //Create Content Editor web part  . More details needed.

    // Load html elements
    load_html_elements();



}
function load_Project() {

    //Permissions. More details required.
    //Chk if checked out to u  to be able to use the the features.
}

function load_html_elements()//6
{
    var divactions = document.createElement("div");
    divactions.id = "actions";

    var divDD = document.createElement("div");//dropdowndiv
    divDD.setAttribute("class", "ms-Dropdown");
    divDD.setAttribute("tabIndex", "0");
    // divDD.setAttribute("style", "width:100px;float:left;padding-right:2px");
    divDD.setAttribute("style", "float:left");
    var newnodeDD = document.createElement("i");
    newnodeDD.setAttribute("class", "ms-Dropdown-caretDown ms-Icon ms-Icon--ChevronDown");

    newnodeDD1 = document.createElement("select");
    newnodeDD1.setAttribute("class", "ms-Dropdown-select");



    divDD.appendChild(newnodeDD);
    divDD.appendChild(newnodeDD1);

    var divbtn1 = document.createElement("div");

    divbtn1.id = "divbtn1";
    divbtn1.setAttribute("style", "margin-left:60px;");

    var btn = document.createElement("Button");
    btn.id = "config";
    btn.setAttribute("class", "ms-Button");
    // btn.setAttribute("onclick", "addDataToElements()");
    //btn.setAttribute("style", "float:left;color:blue");
    btn.setAttribute("style", "color:blue");

    var newnode = document.createElement('span');
    newnode.setAttribute("class", "ms-Button-icon");
    var newnodei = document.createElement('i');
    newnodei.setAttribute("class", "ms-Icon ms-Icon--plus");
    newnode.appendChild(newnodei);
    var newnode1 = document.createElement('span');
    newnode1.setAttribute("class", "ms-Button-label");
    var t1 = document.createTextNode("Configuration");
    newnode1.appendChild(t1);
    var newnode2 = document.createElement('span');
    newnode2.setAttribute("class", "ms-Button-description");

    //var t3 = document.createTextNode("Get/Set Configuration Settings");
    //newnode2.appendChild(t3);

    btn.appendChild(newnode);
    btn.appendChild(newnode1);
    btn.appendChild(newnode2);

    divbtn1.appendChild(btn);
    divactions.appendChild(divDD);
    divactions.appendChild(divbtn1);
    document.body.appendChild(divactions);

    divforconfig = document.createElement("div");
    divforconfig.id = "divconfiguration";
    divforconfig.setAttribute("class", "ui-widget");
    divforconfig.style.display = "none";

    //var divconfig = document.createElement("div");
    //divconfig.id = "dialog-form";

    var formconfig = document.createElement("form");
    formconfig.id = "formconfig";
    var fieldsetconfig = document.createElement("fieldset");

    //div1 inside the form
    var uiwidget = document.createElement("div");
    uiwidget.id = "users-contain";
    var heading = document.createElement("h2");
    heading.id = "heading1";
    //document.getElementById("heading1").innerHTML = "Custom Filters";
    table = document.createElement("table");
    table.id = "users";
    //table.setAttribute("class", "ui-widget ui-widget-content");
    table.setAttribute("onclick", "AndOrChoosable()");
    //var thead = document.createElement("thead");
    tbody = document.createElement("tbody");

    var trthead = document.createElement("tr");
    //console.log("Firstrow" + trthead.rowIndex);
    // trthead.setAttribute("onclick", "getRowIndex(this)");
    //trthead.setAttribute("class", "ui-widget-header");

    var thtrhead1 = document.createElement("th");
    thtrhead1.id = "valid";
    var thtrhead2 = document.createElement("th");
    thtrhead2.id = "field";
    var thtrhead3 = document.createElement("th");
    thtrhead3.id = "choice";
    var thtrhead4 = document.createElement("th");
    thtrhead4.id = "text";
    var thtrhead5 = document.createElement("th");
    thtrhead5.id = "andor";

    trthead.appendChild(thtrhead1);
    trthead.appendChild(thtrhead2);
    trthead.appendChild(thtrhead3);
    trthead.appendChild(thtrhead4);
    trthead.appendChild(thtrhead5);


    tbody.appendChild(trthead);

    trbody = document.createElement("tr");
    //console.log("Second row" + trbody.rowIndex);
    trbody.setAttribute("onclick", "getRowIndex(this)");
    //trbody.id = id1;
    //   var id1 = "idFilterRow_" + rowindex;

    // console.log("idFilterRow_"+ countid);
    //trbody.id = id1;

    rowCount = $('#users tr').length;

    trbody.id = "idFilterRow_" + (rowCount + 1);
    //console.log("Length of table:" + rowCount);


    trbody.count_id = rowCount + 1;

    //console.log("row count_id: " + trbody.count_id);
    //console.log("row trbody.id: " + trbody.id);

    var td1 = document.createElement("td");
    td1.setAttribute("style", "width:10%;");
    //td1.align("center");

    var td2 = document.createElement("td");
    td2.setAttribute("style", "width:29%;");

    var td3 = document.createElement("td");
    td3.setAttribute("style", "width:29%;");

    var td4 = document.createElement("td");
    td4.setAttribute("style", "width:29%;");

    //var td4a = document.createElement("td");


    var td5 = document.createElement("td");
    td5.setAttribute("style", "width:13%;");

    var td6 = document.createElement("td");
    td6.setAttribute("style", "width:10%;");

    var image1 = document.createElement("img");
    //image1.id = "redx_" + rowindex;

    image1.id = "redx_" + (rowCount + 1);
    image1.count_id = rowCount + 1;

    //console.log("row count_id: " + image1.count_id);
    //console.log("redx id"+image1.id);

    image1.setAttribute("src", "/_layouts/15/inc/pwa/images/redx.gif");
    image1.setAttribute("isactive", "false");
    image1.setAttribute("style", "border-width: 0px; display: none;");

    var image2 = document.createElement("img");
    //image2.id = "greencheck_" + rowindex;

    image2.id = "greencheck_" + (rowCount + 1);
    image2.count_id = rowCount + 1;

    //console.log("greencheck_ row count_id: " + image2.count_id);
    //console.log("greencheck_ id" + image2.id);

    image2.setAttribute("src", "/_layouts/15/inc/pwa/images/greencheck.gif");
    image2.setAttribute("isactive", "false");
    image2.setAttribute("style", "border-width: 0px; display: none;");

    var image3 = document.createElement("img");

    //image3.id = "new_" + rowindex;
    image3.id = "new_" + (rowCount + 1);
    image3.count_id = rowCount + 1;

    //console.log("new_ row count_id: " + image3.count_id);
    //console.log("new_ id" + image3.id);

    image3.setAttribute("src", "/_layouts/15/1033/images/new.gif");
    image3.setAttribute("isactive", "true");
    image3.setAttribute("style", "border-width: 0px;");

    td1.appendChild(image1);
    td1.appendChild(image2);
    td1.appendChild(image3);

    selectfield = document.createElement("select");
    //selectfield.id = "select-field" + rowindex;

    //selectfield.count_id = rowindex;
    selectfield.id = "select-field" + (rowCount + 1);
    selectfield.count_id = (rowCount + 1);
    //console.log("select-field row count_id: " + selectfield.count_id);
    //console.log("select-field id " + selectfield.id);

    selectfield.setAttribute("style", "width:100%;border:.5px solid;");
    // selectfield.setAttribute("onchange", "jsfunction(rowindex)");
    selectfield.setAttribute("onchange", "jsfunction(this.count_id)");

    td2.appendChild(selectfield);

    selecttest = document.createElement("select");
    //selecttest.id = "select-test" + rowindex;

    //selecttest.count_id = rowindex;
    selecttest.id = "select-test" + (rowCount + 1);
    selecttest.count_id = (rowCount + 1);
    //console.log("select-test row count_id: " + selecttest.count_id);
    //console.log("select-test id " + selecttest.id);


    selecttest.setAttribute("style", "width:100%;border:.5px solid;");
    // selecttest.setAttribute("onchange", "jsfunction(rowindex)");
    selecttest.setAttribute("onchange", "jsfunction(this.count_id)");

    td3.appendChild(selecttest);

    var selectvalue = document.createElement("input");
    //selectvalue.id = "select-value" + rowindex;

    //selectvalue.count_id = rowindex;
    selectvalue.id = "select-value" + (rowCount + 1);
    selectvalue.count_id = (rowCount + 1);
    selectvalue.defaultValue = selectvalue.value
    //console.log("select-value row count_id: " + selectvalue.count_id);
    //console.log("select-value id " + selectvalue.id);

    //  selectvalue.setAttribute("onchange", "jsfunction(rowindex)");
    selectvalue.setAttribute("onchange", "jsfunction(this.count_id)");
    //selectvalue.setAttribute("onchange", "jsfunction(this.count_id,this)");


    selectvalue.setAttribute("style", "width:95%;border-style: ridge;border: .5px solid ;background-color:transparent ;");//#9f9f9fwhen theme is changed the colors will not match rgba(239, 239, 239, 0.95) , recommend inheriting//padding-right:0px;padding-left:0px;background-color:transparent;//padding-right:0px;padding-left:0px;
    //selectvalue.maxLength(256);
    td4.appendChild(selectvalue);

    rowCount = $('#users tr').length;
    selectandor = document.createElement("select");
    // selectandor.id = "select-andor";

    selectandor.id = "select-andor" + (rowCount + 1);
    selectandor.count_id = (rowCount + 1);
    //console.log("select-andor row count_id: " + selectandor.count_id);
    //console.log("select-andor id " + selectandor.id);

    selectandor.setAttribute("style", "width:100%;border:.5px solid;");
    selectandor.setAttribute("onchange", "createRowFilter(rowCount)");
    td5.appendChild(selectandor);

    var btnDelete = document.createElement("button");
    var t4 = document.createTextNode("Delete");
    btnDelete.id = "deletebtn" + rowindex;
    //btnDelete.count_id = rowCount + countid;
    btnDelete.count_id = rowCount + 1;
    // $(btnDelete).attr("count_id", rowCount + countid);
    $(btnDelete).attr("count_id", rowCount + countid);
    cid = btnDelete.count_id;
    //console.log("button row count_id: " + btnDelete.count_id);
    //console.log("button id " + btnDelete.id);


    btnDelete.setAttribute("type", "button");
    btnDelete.setAttribute("onclick", "deletethisRow(this,disRow,cid)");
    btnDelete.appendChild(t4);

    td6.appendChild(btnDelete);

    trbody.appendChild(td1);
    trbody.appendChild(td2);
    trbody.appendChild(td3);
    trbody.appendChild(td4);
    //trbody.appendChild(td4a);
    trbody.appendChild(td5);
    trbody.appendChild(td6);

    tbody.appendChild(trbody);
    //table.appendChild(thead);
    table.appendChild(tbody);

    uiwidget.appendChild(heading);
    uiwidget.appendChild(table);

    //document.body.appendChild(uiwidget);



    //var configdiv = document.createElement("div");//dropdowndiv
    //configdiv.setAttribute("class", "ms-Dropdown");
    //configdiv.setAttribute("tabIndex", "0");
    //configdiv.setAttribute("style", "width:100px;float:left;padding-right:2px");
    ////configdiv.setAttribute("style", "float:left");
    //var newnodeconfigdiv = document.createElement("i");
    //newnodeconfigdiv.setAttribute("class", "ms-Dropdown-caretDown ms-Icon ms-Icon--ChevronDown");
    //var newnodenewnodeconfigdiv1 = document.createElement("select");
    //newnodenewnodeconfigdiv1.setAttribute("class", "ms-Dropdown-select");
    //configdiv.appendChild(newnodeconfigdiv);
    //configdiv.appendChild(newnodenewnodeconfigdiv1);


    fieldsetconfig.appendChild(uiwidget);


    // formconfig.appendChild(fieldsetconfig);
    ////divconfig.appendChild(formconfig);



    //divforconfig.appendChild(uiwidget); 

    //div2 inside the form

    var okcancel = document.createElement("div");
    okcancel.id = "okcancel";
    okcancel.setAttribute("class", "ms-core-form-bottomButtonBox");

    //ok and cancel button creation

    var btnOK = document.createElement("input");
    btnOK.id = "btnOK";
    btnOK.setAttribute("type", "button");
    btnOK.setAttribute("value", "OK");
    btnOK.setAttribute("onclick", "okaction()");

    okcancel.appendChild(btnOK);

    var btnCancel = document.createElement("input");
    btnCancel.id = "btnCancel";
    btnCancel.setAttribute("type", "button");
    btnCancel.setAttribute("value", "Cancel");
    btnCancel.setAttribute("onclick", "cancelaction()");

    okcancel.appendChild(btnCancel);

    fieldsetconfig.appendChild(okcancel);

    formconfig.appendChild(fieldsetconfig);

    divforconfig.appendChild(formconfig);

    //divforconfig.appendChild(okcancel); 

    document.body.appendChild(divforconfig);

    //tr[0] data
    document.getElementById("heading1").innerHTML = "Custom Filter";
    document.getElementById("valid").innerHTML = "Valid?";
    document.getElementById("field").innerHTML = "Field Name";
    document.getElementById("choice").innerHTML = "Test";
    document.getElementById("text").innerHTML = "Value";
    document.getElementById("andor").innerHTML = "And/Or";

    //tr[1] data
    addDataToElements();


    //    <div id="dialog-form" title="Create new user">
    //  <p class="validateTips">All form fields are required.</p>

    //  <form>
    //    <fieldset>
    //      <label for="name">Name</label>
    //      <input type="text" name="name" id="name" value="Jane Smith" class="text ui-widget-content ui-corner-all">
    //      <label for="email">Email</label>
    //      <input type="text" name="email" id="email" value="jane@smith.com" class="text ui-widget-content ui-corner-all">
    //      <label for="password">Password</label>
    //      <input type="password" name="password" id="password" value="xxxxxxx" class="text ui-widget-content ui-corner-all">

    //      <!-- Allow form submission with keyboard without duplicating the dialog button -->
    //      <input type="submit" tabindex="-1" style="position:absolute; top:-1000px">
    //    </fieldset>
    //  </form>
    //</div>
    //var rowCount = $('#users tr').length;
    //// var x1 = document.getElementById("users").rows.length;
    //console.log("Length of table:" + rowCount);

    //place where $("#config").click(function () { was written
    //addDataToElements();
    $("#config").click(function () {
        //conFlag++;
        //console.log(conFlag);
        //if (conFlag > 0 && conFlag < 2) {

        divforconfig.style.display = "block";
        divforconfig.setAttribute("style", "z-index: 1505; display: block; width: 632px; height: 236px; left: 323px; top: 189px;");


        //change to id and chk when there are multiple id for each row. set counters.
        //getProjectFields();for customefields alone.

        // getProjectSiteUrl('c2dc4e45-bb0f-e711-80cd-00155d408d01');//get all fields custom and built -in project fields from Project Data


        //var optnullfield = document.createElement("option");
        //var ont1 = document.createTextNode(" ");
        //optnullfield.appendChild(ont1);
        //selectfield.appendChild(optnullfield);

        //getProjectSiteUrl();
        //var optnulltest = document.createElement("option");
        //var ont = document.createTextNode(" ");
        //optnulltest.appendChild(ont);
        //selecttest.appendChild(optnulltest);

        //opt = document.createElement("option");
        //t = document.createTextNode("equals");
        //opt.appendChild(t);
        //selecttest.appendChild(opt);

        //var opt1 = document.createElement("option");
        //var t1 = document.createTextNode(" ");
        //opt1.appendChild(t1);
        //selectandor.appendChild(opt1);

        //var opt3 = document.createElement("option");
        //var t3 = document.createTextNode("Or");
        //opt3.appendChild(t3);
        //selectandor.appendChild(opt3);

        //var opt2 = document.createElement("option");
        //var t2 = document.createTextNode("And");
        //opt2.appendChild(t2);
        //selectandor.appendChild(opt2);

        //$("#test").change(function () {
        //    alert("Element Changed");
        //});
        //}
    });

    //    $("#deletebtn" + rowindex).click(function () {

    //        alert("deleting " + rowindex+" row")

    //    });
}

function getProjectFields() {

    PC = PS.ProjectContext.get_current();
    fdls = PC.get_customFields();
    ET = PC.get_entityTypes();
    projEntity = ET.get_projectEntity();
    PC.load(fdls, 'Include(Name,Id,EntityType,FieldType)');

    PC.load(projEntity);
    PC.executeQueryAsync(ProjSuccess, ProjFailure);
}

function ProjSuccess() {

    enumfdl = fdls.getEnumerator();

    while (enumfdl.moveNext()) {

        fld = enumfdl.get_current();
        ft = fld.get_fieldType();
        fldenttype = fld.get_entityType();

        //Check if Project type
        if (fldenttype.get_name() == projEntity.get_name()) {

            //PTFields.push(fld.get_name());
            //console.log(fld.get_name());
            ProjectFields.push(fld.get_name());
        }

    }

    for (i = 0; i < ProjectFields.length; i++) {
        opt = document.createElement("option");
        t = document.createTextNode(ProjectFields[i]);
        opt.appendChild(t);
        selectfield.appendChild(opt);
    }
    //console.log(commonValues);
    //console.log("Length of Custom Fields");
    //console.log(ProjectFields.length);
}

function ProjFailure() {
    alert('Some problem to get the Project fields!');
}

function getInBuiltProjectFields() {

    var projContext1 = PS.ProjectContext.get_current();
    var projects1 = projContext1.get_projects();
    projContext1.load(projects1);//,'Include(Name,Id,StartDate,FinishDate)'
    projContext1.executeQueryAsync(

        function () {
            var pro;
            var stid;

            // console.log("Built-in Project Fields");
            var projenum = projects1.getEnumerator();
            while (projenum.moveNext()) {
                //  pro = projenum.get_current().get_name();
                pro = projenum.get_current();


                stid = pro.get_id();
                if (stid == "c2dc4e45-bb0f-e711-80cd-00155d408d01")//  877cdbd6-fa0d-e611-80d4-00155d085c14
                {
                    var temp = pro.$2_0.$K_0;
                    var property = Object.getOwnPropertyNames(temp);
                    //console.log(property);

                    //var tsks = pro.$3I_0;
                    //var tskprop=Object.get_taskListId(tsks);
                    //console.log(tskprop);
                    //console.log(pro);

                }


                //console.log(pro);
                // console.log(stid);
                //console.log(stdate);
            }
        }
        ,

        function () {
            projectSiteUrlDelay.reject(false);


        });
}
var projtasks;
function getTasks() {
    var projectContext2 = PS.ProjectContext.get_current();
    //var PubTsks = PS.PublishedProjects.get_tasks();
    var gp = projectContext2.get_projects();
    var projid = gp.getById('c2dc4e45-bb0f-e711-80cd-00155d408d01');
    projtasks = projid.get_tasks();
    projectContext2.load(projtasks);//, 'Include(Id, Name, Start, ScheduledStart, Completion)'
    projectContext2.executeQueryAsync(PSucc, PFail);
}

function PSucc() {

    var enumfdl = projtasks.getEnumerator();

    while (enumfdl.moveNext()) {
        var fldtsk = enumfdl.get_current();
        //var idtsk=fldtsk.get_id();
        //if (idtsk == 'e5a858ad-9b76-e711-9c1a-00249b1746aa') {
        var temp = fldtsk.$2_0.$K_0;
        var property = Object.getOwnPropertyNames(temp);
        // console.log(property);
        //console.log(fldtsk);
        //   }


    }
}

function PFail() {
    alert("Wrong");
}

function getFields() {

    PC = PS.ProjectContext.get_current();
    ET = PC.get_entityTypes();
    projEntity = ET.get_projectEntity();
    PC.load(projEntity);
    PC.executeQueryAsync(ProjSuccess1, ProjFailure1);
}
function ProjSuccess1() {

    // var enumfdl = projEntity.getEnumerator();
    //  var enumfdl = projEntity.get_current();
    //while (enumfdl.moveNext()) {
    //    var fldtsk = enumfdl.get_current();
    //    //var idtsk=fldtsk.get_id();
    //    //if (idtsk == 'e5a858ad-9b76-e711-9c1a-00249b1746aa') {
    //    //var temp = fldtsk.$2_0.$K_0;
    //    //var property = Object.getOwnPropertyNames(temp);
    //    //console.log(property);
    //console.log(fldtsk);
    //   }


    //}
}

function ProjFailure1() {
    alert("Wrong");
}


function getProjectSiteUrl1(id) {
    var hostUrl = decodeURIComponent(getQueryStringParameter('SPHostUrl'));
    var scriptbase = hostUrl + "/_layouts/15/";
    $.getScript(scriptbase + "SP.RequestExecutor.js", function () { execCrossDomainRequestgetProjectSiteUrl1(id); });
}
function execCrossDomainRequestgetProjectSiteUrl1(id) {
    var appweburl = decodeURIComponent(getQueryStringParameter("SPAppWebUrl"));

    var executor = new SP.RequestExecutor(appweburl);
    executor.executeAsync(
        {
            //url: appweburl + "/_api/ProjectData/Projects?",
            url: appweburl + "/_api/ProjectData/Projects?",
            myParam: id,
            method: "GET",
            headers: { "Accept": "application/json; odata=verbose" },
            success: successHandlergetProjectSiteUrl1,
            error: errorHandlergetProjectSiteUrl
        }
    );
}

//var ProjectFields1 = new Array();
function successHandlergetProjectSiteUrl1(data) {

    var array = []; var leng = 0;
    var jsonObject = JSON.parse(data.body);
    var results = jsonObject.d.results;
    var temp = [];

    for (var i in results) {

        if (results[i].ProjectId == this.myParam) {
            for (var k in results[i]) {
                if (results[i][k] == null) {
                    temp.push(k);
                } else {
                    var jh = typeof results[i][k];
                    if (jh != "object") {
                        temp.push(k);
                    }
                }
            }

            // console.log(temp);

        }
    }

    for (i = 0; i < temp.length; i++) {

        opt = document.createElement("option");
        t = document.createTextNode(temp[i]);//ProjectFields[i]);
        opt.appendChild(t);
        selectfield.appendChild(opt);

    }

}

//function successHandlergetProjectSiteUrl(data) {

//        var  array = [];  var  leng = 0;
//        var  jsonObject = JSON.parse(data.body);
//        var results = jsonObject.d.results;
//        var temp = [];

//        for (var i in results) {

//                if  (results[i].ProjectId ==  this.myParam) {
//                        //projectSiteUrlDelay.resolve(true, results[i].ProjectWorkspaceInternalUrl);
//                        //returnedProjectSiteUrl = results[i].ProjectWorkspaceInternalUrl;
//                        //return  returnedProjectSiteUrl;

//            //console.log(results[i]);

//                   // for (var k in results[i])
//                       // if (typeof results[i][k] == "object") {
//                    //    temp.push(typeof  results[i][k]);
//                       // }
//                    //console.log(temp);
//                    //ProjectFields.push(Object.getOwnPropertyNames(results[i]));
//                   var property = Object.getOwnPropertyNames(results[i]);

//                   //console.log(property); 
//                  // ProjectFields1 = property;
//                }
//            //    else  if  (i == results.length - 1 && results[i].ProjectId !=  this.myParam) {
//            //            projectSiteUrlDelay.reject(false);
//            //    }
//        }
//        //ProjectFields.push(property);

//       // console.log(property.length);
//       //console.log(ProjectFields1);
//        //ProjectFields = ProjectFields1.split(",");
//        //console.log(property.length);
//        for (i = 0; i < property.length; i++) {          

//            opt = document.createElement("option");
//            t = document.createTextNode(property[i]);//ProjectFields[i]);
//            opt.appendChild(t);
//            selectfield.appendChild(opt);
//        }

//        // projectSiteUrlDelay.reject(false);
//}
function errorHandlergetProjectSiteUrl() {
    //  projectSiteUrlDelay.reject(false);
    console.log("Wrong");
}
function getProjectSiteUrl() {
    var hostUrl = decodeURIComponent(getQueryStringParameter('SPHostUrl'));
    var scriptbase = hostUrl + "/_layouts/15/";
    $.getScript(scriptbase + "SP.RequestExecutor.js", function () { execCrossDomainRequestgetProjectSiteUrl(); });
}
function execCrossDomainRequestgetProjectSiteUrl(id) {
    var appweburl = decodeURIComponent(getQueryStringParameter("SPAppWebUrl"));

    var executor = new SP.RequestExecutor(appweburl);
    executor.executeAsync(
        {
            //url: appweburl + "/_api/ProjectData/Projects?",
            url: appweburl + "/_api/ProjectData/Projects?$top=1",
            //myParam: id,
            method: "GET",
            headers: { "Accept": "application/json; odata=verbose" },
            success: successHandlergetProjectSiteUrl,
            error: errorHandlergetProjectSiteUrl
        }
    );
}
var ProjectFields1 = new Array();
var disRow;
function successHandlergetProjectSiteUrl(data) {

    var array = []; var leng = 0;
    var jsonObject = JSON.parse(data.body);
    //var results = jsonObject.d.results;
    var results = jsonObject.d;
    var temp = [];
    //console.log(results);
    for (var i in results) {

        // console.log(results[i]);
        // console.log(typeof results[i]);
        for (var k in results[i]) {
            if (results[i][k] == null) {
                temp.push(k);
            } else {
                var jh = typeof results[i][k];
                if (jh != "object") {
                    temp.push(k);
                }
            }
        }
        //console.log(temp);
    }

    for (i = 0; i < temp.length; i++) {

        opt = document.createElement("option");
        t = document.createTextNode(temp[i]);//ProjectFields[i]);
        opt.appendChild(t);
        selectfield.appendChild(opt);

    }
}
function jsfunction(x) {

    //console.log("countid passed on change event" +x );
    //console.log("new_" + countid);
    //console.log("greencheck_" + countid);

    //var oldValue = o.defaultValue;
    //var newValue = o.value;
    //console.log(oldValue);
    //console.log(newValue);

    //$("#redx_" + rowindex).show('slow');
    //$("#new_" + rowindex).hide();
    //console.log("redx id: ")
    $("#redx_" + x).show('slow');
    $("#new_" + x).hide();

    // var d = document.getElementById("select-field" + rowindex);
    var felid = "#select-field" + x;
    var conceptName = $(felid).find(":selected").text();

    var felid1 = "#select-test" + x;
    var conceptName1 = $(felid1).find(":selected").text();
    var valuesel = document.getElementById("select-value" + x).value;


    if (conceptName != " " && conceptName1 != " " && valuesel != "") {

        $("#greencheck_" + x).show('slow');
        $("#redx_" + x).hide();
    }
    else {

        $("#greencheck_" + x).hide();
    }

}
var RowIndex;
function getRowIndex(j) {

    rowCount = $('#users tr').length;
    visibleRows = $("#users tr:visible").length;

}
function createRowFilter(rowCount) {
    //alert("Changed");
    //countid++;

    console.log("Total rowcount" + rowCount);
    console.log("Visible rowcount" + visibleRows);

    if (rowCount <= 4 || visibleRows <= 4) {


        //console.log("idFilterRow_" + countid);
        trbody = document.createElement("tr");

        //trbody.id = "idFilterRow_" + (rowindex + 1);

        //rowCount = $('#users tr').length;

        trbody.id = "idFilterRow_" + (rowCount + countid);


        // trbody.count_id = rowindex + 1;

        trbody.count_id = rowCount + countid;

        //console.log("trbody.count_id: " + trbody.count_id);
        //console.log("trbody.id: " + trbody.id);

        trbody.setAttribute("onclick", "getRowIndex(this)");


        var td1 = document.createElement("td");
        td1.setAttribute("style", "width:10%;");
        //td1.align("center");

        var td2 = document.createElement("td");
        td2.setAttribute("style", "width:29%;");

        var td3 = document.createElement("td");
        td3.setAttribute("style", "width:29%;");

        var td4 = document.createElement("td");
        td4.setAttribute("style", "width:29%;");

        //var td4a = document.createElement("td");


        var td5 = document.createElement("td");
        td5.setAttribute("style", "width:13%;");

        var td6 = document.createElement("td");
        td6.setAttribute("style", "width:10%;");

        var image1 = document.createElement("img");
        // image1.id = "redx_" + (rowindex + 1);

        image1.id = "redx_" + (rowCount + countid);

        //console.log("redx id on creation: " + image1.id);

        image1.setAttribute("src", "/_layouts/15/inc/pwa/images/redx.gif");
        image1.setAttribute("isactive", "false");
        image1.setAttribute("style", "border-width: 0px; display: none;");

        var image2 = document.createElement("img");

        // image2.id = "greencheck_" + (rowindex + 1);

        image2.id = "greencheck_" + (rowCount + countid);

        //console.log("greencheck id on creation: " + image2.id);

        image2.setAttribute("src", "/_layouts/15/inc/pwa/images/greencheck.gif");
        image2.setAttribute("isactive", "false");
        image2.setAttribute("style", "border-width: 0px; display: none;");

        var image3 = document.createElement("img");

        // image3.id = "new_" + (rowindex + 1);

        image3.id = "new_" + (rowCount + countid);

        //console.log("new_ id on creation: " + image3.id);

        image3.setAttribute("src", "/_layouts/15/1033/images/new.gif");
        image3.setAttribute("isactive", "true");
        image3.setAttribute("style", "border-width: 0px;");

        td1.appendChild(image1);
        td1.appendChild(image2);
        td1.appendChild(image3);

        selectfield = document.createElement("select");

        //selectfield.id = "select-field" + (rowindex + 1);

        //selectfield.count_id = rowindex + 1;
        selectfield.id = "select-field" + (rowCount + countid);
        selectfield.count_id = rowCount + countid;

        //console.log("selectfield: " + selectfield.count_id);
        //console.log("selectfield.id: " + selectfield.id);


        selectfield.setAttribute("style", "width:100%;border: .5px solid;");
        selectfield.setAttribute("onchange", "jsfunction(this.count_id)");
        td2.appendChild(selectfield);

        selecttest = document.createElement("select");
        //selecttest.id = "select-test" + (rowindex + 1);

        //selecttest.count_id = rowindex + 1;

        selecttest.id = "select-test" + (rowCount + countid);
        selecttest.count_id = rowCount + countid;

        //console.log("selecttest: " + selecttest.count_id);
        //console.log("selecttest.id: " + selecttest.id);

        selecttest.setAttribute("style", "width:100%;border: .5px solid;");
        // selecttest.setAttribute("onchange", "jsfunction(rowindex)");
        selecttest.setAttribute("onchange", "jsfunction(this.count_id)");

        td3.appendChild(selecttest);

        var selectvalue = document.createElement("input");
        //selectvalue.id = "select-value" + (rowindex + 1);

        ////var rowCount = $('#users tr').length;

        //selectvalue.count_id = rowindex + 1;
        //selectvalue.count_id = rowCount + 1;

        // selectvalue.setAttribute("onchange", "jsfunction(rowindex)");

        selectvalue.id = "select-value" + (rowCount + countid);
        selectvalue.count_id = rowCount + countid;

        //console.log("selectvalue: " + selectvalue.count_id);
        //console.log("selectvalue.id: " + selectvalue.id);


        selectvalue.setAttribute("onchange", "jsfunction(this.count_id)");

        selectvalue.setAttribute("style", "width:95%;border-style: ridge;border: .5px solid ;background-color:transparent ;");//#9f9f9fwhen theme is changed the colors will not match rgba(239, 239, 239, 0.95) , recommend inheriting//padding-right:0px;padding-left:0px;background-color:transparent;//padding-right:0px;padding-left:0px;
        //selectvalue.maxLength(256);
        td4.appendChild(selectvalue);

        var selectandor = document.createElement("select");
        selectandor.id = "select-andor" + (rowCount + countid);
        selectandor.count_id = rowCount + countid;

        //console.log("andor id " + selectandor.id);
        selectandor.setAttribute("style", "width:100%;border: .5px solid;");

        if (rowCount >= 4 && visibleRows >= 4) {
            //if (disRow == null) {
            selectandor.setAttribute("disabled", "true");
            //    //dis++;
            disRow = rowCount + countid;
            //}
            //else {           
            //selectandor.setAttribute("disabled", "true");
            //    var selandor = "select-andor"+(disRow);
            //    // $(selandor).prop('disabled',false);
            //    //document.getElementById("select-andor" + (disRow)).disable = false;
            //    $(selandor).prop("disabled", false);
            //    disRow = "";
            //}
        }
        //else {
        //    //if (document.getElementById(""))
        //    selectandor.setAttribute("isactive", "true");
        //}
        selectandor.setAttribute("onchange", "createRowFilter(rowCount)");
        td5.appendChild(selectandor);

        var btnDelete = document.createElement("button");
        var t4 = document.createTextNode("Delete");
        //btnDelete.id = "deletebtn" + (rowindex + 1);

        btnDelete.id = "btnDelete" + (rowCount + countid);
        btnDelete.count_id = rowCount + countid;
        $(btnDelete).attr("count_id", rowCount + countid);
        cid = btnDelete.count_id;
        //console.log("btnDelete.countid: " + btnDelete.count_id);

        btnDelete.setAttribute("type", "button");
        btnDelete.setAttribute("onclick", "deletethisRow(this,disRow,cid)");
        btnDelete.appendChild(t4);

        td6.appendChild(btnDelete);

        trbody.appendChild(td1);
        trbody.appendChild(td2);
        trbody.appendChild(td3);
        trbody.appendChild(td4);
        //trbody.appendChild(td4a);
        trbody.appendChild(td5);
        trbody.appendChild(td6);

        tbody.appendChild(trbody);
        //table.appendChild(thead);
        table.appendChild(tbody);

        //add data to the elemnts:

        var optnullfield = document.createElement("option");
        var ont1 = document.createTextNode(" ");
        optnullfield.appendChild(ont1);
        selectfield.appendChild(optnullfield);

        getProjectSiteUrl();
        var optnulltest = document.createElement("option");
        var ont = document.createTextNode(" ");
        optnulltest.appendChild(ont);
        selecttest.appendChild(optnulltest);

        opt = document.createElement("option");
        t = document.createTextNode("equals");
        opt.appendChild(t);
        selecttest.appendChild(opt);

        var opt1 = document.createElement("option");
        var t1 = document.createTextNode(" ");
        opt1.appendChild(t1);
        selectandor.appendChild(opt1);

        var opt3 = document.createElement("option");
        var t3 = document.createTextNode("Or");
        opt3.appendChild(t3);
        selectandor.appendChild(opt3);

        var opt2 = document.createElement("option");
        var t2 = document.createTextNode("And");
        opt2.appendChild(t2);
        selectandor.appendChild(opt2);


        // var x1 = document.getElementById("users").rows.length;
        //console.log("Length of table:" + rowCount);
    }

}

function deletethisRow(h, disRow, cid) {

    if (flag == 0) {

        RowIndex = $(h).closest('tr').index();
        rowCount = $('#users tr').length;
        visibleRows = $("#users tr:visible").length;

        countid++;

        if (disRow > 0) {

            var selandor = "#select-andor" + (disRow);
            if ($(selandor).prop("disabled") == true) {
                //alert(selandor);
                //alert("Was Disabled");
                $(selandor).prop("disabled", false);
            }
            //else {

            //    //alert(selandor);
            //    //alert("Was Enabled");
            //}

            //selectandor.setAttribute("disabled", "false");
            //

            //console.log($(selandor).disabled)
            //$(selandor).removeAttr("disabled");
            //disRow = 0;
        }
        // console.log("RowCount" + RowIndex);

        if (rowCount != 2) {

            // alert("Row Count is" + (RowIndex));


            if (typeof (h) == "object") {
                //alert(h.rowIndex);
                $(h).closest("tr").remove();

                //rowCount = $('#users tr').length;
                //visibleRows = $("#users tr:visible").length;
                //if ((visibleRows - 1) > 1) {


                $("#users tr:last:visible").find("select:last").each(function () {
                    // nth - last - child(2)
                    var idselect = this.id;
                    console.log("#select-andor prev id" + idselect);
                    $("#" + this.id).val(" ");
                });
                //}
                //var count_idPrev = h.count_id - 1;
                //$("#select-andor" + count_idPrev).val(" ");
                //console.log("#select-andor prev id" + count_idPrev);

            } else {
                return false;
            }
        }
        else {

            document.getElementById("select-value" + h.count_id).value = "";
            $("#select-test" + h.count_id).val(" ");
            $("#select-field" + h.count_id).val(" ");
            $("#select-andor" + h.count_id).val(" ");
            $("#redx_" + h.count_id).hide();
            $("#new_" + h.count_id).show('slow');
            $("#greencheck_" + h.count_id).hide();

        }
    }
    else {

        //console.log("Flag value" + flag);
        var defValue = document.getElementById("select-value" + h.count_id).defaultValue;
        var defField = document.getElementById("select-field" + h.count_id).defaultValue;
        var defTest = document.getElementById("select-test" + h.count_id).defaultValue;
        var defandor = document.getElementById("select-andor" + h.count_id).defaultValue;
        // var defimage = document.getElementById("select")

        visibleRows = $("#users tr:visible").length;

        if (defValue != null && defField != null && defTest != null) {
            if (visibleRows > 2) {
                $(h).closest("tr").hide();
                var idselect;
                $("#users tr:last:visible").find("select:last").each(function () {
                    idselect = this.id;
                    console.log("lastSelectand  id", idselect);
                    //$("#select-andor" + idselect).val(" ");
                });
                $("#" + idselect).val(" ");

                // $("#" + idselect).css(" ");

                $('#' + idselect).prop('disabled', false);
            }
            else {

                //document.getElementById("select-value" + h.count_id).value;
                $('#users').find('input, select').each(function () {
                    firstVisRowValues = this.value;
                    this.value = "";
                });
                //  console.log("The last visble count id that makes converts to new img !", h.count_id);
                lastCountId = h.count_id;

                $("#redx_" + h.count_id).hide();
                $("#new_" + h.count_id).show('slow');
                $("#greencheck_" + h.count_id).hide();

                //console.log("First Row values" + firstVisRowValues);
            }
        }
        else {
            if (visibleRows !== 2) {

                $(h).closest("tr").remove();
                $("#users tr:last:visible").find("select:last").each(function () {
                    // nth - last - child(2)
                    var idselect = this.id;
                    $("#" + this.id).val(" ");
                    //  console.log("the id here" + this.id);
                });
            }
            else {
                //In this situation the img should have been redx since not all the values were filled in.
                //Not written code when some of the values are null and some not.
                $("#users tr:last:visible").find('select,input').each(function () {
                    // nth - last - child(2)
                    var idselect = this.id;
                    $("#" + this.id).val(" ");
                    console.log("the when not all values were filled in" + this.id);
                });

                // console.log("The last visble count id that makes converts to new img", h.count_id);
                lastCountId = h.count_id;
                $("#redx_" + h.count_id).hide();
                $("#new_" + h.count_id).show('slow');
                $("#greencheck_" + h.count_id).hide();

            }
        }




    }

}


var rowCount2;

function cancelaction() {

    rowCount1 = $('#users tr').length;
    // console.log("Flag"+flag);
    if (flag == 0) {

        rowCount2 = 2;

        $('#users').find('input, select').each(function () {
            this.value = " ";
        });
        if (rowCount1 > rowCount2) {

            var diff = rowCount1 - rowCount2;
            for (var r = 1; r <= diff; r++) {
                $("#users tr:last").remove();
            }
        }
        $("#new_1").show();
        $("#redx_1").hide();
        $("#greencheck_1").hide();
    }
    else {
        var g_img;
        var number;
        number = 1;
        $('#users').find('input, select').each(function () {
            this.value = this.defaultValue;
            //console.log("On Cancel "+this.defaultValue);
        });


        if (rowCount1 > rowCount2) {

            var diff = rowCount1 - rowCount2;
            for (var r = 1; r <= diff; r++) {
                $("#users tr:last").remove();
            }
        }

        //var numOfVisibleRows = $('#users tr:visible').length;
        //var numOfVisibleRows = $('#users tr').filter(function () {
        //    return $(this).css('display')== 'none';
        //}).length;
        $('#users tr').filter(function () {
            if ($(this).css('display') == 'none') {
                $(this).css('display', '');
                //$(this).removeAttr("display");
            }
        });

        // console.log("Countid now" + lastCountId);
        $("#new_" + lastCountId).hide();
        $("#redx_" + lastCountId).hide();
        $("#greencheck_" + lastCountId).show();
        //if (numOfVisibleRows > 0)
        //{
        //    $('#users').find('tr').each(function () {
        //        if ($(this).css('display') == 'none') {
        //            $(this).css('display','');
        //     }

        //    }
        //}
        //console.log("No. of visible rows" + numOfVisibleRows);
        // console.log("Actual rows" + rowCount1);

        //$('#users tr').each(function () {
        //    //if (this.css('display') == 'none')
        //    console.log("Display");
        //    console.log($(this).css('display'));
        //   // this.value = this.defaultValue;
        //    //console.log("On Cancel "+this.defaultValue);
        //});
    }
    divforconfig.style.display = "none";
}




var rowvalues;
var rowCount1;

function okaction() {
    flag = 1;
    $("#users tr:hidden").remove();
    rowCount2 = $('#users tr').length;
    var idimg;
    var redxExist;
    var newExist;
    redxExist = false;
    newExist = false;
    $("#users tr").find('img:visible').each(function () {
        //return $(this).attr('src');
        idimg = this.id;
        //this.defaultValue = this.id;
        if (idimg.indexOf("redx_") > -1) {        // console.log("Found Error img");
            redxExist = true;
            //return true;
        }
    });
    $("#users tr").find('img:visible').each(function () {
        //return $(this).attr('src');
        idimg = this.id;
        //this.defaultValue = this.id;
        if (idimg.indexOf("new_") > -1) {        // console.log("Found Error img");
            newExist = true;
            //return true;
        }
    });
    //console.log("next row" + newExist);
    //console.log(redxExist);

    if (redxExist) {

        alert("One or more rows are invalid.Correct these errors and try again.");

    }
    else {
        if (rowCount2 >= 3) {

            if (newExist) {

                $("#users tr").find('img:visible').each(function () {
                    //return $(this).attr('src');
                    idimg = this.id;
                    //this.defaultValue = this.id;
                    if (idimg.indexOf("new_") > -1) {        // console.log("Found Error img");
                        newExist = true;
                        idimg = "#" + idimg;
                        $(idimg).closest('tr').remove();

                        $("#users tr:last:visible").find("select:last").each(function () {
                            // nth - last - child(2)
                            var idselect = this.id;
                            $("#" + this.id).val(" ");
                        });

                        divforconfig.style.display = "none";
                        //return true;
                    }
                });

                //alert("One or more rows are invalid.Correct these errors and try again.");
            }

            else {

                // $("#users tr:hidden").remove();

                $('#users').find('input, select').each(function () {

                    //rowvalues = this.value;
                    this.defaultValue = this.value;
                    rowvalues = this.defaultValue;
                    //console.log("Default values "+rowvalues);
                });
                $('#users').find('img').each(function () {

                    //rowvalues = this.value;
                    this.defaultValue = this.id;
                    rowvalues = this.defaultValue;
                    console.log("Default values for images  " + rowvalues);
                });

                $("#users").prop("defaultValue", rowCount2);
                rowCount2 = document.getElementById("users").defaultValue;
                divforconfig.style.display = "none";
            }
        }
        else {


            $('#users').find('input, select').each(function () {

                //rowvalues = this.value;
                this.defaultValue = this.value;
                rowvalues = this.defaultValue;
                //console.log("Default values "+rowvalues);
            });
            $('#users').find('img').each(function () {

                //rowvalues = this.value;
                this.defaultValue = this.id;
                rowvalues = this.defaultValue;
                console.log("Default values for images first row  " + rowvalues);
            });

            $("#users").prop("defaultValue", rowCount2);
            rowCount2 = document.getElementById("users").defaultValue;
            divforconfig.style.display = "none";
            rowCount = $('#users tr').length;
            rowvalues = document.getElementById("");
        }
    }
    //console.log("okbutton rowCount",rowCount2);
}

function addDataToElements() {

    //conFlag++;

    //    if (conFlag == 1) {


    //        // $("#config").click(function () {

    //        divforconfig.style.display = "block";
    //        divforconfig.setAttribute("style", "z-index: 1505; display: block; width: 632px; height: 236px; left: 323px; top: 189px;");


    //        //change to id and chk when there are multiple id for each row. set counters.
    //        //getProjectFields();for customefields alone.

    //        // getProjectSiteUrl('c2dc4e45-bb0f-e711-80cd-00155d408d01');//get all fields custom and built -in project fields from Project Data


    var optnullfield = document.createElement("option");
    var ont1 = document.createTextNode(" ");
    optnullfield.appendChild(ont1);
    selectfield.appendChild(optnullfield);

    getProjectSiteUrl();
    var optnulltest = document.createElement("option");
    var ont = document.createTextNode(" ");
    optnulltest.appendChild(ont);
    selecttest.appendChild(optnulltest);

    opt = document.createElement("option");
    t = document.createTextNode("equals");
    opt.appendChild(t);
    selecttest.appendChild(opt);

    var opt1 = document.createElement("option");
    var t1 = document.createTextNode(" ");
    opt1.appendChild(t1);
    selectandor.appendChild(opt1);

    var opt3 = document.createElement("option");
    var t3 = document.createTextNode("Or");
    opt3.appendChild(t3);
    selectandor.appendChild(opt3);

    var opt2 = document.createElement("option");
    var t2 = document.createTextNode("And");
    opt2.appendChild(t2);
    selectandor.appendChild(opt2);

    //        //$("#test").change(function () {
    //        //    alert("Element Changed");
    //        //});
    //        //});    
    //    }
}
function AndOrChoosable() {

    // rowCount = $('#users tr').length ;
    // visibleRows = $("#users tr:visible").length;
    // console.log("onclick of table rowCount ", rowCount-1);
    // console.log("onclick of table visibleRows", visibleRows - 1);


    //// var count_idPrev = ;
    // if ((visibleRows-1) > 1) {


    //$("#users tr:nth-last-child(2):visible").find("select:last").each(function () {
    // nth - last - child(2)

    //$("#users tr:last:visible").find("select:last").each(function () {           
    //var idselect = this.id;
    //$("#" + this.id).val(" ");



    //         //this.defaultValue = this.id;
    //         //if (idselect.indexOf("select-andor") > -1) {        // console.log("Found Error img");
    //         //console.log(this.id);

    //         // $("#"+this.id).val(" ");
    //         //divforconfig.style.display = "none";
    //         //return true;
    //         //}
    //});
    // }

    //for all 4th row to be inactive
    //if (visibleRows < 5)
    //{
    //    $("#users tr:last:visible").find("select:last").each(function () {
    //        // nth - last - child(2)
    //        var idselect = this.id;


    //}



}