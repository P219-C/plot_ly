function labelOTU_id(otu_ids){
    var labeledOTU_ids = otu_ids.map((otu_id) => `OTU ${otu_id}`);
    return labeledOTU_ids
};

function hBar(hBar_object){

    // Extracting top 10 sample values of sample BB_940
    var top10 = {sample_values: hBar_object.sample_values.slice(0,10), otu_ids: labelOTU_id(hBar_object.otu_ids.slice(0,10)), otu_labels: hBar_object.otu_labels.slice(0,10)}
    // console.log(top10)

    var trace = {
        x: top10.sample_values,
        y: top10.otu_ids,
        text: top10.otu_labels,
        type: 'bar',
        orientation: 'h'
    };

    var data = [trace];

    var layout = {
        yaxis: {autorange: 'reversed'}
    }

    Plotly.newPlot("bar", data, layout);
};

function bubble(bubble_object){

    var trace = {
        x: bubble_object.otu_ids,
        y: bubble_object.sample_values,
        text: bubble_object.otu_labels,
        mode: 'markers',
        marker: {
          size: bubble_object.sample_values,
          color: bubble_object.otu_ids
        }
      };
      
      var data = [trace];
      
      var layout = {
        showlegend: false,
        xaxis: {
            title: {
                text: 'OTU ID'
            }
        }
      };
      
      Plotly.newPlot('bubble', data, layout);
};


function buildPanel(objectPanel){
    var tbody = d3.select("tbody");
    tbody.selectAll("tr").remove()

    Object.entries(objectPanel).forEach((key) => {
        tbody.append("tr").text(`${key[0]}: ${key[1]}`);
    });
};

function gaugeChart(gaugeObject){
    var trace = [
        {
            domain: { x: [0, 1], y: [0, 1] },
            value: gaugeObject.wfreq,
            title: { text: "Belly Button Washing Frequency" },
            type: "indicator",
            mode: "gauge+number",
        }
    ];
    
    var layout = { width: 600, height: 500, margin: { t: 0, b: 0 } };
    Plotly.newPlot('gauge', trace, layout);
};


d3.json("./data/samples.json").then((samplesData)=>{
    // console.log(samplesData);

    // I.- CREATING INITIAL PLOT (BB_940)

    // Storing sample BB_940 in a new variable (sampleBB_940)
    var sampleBB_940 = samplesData.samples[0];
    // console.log(sampleBB_940)

    // 'sampleBB_940' is already sorted. No need for this step.
    // var sortedBB_940 = sampleBB_940.sample_values.sort((a, b) => {
    //     return b - a;
    // });

    // 1. Horizontal Bar Chart   
    hBar(sampleBB_940);


    // 2. Bubble chart
    bubble(sampleBB_940)

    // 3. Info Panel
    var metadataBB_940 = samplesData.metadata[0];
    buildPanel(metadataBB_940);

    gaugeChart(metadataBB_940)

    // Dropwdown menu
    // The following part was adapted from https://stackoverflow.com/questions/20780835/putting-the-country-on-drop-down-list-using-d3-via-csv-file
    var dropData = samplesData.names.map((otu_id) => {  // Creating an array of objects for the drop down menu
        // console.log(otu_id)
        return {"value": otu_id};
    });

    // console.log(dropData)
    var selectTag = d3.select("select");    // Reference to the select element
    var options = selectTag.selectAll("option") // Creating a selection of 'option' elements
                    .data(dropData)
                    .enter()
                    .append("option");

    options.text(function (d) {return `BB_${d.value}`;}) // Adding the 'value' attribute and the text content of the option element based on the data
            .attr("value", function(d){return d.value});

    // Event listener
    d3.select("#selDataset").on("change", () => {
        var selected = d3.select("#selDataset").property("value");
        // console.log(selected)

        selectedSample = samplesData.samples.forEach((sample) => {
            // console.log(sample.id)
            if (sample.id == selected) {
                hBar(sample);
                bubble(sample);
            }
        });

        selectedSample = samplesData.metadata.forEach((sample) => {
            // console.log(sample.id)
            if (sample.id == selected) {
                buildPanel(sample);
                gaugeChart(sample);
            }
        });

    });

    
});