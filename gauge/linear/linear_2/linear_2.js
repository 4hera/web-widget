var parameters = {};
var listenable_variable = ["index"];

/* Main Config Varibles And Options */

var config = {
    min: 0,
    max: 100,
    steps: 10,
    animation: false,
    border: false,
    textHidden: false,
    trackColor: "#888888",
    trackPointColor: "#f0897d",
    trackNumberColor: "#6f6f6f",
    trackHolderColor: "#cccccc",
    backgroundColor: "#fff"
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

setWidget(config);
var gauge = new LinearGauge({
    renderTo: 'linear_2',
    width: 120,
    height: 420,
    type: "linear-gauge",
    valueBox: config.textHidden,
    minValue: config.min,
    maxValue: config.max,
    majorTicks: config.ruler,
    highlights: [],
    animation: config.animation,
    animationDuration: 150,
    colorBarProgress: config.trackColor,
    colorNumbers: config.trackNumberColor,
    colorBar: config.trackHolderColor,
    colorPlate: config.backgroundColor,
    colorNeedle: config.trackPointColor,
    colorMajorTicks: config.trackNumberColor,
    borders: config.border,
    borderShadowWidth: 0
}).draw();

//Default Value Of Initializing
setWidgetValue(0);


/* Control Path Listeners */
window.addEventListener("message", function (event) {
    var data = event.data;
    switch (data.event) {
        case "GET_VARIABLE":
            listenable_variable.forEach(key => {
                let res = setVariable(data["web-widget-id"], key, data.variable);
                if (res) {
                    if (res.key == "index") {
                        parameters.index = +res.value;
                        setWidgetValue(+parameters.index);
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
function createWidgetRuler() {
    let stepSize = Math.round((config.max - config.min) / (config.steps));
    let ruler = Array.from({ length: config.steps }, (_, i) => {
        let value = config.min + (i * stepSize);
        return value > config.max ? config.max : value;
    });
    ruler.push(config.max);
    config.ruler = ruler;
}

function setWidgetValue(value) {
    gauge.value = value;
}

function setWidget(config) {
    /* Convert as expected */
    config.min = +(config.min);
    config.max = +(config.max);
    config.border = config.border == 'true' ? true : false;
    config.animation = config.animation == 'true' ? true : false;
    config.textHidden = config.textHidden == 'true' ? false : true;
    /* Others */
    createWidgetRuler();
}
