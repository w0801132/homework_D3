// @TODO: YOUR CODE HERE!
// A STARTER CODE OF NOTHING IS BULLSHIT
// HOW'S MY PROFESSIONALISM GRADE DOING SO FAR?
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
// Create an SVG
var svg = d3.select(".scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data

d3.csv("data.csv", function(error, healthData) {

    //if (error) return console.warn(error);

    //console.log(healthData);


    // Parse Data/Cast as floats
    healthData.forEach(function(data){
        data.poverty = parseFloat(data.poverty);
        data.obesity = parseFloat(data.obesity);
    });

    // Create scale functions
    var xLinearScale = d3.scaleLinear()
        .domain([8, d3.max(healthData, d => d.poverty)])
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([20, d3.max(healthData, d => d.obesity)])
        .range([height, 0]);

    // Create axis functions
    var bottomAxis = d3. axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append Axes to the chart
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    // Create Circles
    var circlesGroup = chartGroup.selectAll("circle")
    .data(healthData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.obesity))
    .attr("r", "15")
    .attr("opacity", ".5")
    .classed("stateCircle", true);

    // Create Circle Text
    var circlesText = chartGroup.selectAll("text.stateText")
    .data(healthData)
    .enter()
    .append("text")
    .classed("stateText", true)
    .text(function(d){return d.abbr})
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.obesity));

    // Initialize tooltip
    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .html(function(d) {
            return(`${d.state}<br>Poverty: ${d.poverty}%<br>Obesity: ${d.obesity}%`);});


    // Create tooltip in the chart
    chartGroup.call(toolTip);

    // Create event listeners to display and hide tooltips
    circlesGroup.on("click", function(data){
        toolTip.show(data, event.target)
            .direction("nw");
    }).on("mouseout", function(data, index){
        toolTip.hide(data, event.target);
    });

    // Create axes labels
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("class", "aText")
        .text("Obesity (%)");

    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "aText")
        .text("Poverty (%)");

});
