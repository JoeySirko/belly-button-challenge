// Use the D3 library to read in samples.json from the URL

d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(function(data) {
  console.log(data);
});

// Create a dropdown menu
function buildDropdown(data) {
    let dropdownMenu = d3.select("#selDataset");
    let sampleNames = data.names;
    
    sampleNames.forEach((name) => {
      let option = dropdownMenu.append("option");
      option.text(name);
    });
}

function displayMetadata(sample, data) {
    let metadata = data.metadata.filter(meta => meta.id.toString() === sample)[0];
    
    let demographicInfo = d3.select("#sample-metadata");
    
    demographicInfo.html("");
    
    Object.entries(metadata).forEach(([key, value]) => {
      demographicInfo.append("p").text(`${key}: ${value}`).style("color", "green");
    });
}


// Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.
// Use sample_values as the values for the bar chart.
// Use otu_ids as the labels for the bar chart.
// Use otu_labels as the hovertext for the chart.

function displayBarChart(sample, data) {
    let samples = data.samples.filter(s => s.id.toString() === sample)[0];
    
    let otuIds = samples.otu_ids.slice(0, 10).map(otuId => `OTU ${otuId}`).reverse();
    let sampleValues = samples.sample_values.slice(0, 10).reverse();
    let otuLabels = samples.otu_labels.slice(0, 10).reverse();
    
    let trace = {
      x: sampleValues,
      y: otuIds,
      text: otuLabels,
      type: "bar",
      orientation: "h",
      marker: {
        color: 'green' // This will color the bars green
      }
    };
    
    let layout = {
      yaxis: {
        tickmode: "linear"
      }
    };
    
    Plotly.newPlot("bar", [trace], layout);
}

// Create a bubble chart that displays each sample.
// Use otu_ids for the x values.
// Use sample_values for the y values.
// Use sample_values for the marker size.
// Use otu_ids for the marker colors.
// Use otu_labels for the text values.

function displayBubbleChart(sample, data) {
    let samples = data.samples.filter(s => s.id.toString() === sample)[0];
    
    let otuIds = samples.otu_ids;
    let sampleValues = samples.sample_values;
    let otuLabels = samples.otu_labels;
    
    let trace = {
      x: otuIds,
      y: sampleValues,
      mode: "markers",
      marker: {
        size: sampleValues,
        color: otuIds,
        colorscale: 'Greens' 
      },
      text: otuLabels
    };
    
    let layout = {
      xaxis: {
        title: "OTU ID"
      },
      height: 600,
      width: 1000
    };
    
    Plotly.newPlot("bubble", [trace], layout);
}

// Update all the plots when a new sample is selected.
function optionChanged(sample) {
    d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(function(data) {
      displayMetadata(sample, data);
      displayBarChart(sample, data);
      displayBubbleChart(sample, data);
    });
}

function init() {
    d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(function(data) {
      buildDropdown(data);
      displayMetadata(data.names[0], data);
      displayBarChart(data.names[0], data);
      displayBubbleChart(data.names[0], data);
    });
}

// Initiate the dashboard
init();