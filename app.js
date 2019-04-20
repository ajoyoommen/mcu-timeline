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
        maxHeight: "80vh",
        zoomMin: 1000000000,
        max: "2500",
        min: "-3000",
        showTooltips: false
    };

    var timeline = new vis.Timeline(element, [], options);
    return timeline;
}

function updateTimeline(element, element_detail, items, groups, dataset) {
    var timeline = loadTimeline(element);

    timeline.setData({
        groups: groups,
        items: new vis.DataSet(items)
    });
    timeline.fit();

    timeline.on('select', function (properties) {
        item = dataset.get_item(properties.items[0]);

//        element_detail.innerHTML = "<strong>" + item.content + "</strong><br>" +
//            item.title + "<br>" +
//            "<span class='blockquote-footer'>Source: " + item.source + "</span>";

        element_detail.innerHTML = '<div class="card">' +
              '<div class="card-body">' +
                '<h5 class="card-title">' + item.content + '</h5>' +
                '<p class="card-text">' + item.title + '</p>' +
                '<h6 class="card-subtitle mb-2 text-muted">Source:' + item.source + '</h6>' +
              '</div>' +
            '</div>'
    });

    return timeline;
}


// GET DATA, INITIALIZE AND LOAD TIMELINE
// --------------------------------------

var indicator = document.getElementById('status-spinner');
indicator.style.display = "block";

fetch('https://esm7sau4p5.execute-api.us-east-1.amazonaws.com/default/timeline').then(function (response) {
    return response.json();
}).then(function (data) {
    var dataset = new Data(data.data, data.groups)

    slice1 = dataset.slice_dataset(0, 200);
    var vis1 = document.getElementById('vis1');
    var vis1_detail = document.getElementById('vis1-detail');
    var timeline1 = updateTimeline(vis1, vis1_detail, slice1.items, slice1.groups, dataset);

//    slice2 = dataset.slice_dataset(10, 20);
//    var vis2 = document.getElementById('vis2');
//    var vis2_detail = document.getElementById('vis2-detail');
//    var timeline2 = updateTimeline(vis2, vis2_detail, slice2.items, slice2.groups, dataset);
    indicator.style.display = "none";
})