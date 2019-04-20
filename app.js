// Classes

class Data {
    constructor (items, groups) {
        this.items = this.clean_items(items);
        this.groups = this.clean_groups(groups);
    }

    get_item(id) {
        var match = this.items.filter(function (i) {
            return i.id === id;
        });
        return match[0];
    }

    clean_items(items) {
        items.forEach(function (element) {
            if (element.end.trim() === "") {
                element.end = null;
            }
        });
        return items;
    }

    clean_groups(groups) {
        groups.forEach(function (element) {
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
        return groups;
    }

    slice_dataset(start, end) {
        var s_data = this.items.slice(start, end);

        var s_group_list = [];
        s_data.forEach(function (d) {
            s_group_list.push(d.group)
        });

        var s_groups = this.groups.filter(function (g) {
            return s_group_list.indexOf(g.id) >= 0
        });

        return {
            items: s_data,
            groups: s_groups
        }
    }
}


// Timeline functions

function loadTimeline(element) {
    var options = {
        zoomKey: 'ctrlKey',
//        zoomMax: 15778800000000000,
//        zoomMin: 31557600000,
//        stack: false,
        max: "2500",
        min: "-3000",
        type: 'point',
        showTooltips: false
    };

    var timeline = new vis.Timeline(element, [], options);
    return timeline;
}

function updateTimeline(timeline, dataset, groups) {
    timeline.setData({
        groups: groups,
        items: new vis.DataSet(dataset)
    });
    timeline.fit();
}


// GET DATA, INITIALIZE AND LOAD TIMELINE
// --------------------------------------

var container = document.getElementById('visualization');

var indicator = document.getElementById('span-status-indicator');
indicator.textContent = "Loading data ...";

fetch('https://esm7sau4p5.execute-api.us-east-1.amazonaws.com/default/timeline').then(function (response) {
    return response.json();
}).then(function (data) {
    timeline = loadTimeline(container);

    var dataset = new Data(data.data, data.groups)
    sliced = dataset.slice_dataset(0, 10)

    updateTimeline(timeline, sliced.items, sliced.groups);
    indicator.textContent = "";

    timeline.on('select', function (properties) {
        item = dataset.get_item(properties.items[0]);

        var item_title_element = document.getElementById('item-details');
        item_title_element.innerHTML = "<strong>" + item.content + "</strong><br>" +
            item.title + "<br>" +
            "<small>(Source: " + item.source + ")</small>";
    });
})