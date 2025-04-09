"use client"

import { useEffect, useRef } from "react"
import * as d3 from "d3"

interface LineChartProps {
  data: { name: string; value: number }[]
}

export function LineChart({ data }: LineChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current || !data.length) return

    // Clear previous chart
    d3.select(svgRef.current).selectAll("*").remove()

    const svg = d3.select(svgRef.current)
    const width = svgRef.current.clientWidth
    const height = svgRef.current.clientHeight
    const margin = { top: 20, right: 20, bottom: 30, left: 60 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    // Create scales
    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.name))
      .range([0, innerWidth])
      .padding(0.3)

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value) || 0])
      .nice()
      .range([innerHeight, 0])

    // Create the chart group
    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`)

    // Add the line
    const line = d3
      .line<{ name: string; value: number }>()
      .x((d) => (x(d.name) || 0) + x.bandwidth() / 2)
      .y((d) => y(d.value))
      .curve(d3.curveMonotoneX)

    g.append("path").datum(data).attr("fill", "none").attr("stroke", "#00c853").attr("stroke-width", 3).attr("d", line)

    // Add the dots
    g.selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", (d) => (x(d.name) || 0) + x.bandwidth() / 2)
      .attr("cy", (d) => y(d.value))
      .attr("r", 5)
      .attr("fill", "#00c853")
      .attr("stroke", "white")
      .attr("stroke-width", 2)

    // Add value labels
    g.selectAll(".label")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", (d) => (x(d.name) || 0) + x.bandwidth() / 2)
      .attr("y", (d) => y(d.value) - 10)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .attr("font-size", "12px")
      .text((d) => `$${d.value.toFixed(0)}`)

    // Add the x-axis
    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("fill", "white")
      .attr("font-size", "12px")
      .attr("transform", "rotate(-45)")
      .attr("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")

    // Add the y-axis
    g.append("g")
      .call(
        d3
          .axisLeft(y)
          .ticks(5)
          .tickFormat((d) => `$${d}`),
      )
      .selectAll("text")
      .attr("fill", "white")
      .attr("font-size", "12px")

    // Style the axes
    svg.selectAll(".domain").attr("stroke", "rgba(255, 255, 255, 0.2)")
    svg.selectAll(".tick line").attr("stroke", "rgba(255, 255, 255, 0.2)")

    // Add a grid
    g.append("g")
      .attr("class", "grid")
      .call(
        d3
          .axisLeft(y)
          .ticks(5)
          .tickSize(-innerWidth)
          .tickFormat(() => ""),
      )
      .selectAll(".tick line")
      .attr("stroke", "rgba(255, 255, 255, 0.1)")

    g.selectAll(".grid .domain").remove()
  }, [data])

  return <svg ref={svgRef} width="100%" height="100%" />
}
