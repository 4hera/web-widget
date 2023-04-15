const urlSearchData = searchString => {
    if (!searchString) return false;
    return searchString
        .substring(1)
        .split('&')
        .reduce((result, next) => {
            let pair = next.split('=');
            result[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
            return result;
        }, {});
};

const sendMessage = (id, event, data) => {
    window.parent.postMessage({
        event: event,
        "web-widget-id": id,
        ...data
    }, "*");
};
const setVariable = (id, key, variable) => {
    const params = urlSearchData(window.location.search);
    if (params && params["web-widget-id"] == id && params.hasOwnProperty(key)) {
        var value = params[key].split(":");
        if (value[0] == "var") {
            if (variable.name == value[1]) {
                return {
                    key: key,
                    name: variable.name,
                    value: variable.default
                };
            } else {
                return null;
            }
        } else {
            return null;
        }
    } else {
        return null;
    }
};