var parameters = {};
var listenable_variable = ["value"];
/* Main Config Varibles And Options */

var config = {
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H // L,M,Q,H
}

/* Initialize URL */
const params = urlSearchData(window.location.search);
if (params) {
    var configParams = Object.keys(config);
    var urlParams = Object.keys(params);
    Object.keys(params).forEach(element => {
        parameters[element] = params[element];
        const match = configParams.some(key => key == element);
        if (match) {
            config[element] = params[element];
        }
    });
}

/* Initialize Widget */
var qrcode = new QRCode(document.getElementById("qrcode_1"), {
    width: 250,
    height: 250,
    colorDark: config.colorDark,
    colorLight: config.colorLight,
    correctLevel: QRCode.CorrectLevel.H
});

setWidget(config);
setWidgetValue(parameters.value || "Define a text or link here.");

/* Control Path Listeners */
window.addEventListener("message", function (event) {
    var data = event.data;
    switch (data.event) {
        case "GET_VARIABLE":
            listenable_variable.forEach(key => {
                let res = setVariable(data["web-widget-id"], key, data.variable);
                if (res) {
                    if (res.key == "value") {
                        parameters.value = "" + res.value;
                        setWidgetValue(parameters.value);
                    }
                }
            });
            break;
        default:
            break;
    }
});


/* Control Path Functions */
//Update a Control Path Varible Via Varible API-ID
function updateVar(apiID, value) {
    sendMessage(parameters["web-widget-id"], "update-variable", {
        apiId: apiID,
        value: value
    })
}

//Run a Control Path Actions Via API-ID
function run(type) {
    switch (type) {
        case "single":
            sendMessage(parameters["web-widget-id"], "run-single-command", {
                apiId: document.getElementById("single-command-apiID").value,
            });
            break;
        case "group":
            sendMessage(parameters["web-widget-id"], "run-group-command", {
                apiId: document.getElementById("group-command-apiID").value,
            });
            break;
        case "script":
            sendMessage(parameters["web-widget-id"], "run-script", {
                apiId: document.getElementById("script-apiID").value,
            });
            break;
        default:
            break;
    }
}


/* Widget Functions And Others */
function setWidgetValue(value) {
    qrcode.makeCode(value);
}

function setWidget(config) {
    /* Convert as expected */

    /* Others */
}