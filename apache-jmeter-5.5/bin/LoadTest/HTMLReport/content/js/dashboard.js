/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 86.66666666666667, "KoPercent": 13.333333333333334};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6833333333333333, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.63, 500, 1500, "pinterest"], "isController": false}, {"data": [0.99, 500, 1500, "djmag-0"], "isController": false}, {"data": [0.98, 500, 1500, "djmag-1"], "isController": false}, {"data": [0.925, 500, 1500, "wikipedia-0"], "isController": false}, {"data": [0.94, 500, 1500, "wikipedia-1"], "isController": false}, {"data": [0.0, 500, 1500, "imdb"], "isController": false}, {"data": [0.275, 500, 1500, "topgear"], "isController": false}, {"data": [0.325, 500, 1500, "topgear-1"], "isController": false}, {"data": [0.87, 500, 1500, "topgear-0"], "isController": false}, {"data": [0.695, 500, 1500, "wikipedia"], "isController": false}, {"data": [0.0, 500, 1500, "imdb-1"], "isController": false}, {"data": [0.985, 500, 1500, "pinterest-0"], "isController": false}, {"data": [0.985, 500, 1500, "imdb-0"], "isController": false}, {"data": [0.715, 500, 1500, "pinterest-1"], "isController": false}, {"data": [0.935, 500, 1500, "djmag"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1500, 200, 13.333333333333334, 527.7106666666665, 22, 4240, 333.5, 1245.7000000000003, 1807.95, 2992.78, 112.50281257031426, 11379.720137534689, 17.490671641791046], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["pinterest", 100, 0, 0.0, 712.6900000000003, 403, 2360, 606.0, 1073.6000000000001, 1756.9499999999941, 2358.3399999999992, 8.950147677436679, 1891.899084987246, 2.1326523762642084], "isController": false}, {"data": ["djmag-0", 100, 0, 0.0, 114.82999999999998, 43, 1126, 88.0, 138.8, 149.5999999999999, 1125.85, 9.258401999814833, 5.911634339413017, 1.0668861679474122], "isController": false}, {"data": ["djmag-1", 100, 0, 0.0, 294.9599999999999, 150, 1276, 263.0, 397.5000000000001, 492.0499999999998, 1271.4799999999977, 9.147457006952067, 826.160619340011, 1.0183692371020856], "isController": false}, {"data": ["wikipedia-0", 100, 0, 0.0, 272.66999999999985, 76, 1164, 132.0, 972.5000000000003, 1138.8999999999996, 1163.85, 9.266123054114159, 5.384124235544848, 1.1039716919940696], "isController": false}, {"data": ["wikipedia-1", 100, 0, 0.0, 409.04000000000013, 220, 1408, 361.5, 593.4000000000003, 878.3499999999997, 1407.3899999999996, 10.134792743488395, 758.2982574490726, 1.207465541704672], "isController": false}, {"data": ["imdb", 100, 100, 100.0, 444.5800000000002, 194, 2508, 309.0, 946.1000000000006, 1401.85, 2506.4899999999993, 8.722958827634335, 10.71629121598046, 1.993332388346127], "isController": false}, {"data": ["topgear", 100, 0, 0.0, 1709.6199999999997, 586, 4240, 1389.5, 3489.7000000000007, 3584.2499999999995, 4239.299999999999, 9.584052137243628, 3638.6994853064502, 2.246262219666475], "isController": false}, {"data": ["topgear-1", 100, 0, 0.0, 1366.5099999999998, 517, 3140, 1220.0, 2370.9, 2617.149999999999, 3139.0499999999997, 10.887316276537833, 4130.1075760410995, 1.2758573761567773], "isController": false}, {"data": ["topgear-0", 100, 0, 0.0, 342.0199999999999, 41, 1264, 104.0, 1137.6, 1213.3499999999997, 1263.85, 10.371292263015972, 3.2309006170918897, 1.2153858120721843], "isController": false}, {"data": ["wikipedia", 100, 0, 0.0, 682.1300000000001, 303, 2237, 520.5, 1457.5, 1567.55, 2232.7099999999978, 9.07770515613653, 684.4802446441539, 2.163046931735657], "isController": false}, {"data": ["imdb-1", 100, 100, 100.0, 342.7099999999998, 164, 2401, 241.5, 660.5000000000003, 1238.049999999997, 2399.6599999999994, 8.77963125548727, 5.7101898595259, 1.003141461808604], "isController": false}, {"data": ["pinterest-0", 100, 0, 0.0, 114.83999999999999, 39, 1335, 75.0, 122.0, 318.8999999999977, 1332.8399999999988, 9.260116677470137, 1.9051062309010094, 1.1032560885267155], "isController": false}, {"data": ["imdb-0", 100, 0, 0.0, 101.44999999999999, 22, 1115, 66.5, 109.0, 344.7499999999997, 1114.96, 9.503896597605019, 5.494440220490401, 1.085894435468542], "isController": false}, {"data": ["pinterest-1", 100, 0, 0.0, 597.4000000000001, 362, 2311, 515.0, 942.6000000000004, 1047.9499999999998, 2306.9799999999977, 9.000090000900009, 1900.6043771375212, 1.0722763477634776], "isController": false}, {"data": ["djmag", 100, 0, 0.0, 410.21, 213, 1467, 343.5, 621.0000000000002, 899.2499999999995, 1466.5699999999997, 9.074410163339383, 825.3574821347551, 2.055921052631579], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["403/Forbidden", 200, 100.0, 13.333333333333334], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1500, 200, "403/Forbidden", 200, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["imdb", 100, 100, "403/Forbidden", 100, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["imdb-1", 100, 100, "403/Forbidden", 100, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
