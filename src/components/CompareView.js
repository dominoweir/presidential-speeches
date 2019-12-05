import React from 'react';
import '../App.css';
import * as d3 from "d3";
import { Grid } from '@material-ui/core';
import Global1 from '../data/global1.json';
import Global2 from '../data/global2.json';
import Global3 from '../data/global3.json';
import Freqword from '../data/word-frequency.json';
import Numspeech from '../data/word-numspeeches.json';
import Subweight from '../data/wordsublingweight.json';

class CompareView extends React.Component {

	constructor() {
		super();
		this.numTopics = 20;
		this.width = 1000;
		this.height = 1000;
		this.margin = { top: 110, right: 75, bottom: 150, left: 50 };
	}

	componentDidMount() {
		this.createCompareView();
	}

	componentDidUpdate() {
		this.updateCompareView();
	}

	// this code runs initially when the program first starts up
	createCompareView = () => {
		// this is the <svg> element that holds our vis
		var svg = d3.select(this.refs.compareSvg);
		var margin = 20;
		var diameter = +svg.attr("width");
		svg.append("text")
			.text("")
			.attr("fill", "black")
			.attr("font-size", "20")
			.attr("class", "bubble-label")
			.attr("x", this.width / 2 + 60)
			.attr("y", 50)
			.attr("text-anchor", "middle");
		var g = svg.append("g")
			.attr("transform", "translate(" + diameter / 2 + "," + (diameter / 2 + 50) + ")")
			.attr("class", "bubble-outer-container");

		var selectedview = this.props.selection;
		var filename = "";
		var range1 = "";
		var range2 = "";

		if (selectedview === "Topic-Party-President") {
			filename = Global1;
			range1 = "hsl(27,95%,92%)";
			range2 = "hsl(327,87%,29%)";

		} else if (selectedview === "Party-Topic") {
			filename = Global2;
			range1 = "hsl(152,80%,80%)";
			range2 = "hsl(228,30%,40%)";

		} else if (selectedview === "President-Topic") {
			filename = Global3;
			range1 = "hsl(240,67%,94%)";
			range2 = "hsl(248,42%,33%)";
		} else if (selectedview === "frequency") {
			filename = Freqword;
			range1 = "hsl(27,95%,92%)";
			range2 = "hsl(26,70%,22%)";
		} else if (selectedview === "numspeeches") {
			filename = Numspeech;
			range1 = "hsl(54,95%,67%)";
			range2 = "hsl(55,21%,31%)";
		} else {
			filename = Subweight;
			range1 = "hsl(300,100%,94%)";
			range2 = "hsl(313,28%,32%)";
		}

		var colors = d3.scaleLinear()
			.domain([-1, 5])
			.range([range1, range2])
			.interpolate(d3.interpolateHcl);
		var pack = d3.pack()
			.size([diameter - margin, diameter - margin])
			.padding(2);

		var root = d3.hierarchy(filename)
			.sum(function (d) { return d.size; })
			.sort(function (a, b) { return b.value - a.value; });
		var focus = root,
			nodes = pack(root).descendants(),
			view;
		var circle = g.selectAll("circle")
			.remove()
			.exit()
			.data(nodes)
			.enter().append("circle")
			.attr("class", function (d) { return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root"; })
			.style("fill", function (d) { return d.children ? colors(d.depth) : null; })
			.on("click", function (d) {
				if (focus !== d) {
					zoom(d);
					d3.event.stopPropagation();
					svg.select(".bubble-label")
						.text(d.data.name);
				}
			});

		g.selectAll("text")
			.remove()
			.exit()
			.data(nodes)
			.enter().append("text")
			.attr("class", "label")
			.style("fill-opacity", function (d) { return d.parent === root ? 1 : 0; })
			.style("display", function (d) { return d.parent === root ? "inline" : "none"; })
			.text(function (d) { return d.data.name; });
		var node = g.selectAll("circle,text");
		svg
			.style("background", colors(-1))
			.on("click", function () { zoom(root); });
		zoomTo([root.x, root.y, root.r * 2 + margin]);
		function zoom(d) {
			var focus = d;
			var transition = d3.transition()
				.duration(d3.event.altKey ? 7500 : 750)
				.tween("zoom", function (d) {
					var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
					return function (t) { zoomTo(i(t)); };
				});
			transition.selectAll("text")
				.filter(function (d) {
					if (d === undefined) return false;
					return d.parent === focus || this.style.display === "inline";
				})
				.style("fill-opacity", function (d) { return d.parent === focus ? 1 : 0; })
				.on("start", function (d) { if (d.parent === focus) this.style.display = "inline"; })
				.on("end", function (d) { if (d.parent !== focus) this.style.display = "none"; });
		}
		function zoomTo(v) {
			var k = diameter / v[2]; view = v;
			node.attr("transform", function (d) { return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")"; });
			circle.attr("r", function (d) { return d.r * k; });
		}

	}

	// this code runs any time a change occurs
	// if your vis is static and does not respond to input (e.g. mouse click or drag) 
	// then you can probably leave this function empty
	updateCompareView = () => {
		var svg = d3.select("svg");
		var margin = 20;
		var diameter = +svg.attr("width");
		var g = svg.select(".bubble-outer-container");

		var selectedview = this.props.selection;
		var filename = "";
		var range1 = "";
		var range2 = "";

		if (selectedview === "Topic-Party-President") {
			filename = Global1;
			range1 = "hsl(27,95%,92%)";
			range2 = "hsl(327,87%,29%)";

		} else if (selectedview === "Party-Topic") {
			filename = Global2;
			range1 = "hsl(152,80%,80%)";
			range2 = "hsl(228,30%,40%)";

		} else if (selectedview === "President-Topic") {
			filename = Global3;
			range1 = "hsl(240,67%,94%)";
			range2 = "hsl(248,42%,33%)";
		} else if (selectedview === "frequency") {
			filename = Freqword;
			range1 = "hsl(27,95%,92%)";
			range2 = "hsl(26,70%,22%)";
		} else if (selectedview === "numspeeches") {
			filename = Numspeech;
			range1 = "hsl(54,95%,67%)";
			range2 = "hsl(55,21%,31%)";
		} else {
			filename = Subweight;
			range1 = "hsl(300,100%,94%)";
			range2 = "hsl(313,28%,32%)";
		}

		var colors = d3.scaleLinear()
			.domain([-1, 5])
			.range([range1, range2])
			.interpolate(d3.interpolateHcl);
		var pack = d3.pack()
			.size([diameter - margin, diameter - margin])
			.padding(2);

		var root = d3.hierarchy(filename)
			.sum(function (d) { return d.size; })
			.sort(function (a, b) { return b.value - a.value; });
		var focus = root,
			nodes = pack(root).descendants(),
			view;
		var circle = g.selectAll("circle")
			.remove()
			.exit()
			.data(nodes)
			.enter().append("circle")
			.attr("class", function (d) { return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root"; })
			.style("fill", function (d) { return d.children ? colors(d.depth) : null; })
			.on("click", function (d) {
				if (focus !== d) {
					zoom(d);
					d3.event.stopPropagation();
					svg.select(".bubble-label")
						.text(d.data.name);
				}
			});

		g.selectAll("text")
			.remove()
			.exit()
			.data(nodes)
			.enter().append("text")
			.attr("class", "label")
			.style("fill-opacity", function (d) { return d.parent === root ? 1 : 0; })
			.style("display", function (d) { return d.parent === root ? "inline" : "none"; })
			.text(function (d) { return d.data.name; });
		var node = g.selectAll("circle,text");
		svg
			.style("background", colors(-1))
			.on("click", function () { zoom(root); });
		zoomTo([root.x, root.y, root.r * 2 + margin]);
		function zoom(d) {
			var focus = d;
			var transition = d3.transition()
				.duration(d3.event.altKey ? 7500 : 750)
				.tween("zoom", function (d) {
					var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
					return function (t) { zoomTo(i(t)); };
				});
			transition.selectAll("text")
				.filter(function (d) {
					if (d === undefined) return false;
					return d.parent === focus || this.style.display === "inline";
				})
				.style("fill-opacity", function (d) { return d.parent === focus ? 1 : 0; })
				.on("start", function (d) { if (d.parent === focus) this.style.display = "inline"; })
				.on("end", function (d) { if (d.parent !== focus) this.style.display = "none"; });
		}
		function zoomTo(v) {
			var k = diameter / v[2]; view = v;
			node.attr("transform", function (d) { return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")"; });
			circle.attr("r", function (d) { return d.r * k; });
		}

	}

	render() {

		return (
			<Grid container={true} className={"compare-container"}>
				<Grid item={true} xs={12}>
					<svg ref="compareSvg"
						width={this.width + this.margin.left + this.margin.right}
						height={this.height + this.margin.top + this.margin.bottom}>
					</svg>
				</Grid>
			</Grid>
		);
	}
}

export default CompareView;
