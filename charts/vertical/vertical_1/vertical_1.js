var parameters = {};
var listenable_variable = ["index"];

/* Main Config Varibles And Options */
var effectChange = true;
var config = {
	min: 0,
	max: 100,
	colorRange: "#00ff00,#ffff00,#ff0000",
	valueRange: '0,40,70',
	textColor: "black",
	textSize: '30px',
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

function setWidgetColor(value) {
	resizeable.style.backgroundColor = getRangeColor(value);
}

function setWidgetValue(value) {
	if (effectChange) {
		resizeHeightLabel.innerHTML = "" + value;
		resizeable.style.height = value + "%";
		resizeable.style.backgroundColor = getRangeColor(value);

		if (value > +(config.max)) {
			resizeable.style.backgroundColor = getRangeColor();
			resizeHeightLabel.innerHTML = config.max + "+"
			resizeable.style.height = config.max + "%";
		}

		if (value < +(config.min)) {
			resizeable.style.backgroundColor = getRangeColor();
			resizeHeightLabel.innerHTML = config.min + "-"
			resizeable.style.height = config.min + "%";
		}
	}
}

function setWidget(config) {
	/* Convert as expected */
	config.min = +(config.min);
	config.max = +(config.max);
	/* Others */
	holder.style.backgroundColor = config.holderColor;
	steps.style.color = config.stepsColor;
	resizeHeightLabel.style.color = config.textColor;
	resizeHeightLabel.style.fontSize = config.textSize;
}



/* #Dynamic Height System */
let startY, startHeight, startTop;

function startDrag(event) {
	effectChange = false;
	event.preventDefault();
	resizeable.style.transitionDuration = "0s";
	startY = event.clientY || event.touches[0].clientY;

	startHeight = parseInt(document.defaultView.getComputedStyle(resizeable).height, 10);
	startTop = parseInt(document.defaultView.getComputedStyle(resizeable).top, 10);


	document.documentElement.addEventListener('touchmove', doDrag, { passive: false });
	document.documentElement.addEventListener('touchend', stopDrag, false);

	document.documentElement.addEventListener('mousemove', doDrag, false);
	document.documentElement.addEventListener('mouseup', stopDrag, false);

}

function doDrag(event) {
	effectChange = false;

	let diff = (event.clientY || event.touches[0].clientY) - startY;
	var newValue = "" + resizeable.style.height.split("px")[0] * 100 / 320;
	console.log(diff, newValue);
	resizeable.style.height = (startHeight - diff) > 320 ? '320' : (startHeight - diff) + 'px';
	resizeHeightLabel.innerHTML = parseFloat(newValue).toFixed(2);
	setWidgetColor(newValue);
}

function stopDrag() {
	effectChange = true;
	resizeable.style.transitionDuration = "0.1s";
	var newValue = resizeable.style.height.split("px")[0] * 100 / 320;
	resizeable.style.height = newValue + "%";

	document.documentElement.removeEventListener('touchmove', doDrag);
	document.documentElement.removeEventListener('touchend', stopDrag);

	document.documentElement.removeEventListener('mousemove', doDrag, false);
	document.documentElement.removeEventListener('mouseup', stopDrag, false);
	updateVar(parameters.indexApiId, newValue);
}
