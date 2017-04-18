var grafoMargin = {top: 10, right: 10, bottom: 1, left: 100},
    grafoWidth = 700 - grafoMargin.left - grafoMargin.right,
    grafoHeight = 700 - grafoMargin.top - grafoMargin.bottom;

var grafoSVG = d3.select("#grafo").append("svg")
    .attr("width", 400)
    .attr("height", grafoHeight + grafoMargin.top + grafoMargin.bottom)
    .attr("style", "margin-left: 300px")
  .append("g")
    .attr("transform",
          "translate(" + -90 + "," + -60 + ")");

var color = d3.scaleOrdinal(d3.schemeCategory20);

var simulation = d3.forceSimulation()
.force("link", d3.forceLink().id(function(d) { return d.id; }))
.force("charge", d3.forceManyBody())
.force("center", d3.forceCenter(grafoWidth / 2, grafoHeight / 2));

d3.json("miserables.json", function(error, graph) {
  if (error) throw error;

  var link = grafoSVG.append("g")
  .attr("class", "links")
  .selectAll("line")
  .data(graph.links)
  .enter().append("line")
     // .attr("stroke-width", function(d) { return Math.sqrt(d.value); });

     var node = grafoSVG.append("g")
     .attr("class", "nodes")
     .selectAll("circle")
     .data(graph.nodes)
     .enter().append("circle")
     .attr("r", 5)
     .attr("fill", function(d) { return color(d.group); })
     .call(d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended));

     node.append("title")
     .text(function(d) { return d.id; });

     simulation
     .nodes(graph.nodes)
     .on("tick", ticked);

     simulation.force("link")
     .links(graph.links);

     function ticked() {
      link
      .attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

      node
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });
     }
 });

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}