"use client"

import { useEffect, useRef } from "react"
import * as d3 from "d3"

interface PieChartProps {
  data: { name: string; value: number }[]
}

export function PieChart({ data }: PieChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current || !data.length) return

    // Clear previous chart
    d3.select(svgRef.current).selectAll("*").remove()

    const svg = d3.select(svgRef.current)
    const width = svgRef.current.clientWidth
    const height = svgRef.current.clientHeight
    const radius = Math.min(width, height) / 2 - 40

    // Create color scale
    const color = d3
      .scaleOrdinal()
      .domain(data.map((d) => d.name))
      .range(["#00c853", "#2196f3", "#ff9800", "#f44336", "#9c27b0"])

    // Create the pie layout
    const pie = d3
      .pie<{ name: string; value: number }>()
      .sort(null)
      .value((d) => d.value)

    // Create the arc generator
    const arc = d3.arc<d3.PieArcDatum<{ name: string; value: number }>>().innerRadius(0).outerRadius(radius)

    // Create the label arc generator
    const labelArc = d3
      .arc<d3.PieArcDatum<{ name: string; value: number }>>()
      .innerRadius(radius * 0.6)
      .outerRadius(radius * 0.6)

    // Create the chart group
    const g = svg.append("g").attr("transform", `translate(${width / 2},${height / 2})`)

    // Add the pie slices
    const arcs = g.selectAll(".arc").data(pie(data)).enter().append("g").attr("class", "arc")

    arcs
      .append("path")
      .attr("d", arc)
      .attr("fill", (d) => color(d.data.name) as string)
      .attr("stroke", "rgba(0, 0, 0, 0.2)")
      .attr("stroke-width", 1)

    // Add the labels
    arcs
      .append("text")
      .attr("transform", (d) => `translate(${labelArc.centroid(d)})`)
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .attr("font-size", "12px")
      .text((d) => d.data.name)

    // Add a legend
    const legend = svg
      .append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "start")
      .selectAll("g")
      .data(data)
      .enter()
      .append("g")
      .attr("transform", (d, i) => `translate(${width - 100},${i * 20 + 20})`)

    legend
      .append("rect")
      .attr("x", 0)
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", (d) => color(d.name) as string)
      .attr("rx", 2)
      .attr("ry", 2)

    legend
      .append("text")
      .attr("x", 20)
      .attr("y", 7.5)
      .attr("dy", "0.32em")
      .attr("fill", "white")
      .text((d) => `${d.name}: $${d.value.toFixed(2)}`)
  }, [data])

  return <svg ref={svgRef} width="100%" height="100%" />
}
