function loadTimeline(dataset, groups, element) {
    // Create a DataSet (allows two way data-binding)
    var items = new vis.DataSet(dataset);

    // Configuration for the Timeline
    var options = {
        zoomKey: 'ctrlKey',
        zoomMax: 15778800000000,
        zoomMin: 31557600000
    };

    // Create a Timeline
    var timeline = new vis.Timeline(element, items, groups, options);
}

// DOM element where the Timeline will be attached
var container = document.getElementById('visualization');

var indicator = document.getElementById('span-status-indicator');
indicator.textContent = "Loading data ...";


function process_data(dataset) {
    dataset.data.forEach(function (element) {
        //console.log(element)
        if (element.end.trim() === "") {
            element.end = null;
        }
    });

    dataset.groups.forEach(function (element) {
        if (element.visible.toLowerCase() === "false") {
            element.visible = false;
        } else {
            element.visible = true;
        }

        if (element.nestedGroups.trim() !== "") {
            element.nestedGroups = element.nestedGroups.split(',');
            element.showNested = false;
        }
    });

    return {
        data: dataset.data,
        groups: dataset.groups
    };
}

fetch('https://esm7sau4p5.execute-api.us-east-1.amazonaws.com/default/timeline').then(function (response) {
    return response.json();
}).then(function (dataset) {

    results = process_data(dataset);

    loadTimeline(results.data, results.groups, container);
    indicator.textContent = "";
})