"use client"

import { useEffect, useRef } from "react"
import * as d3 from "d3"

interface BarChartProps {
  data: { name: string; value: number }[]
}

export function BarChart({ data }: BarChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current || !data.length) return

    // Clear previous chart
    d3.select(svgRef.current).selectAll("*").remove()

    const svg = d3.select(svgRef.current)
    const width = svgRef.current.clientWidth
    const height = svgRef.current.clientHeight
    const margin = { top: 20, right: 20, bottom: 30, left: 40 }
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

    // Create color scale
    const color = d3
      .scaleOrdinal()
      .domain(data.map((d) => d.name))
      .range(["#00c853", "#2196f3"])

    // Create the chart group
    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`)

    // Add the bars
    g.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.name) || 0)
      .attr("y", (d) => y(d.value))
      .attr("width", x.bandwidth())
      .attr("height", (d) => innerHeight - y(d.value))
      .attr("fill", (d) => color(d.name) as string)
      .attr("rx", 4)
      .attr("ry", 4)

    // Add value labels
    g.selectAll(".label")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", (d) => (x(d.name) || 0) + x.bandwidth() / 2)
      .attr("y", (d) => y(d.value) - 5)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .attr("font-size", "12px")
      .text((d) => `$${d.value.toFixed(2)}`)

    // Add the x-axis
    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("fill", "white")
      .attr("font-size", "12px")

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
  }, [data])

  return <svg ref={svgRef} width="100%" height="100%" />
}
