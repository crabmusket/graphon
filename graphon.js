var w = $(window).width();
var h = $(window).height();

var force = d3.layout.force()
  .gravity(.05)
  .distance(100)
  .charge(-100)
  .size([w, h]);

var nodes = force.nodes(),
  links = force.links();

var vis = d3.select("body").append("svg:svg")
  .attr("width", w)
  .attr("height", h);

force.on("tick", function() {
  vis.selectAll("g.node")
    .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

  vis.selectAll("line.link")
    .attr("x1", function(d) { return d.source.x; })
    .attr("y1", function(d) { return d.source.y; })
    .attr("x2", function(d) { return d.target.x; })
    .attr("y2", function(d) { return d.target.y; });
});

function restart() {
  var link = vis.selectAll("line.link")
    .data(links, function(d) { return d.source.id + "-" + d.target.id; });

  link.enter().insert("svg:line", "g.node")
    .attr("class", "link");

  link.exit().remove();

  var node = vis.selectAll("g.node")
    .data(nodes, function(d) { return d.name;});

  var nodeEnter = node.enter().append("svg:g")
    .attr("class", "node");

  nodeEnter.append("svg:text")
    .attr("class", "nodetext")
    .attr("dx", 12)
    .attr("dy", ".35em")
    .text(function(d) { return d.name });

  node.exit().remove();

  force.start();
}

function addNode(name) {
  nodes.push({
    name: name,
  });
  if (nodes.length > 1 && false) {
    links.push({
      source: nodes[nodes.length - 1],
      target: nodes[nodes.length - 2],
    });
  }
  restart();
}

restart();

$(window).resize(function() {
  force.size([
    $(window).width(),
    $(window).height()
  ]);
  force.start();
});

$('#console').keyup(function(event) {
  var self = $(this);
  var tokens = self.val().split(" ");
  if (!tokens.length)
    return;
  if (event.which == 13) {
    switch (tokens[0]) {
      case 'n':
      case 'node':
        if (tokens.length < 2)
          break;
        for (var i = 1; i < tokens.length; i++) {
          addNode(tokens[i]);
        }
        break;
    }
    self.val("");
  } else {
  }
});

$('#console').focus();

$('body').click(function() {
  $('#console').focus();
});