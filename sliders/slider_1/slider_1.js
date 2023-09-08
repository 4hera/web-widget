var parameters = {};
var listenable_variable = ["sliderValue"];

/* Main Config Varibles And Options */
var effectChange = true;
var config = {
    min: 0,
    max: 100,
    step: 1,
    colorRange: '',
    valueRange: '',
    textColor: 'white',
    textSize: '15px',
    textRotate: '0deg',
    textBackgroundColor: '#3264fe',
    textHidden: false,
    backgroundColor: 'white',
    trackColor: '#3264fe',
    trackHolderColor: '#d5d5d5'
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


/* Control Path Listeners */
window.addEventListener("message", function (event) {
    var data = event.data;
    switch (data.event) {
        case "GET_VARIABLE":
            listenable_variable.forEach(key => {
                let res = setVariable(data["web-widget-id"], key, data.variable);
                if (res) {
                    if (res.key == "sliderValue") {
                        parameters.sliderValue = +res.value;
                        setWidgetValue(+parameters.sliderValue);
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
function run(apiID, type) {
    switch (type) {
        case "single":
            sendMessage(parameters["web-widget-id"], "run-single-command", {
                apiId: apiID
            });
            break;
        case "group":
            sendMessage(parameters["web-widget-id"], "run-group-command", {
                apiId: apiID
            });
            break;
        case "script":
            sendMessage(parameters["web-widget-id"], "run-script", {
                apiId: apiID
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

    if (valueRange.length > 1 && colorRange.length > 1) {
        if (value < +valueRange[0]) {
            return colorRange[0];
        } else if (value > +valueRange[valueRange.length - 1]) {
            return colorRange[colorRange.length - 1];
        } else {
            for (let index = 0; index < valueRange.length - 1; index++) {
                if (value > +valueRange[index] && value <= +valueRange[index + 1]) {
                    return colorRange[index] || config.trackColor;
                }
            }
        }
    } else {
        return config.trackColor;
    }
}


function setWidgetValue(value) {
    if (effectChange) {
        const slider = document.getElementById("slider");
        const sliderValue = document.getElementById("slider-value");

        slider.value = value;
        valPercent = (value / config.max) * 100;

        document.getElementById("slider").style.background = `linear-gradient(to right, ` + getRangeColor(slider.value) + ` ${valPercent}%, ` + config.trackHolderColor + ` ${valPercent}%)`;
        sliderValue.textContent = value;

        if (value > +(config.max)) {
            slider.value = config.max;
            sliderValue.textContent = config.max + "+"
            document.getElementById("slider").style.background = `linear-gradient(to right, ` + getRangeColor(config.max) + ` 100%, ` + config.trackHolderColor + ` $100%)`;
        }

        if (value < +(config.min)) {
            slider.value = config.min;
            sliderValue.textContent = config.min + "-"
            document.getElementById("slider").style.background = `linear-gradient(to right, ` + getRangeColor(config.max) + ` 0%, ` + config.trackHolderColor + ` $0%)`;
        }
    }
}

function sliderChanged() {
    effectChange = false;
    const slider = document.getElementById("slider");
    const sliderValue = document.getElementById("slider-value");

    valPercent = (slider.value / config.max) * 100;
    document.getElementById("slider").style.background = `linear-gradient(to right, ` + getRangeColor(slider.value) + ` ${valPercent}%, ` + config.trackHolderColor + ` ${valPercent}%)`;
    sliderValue.textContent = slider.value;
}

function sliderValueChanged(value) {
    const slider = document.getElementById("slider");
    const sliderValue = document.getElementById("slider-value");
    valPercent = (slider.value / config.max) * 100;
    document.getElementById("slider").style.background = `linear-gradient(to right, ` + getRangeColor(slider.value) + ` ${valPercent}%, ` + config.trackHolderColor + ` ${valPercent}%)`;
    sliderValue.textContent = slider.value;
    updateVar(parameters.valueApiId, value);
    effectChange = true;
}

function setWidget(config) {
    /* Convert as expected */
    config.min = +(config.min);
    config.max = +(config.max);
    config.step = +(config.step);

    container.innerHTML = `
    <input onload="sliderLoaded()" type="range" id="slider" min="`+ config.min + `" max="` + config.max + `" step="` + config.step + `" oninput="sliderChanged()" 
    onchange="sliderValueChanged(this.value)">
    <div id="slider-value">0</div>`;

    const slider = document.getElementById("slider");
    const sliderValue = document.getElementById("slider-value");

    slider.value = +parameters.sliderValue || 0;
    container.style.backgroundColor = config.backgroundColor;
    sliderValue.textContent = +parameters.sliderValue || 0;
    valPercent = (slider.value / config.max) * 100;
    document.getElementById("slider").style.background = `linear-gradient(to right, ` + getRangeColor(slider.value) + ` ${valPercent}%, ` + config.trackHolderColor + ` ${valPercent}%)`;
    sliderValue.style.color = config.textColor;
    sliderValue.style.fontSize = config.textSize;
    sliderValue.style.rotate = config.textRotate;
    sliderValue.style.backgroundColor = config.textBackgroundColor;
    sliderValue.style.display = config.textHidden == 'true' ? 'none' : 'inline';
}