function loadTimeline(dataset, groups, element) {
    // Create a DataSet (allows two way data-binding)
    var items = new vis.DataSet(dataset);

    // Configuration for the Timeline
    var options = {
        width: "90%",
        zoomKey: 'ctrlKey'
    };

    // Create a Timeline
    var timeline = new vis.Timeline(element, items, groups, options);
}

// DOM element where the Timeline will be attached
var container = document.getElementById('visualization');

var indicator = document.getElementById('span-status-indicator');
indicator.textContent = "Loading data ...";

fetch('https://esm7sau4p5.execute-api.us-east-1.amazonaws.com/default/timeline').then(function (response) {
    return response.json();
}).then(function (dataset) {
    console.log(dataset.data)

    loadTimeline(dataset.data, dataset.groups, container);
    indicator.textContent = "";
})