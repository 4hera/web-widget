var parameters = {};
var listenable_variable = ["index"];

/* Main Config Varibles And Options */

var config = {
    min: 0,
    max: 100,
    colorRange: "#00ff00,#ffff00,#ff0000",
    valueRange: '0,40,70',
    textColor: "white",
    textSize: '40px',
    trackColor: "white",
    trackHolderColor: "grey"
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

function getRangeColor(value) {
    var valueRange = config.valueRange.trim().split(',');
    var colorRange = config.colorRange.trim().split(',');

    if (value < +valueRange[0]) {
        return colorRange[0];
    } else if (value > +valueRange[valueRange.length - 1]) {
        return colorRange[colorRange.length - 1];
    } else {
        for (let index = 0; index < valueRange.length - 1; index++) {
            if (value > +valueRange[index] && value <= +valueRange[index + 1]) {
                return colorRange[index];
            }
        }
    }
}

function randomValue(max) {
    var value = Math.floor(Math.random() * max);
    setWidgetValue(value);
}

function setWidgetValue(value) {
    trackLabel.innerHTML = "" + value;
    trackValue.style.height = value + "%";
    trackValue.style.backgroundColor = getRangeColor(value);

    if (value > +(config.max)) {
        trackLabel.innerHTML = config.max + "+"
        trackValue.style.height = config.max + "%";
    }

    if (value < +(config.min)) {
        trackLabel.innerHTML = config.min + "-"
        trackValue.style.height = config.min + "%";
    }
}

function setWidget(config) {
    /* Convert as expected */
    config.min = +(config.min);
    config.max = +(config.max);
    /* Others */
    trackLabel.style.color = config.textColor;
    trackLabel.style.fontSize = config.textSize;
    track.style.backgroundColor = config.trackColor;
    content.style.backgroundColor = config.trackHolderColor;
}
