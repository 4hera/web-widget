var parameters = {};
var listenable_variable = ["index"];



document.addEventListener("DOMContentLoaded", () => {
    const params = urlSearchData(window.location.search);
    if (params) {
        Object.keys(params).forEach(element => {
            parameters[element] = params[element];
        });
    }
    document.getElementById("update-var-btn").addEventListener("click", updateVar);
    document.getElementById("variable-name").addEventListener("onchange", variableNameChange);
    document.getElementById("run-single-command-button").addEventListener("click", function() { run("single"); });
    document.getElementById("run-group-command-button").addEventListener("click", function() { run("group"); });
    document.getElementById("run-script-button").addEventListener("click", function() { run("script"); });

    function updateVar() {
        let value = document.getElementById("variable-new-value").value;
        sendMessage(parameters["web-widget-id"], "update-variable", {
            apiId: document.getElementById("variable-apiID").value,
            value: value
        })
    }

    function variableNameChange() {
        listenable_variable = [];
        listenable_variable = [...listenable_variable, document.getElementById("variable-name").value];
    }

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

    function setWidgetValue(value) {
        document.getElementById("variable-value").value = value;
    }
    window.addEventListener("message", function(event) {
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
});