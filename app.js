// Helper functions

function process_data(dataset) {
    dataset.data.forEach(function (element) {
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


// Timeline functions

function updateTimeline(timeline, dataset, groups) {
    timeline.setData({
        groups: groups,
        items: new vis.DataSet(dataset)
    });

    timeline.fit();
}

function loadTimeline(element) {
    var options = {
        zoomKey: 'ctrlKey',
        zoomMax: 157788000000000,
        zoomMin: 315576000,
        stack: false,
        max: "2500",
        min: "-3000"
    };

    var timeline = new vis.Timeline(element, [], options);
    return timeline;
}


var container = document.getElementById('visualization');

var indicator = document.getElementById('span-status-indicator');
indicator.textContent = "Loading data ...";

fetch('https://esm7sau4p5.execute-api.us-east-1.amazonaws.com/default/timeline').then(function (response) {
    return response.json();
}).then(function (dataset) {
    timeline = loadTimeline(container);

    results = process_data(dataset);
    items = results.data;

    updateTimeline(timeline, items, results.groups);
    indicator.textContent = "";
})