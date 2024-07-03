import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const BubbleChart = ({ coins }) => {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const width = svg.attr('width');
    const height = svg.attr('height');

    const pack = d3.pack()
      .size([width, height])
      .padding(1.5);

    const root = d3.hierarchy({ children: coins })
      .sum(d => d.market_cap)
      .sort((a, b) => b.value - a.value);

    const nodes = pack(root).leaves();

    const node = svg.selectAll('g')
      .data(nodes)
      .enter().append('g')
      .attr('transform', d => `translate(${d.x},${d.y})`);

    node.append('circle')
      .attr('id', d => d.data.id)
      .attr('r', d => d.r)
      .style('fill', d => d3.schemeCategory10[d.data.market_cap_rank % 10]);

    node.append('title')
      .text(d => `${d.data.name}\n${d.data.current_price}`);

    const simulation = d3.forceSimulation(nodes)
      .force('x', d3.forceX(width / 2).strength(0.05))
      .force('y', d3.forceY(height / 2).strength(0.05))
      .force('collide', d3.forceCollide(d => d.r + 1))
      .alphaDecay(0.02)
      .on('tick', () => {
        node.attr('transform', d => `translate(${d.x},${d.y})`);
      });

    return () => {
      simulation.stop();
    };
  }, [coins]);

  return (
    <svg ref={svgRef} width="100%" height="100%" />
  );
};

export default BubbleChart;
