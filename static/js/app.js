// Fuction creating metadata for given sample
function buildMetadata(selection) {

    // Reading json data
    d3.json("samples.json").then((sampleData) => {

        console.log(sampleData);

        // Parse and filter the data to get the sample's metadata
        var parsingData = sampleData.metadata;
        console.log("parsed data inside buildMetadata function")
        console.log(parsingData);

        var sample = parsingData.filter(item => item.id == selection);
        console.log("showing sample[0]:");
        console.log(sample[0]);

        // Specify the location of the metadata and update it
        var metadata = d3.select("#sample-metadata").html("");

        Object.entries(sample[0]).forEach(([key, value]) => {
            metadata.append("p").text(`${key}: ${value}`);
        });

        console.log("next again");
        console.log(metadata);
    });
}

// Fucntion creating charts
function buildCharts(selection) {

    // Read the json data
    d3.json("samples.json").then((sampleData) => {

        // Parse and filter the data to get the sample's
        var parsingData = sampleData.samples;
        console.log("parsed data inside buildCharts function")
        console.log(parsingData);

        var sample_Dict = parsingData.filter(item => item.id == selection)[0];
        console.log("sample_Dict")
        console.log(sample_Dict);


        var sValues = sample_Dict.sample_values; 
        var bChartValues = sValues.slice(0, 10).reverse();
        console.log("sample_values")
        console.log(bChartValues);

        var id_Values = sample_Dict.otu_ids;
        var bChartLabels = id_Values.slice(0, 10).reverse();
        console.log("otu_ids");
        console.log(bChartLabels);

        var formatted_Labels = [];
        bChartLabels.forEach((label) => {
            formatted_Labels.push("OTU " + label);
        });

        console.log("reformatted");
        console.log(formatted_Labels);

        var h_text = sample_Dict.otu_labels;
        var bCharth_text = h_text.slice(0, 10).reverse();
        console.log("otu_labels");
        console.log(bCharth_text);

        // Create bar chart

        var bChartTrace = {
            type: "bar",
            y: formatted_Labels,
            x: bChartValues,
            text: bCharth_text,
            orientation: 'h'
        };

        var bChartData = [bChartTrace];

        Plotly.newPlot("bar", bChartData);

        // Create bubble chart

        var bubChartTrace = {
            x: id_Values,
            y: sValues,
            text: h_text,
            mode: "markers",
            marker: {
                color: id_Values,
                size: sValues
            }
        };

        var bubChartData = [bubChartTrace];

        var output = {
            showlegend: false,
            height: 600,
            width: 1000,
            xaxis: {
                title: "OTU ID"
            }
        };

        Plotly.newPlot("bubble", bubChartData, output);
    });
}

// Function that will run on page load
function init() {

    // Read json data
    d3.json("samples.json").then((sampleData) => {

        // Parse and filter data to get sample names
        var parsingData = sampleData.names;
        console.log("parsed data inside init function")
        console.log(parsingData);

        // Add dropdown option for each sample
        var ddMenu = d3.select("#selDataset");

        parsingData.forEach((name) => {
            ddMenu.append("option").property("value", name).text(name);
        })

        // Build metadata and initial plots
        buildMetadata(parsingData[0]);

        buildCharts(parsingData[0]);

    });
}

function optionChanged(newSelection) {

    // Update metadata with newly selected sample
    buildMetadata(newSelection); 
    // Update charts with newly selected sample
    buildCharts(newSelection);
}

// Initialize dashboard on page load
init();