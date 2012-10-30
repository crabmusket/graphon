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
  }
  restart();
}

function addEdge(from, to) {
  var fnode = null, tnode = null;
  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i].name == from)
      fnode = nodes[i];
    if (nodes[i].name == to)
      tnode = nodes[i];
  }
  if (!fnode) {
    fnode = {
      name: from
    };
    nodes.push(fnode);
  }
  if (!tnode) {
    tnode = {
      name: to
    };
    nodes.push(tnode);
  }
  links.push({
    source: fnode,
    target: tnode,
  });
  restart();
}

function addEdges(froms, tos) {
  for (var i = 0; i < froms.length; i++) {
    for (var j = 0; j < tos.length; j++) {
      addEdge(froms[i], tos[j]);
    }
  }
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
  var text = self.val();
  var tokens = self.val().split(" ");
  // If line is empty, nothing to do
  if (!tokens.length)
    return;
  if (event.which == 13) {
    // ENTER pressed: perform action
    if (self.val().indexOf("->") != -1) {
      var groups = text.split("->");
      for (var g = 0; g < groups.length - 1; g++) {
        addEdges(groups[g], groups[g+1]);
      }
    }
    else {
      addNode(self.val());
    }
    self.val("");
  } else {
  }
});

$('#console').focus();

$('body').click(function() {
  $('#console').focus();
});
