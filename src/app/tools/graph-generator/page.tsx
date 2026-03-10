"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BarChart2, Play, AlertCircle, LayoutTemplate } from "lucide-react";
import Papa from "papaparse";
import { Chart as ChartJS, LinearScale, PointElement, LineElement, Tooltip, Legend, CategoryScale, BarElement } from 'chart.js';
import { Scatter, Bar, Line } from 'react-chartjs-2';

ChartJS.register(LinearScale, PointElement, LineElement, BarElement, CategoryScale, Tooltip, Legend);

export default function GraphGeneratorPage() {
  const [title, setTitle] = useState("");
  const [xAxisLabel, setXAxisLabel] = useState("");
  const [yAxisLabel, setYAxisLabel] = useState("");
  const [graphType, setGraphType] = useState<"scatter" | "line" | "bar">("scatter");
  const [rawData, setRawData] = useState("");

  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [graphData, setGraphData] = useState<any>(null);
  const chartRef = useRef<any>(null);

  const handleGenerate = async () => {
    setError(null);
    if (!rawData.trim()) {
      setError("Please provide data points.");
      return;
    }

    setIsGenerating(true);

    try {
      // Basic CSV parsing
      const parsed = Papa.parse(rawData.trim(), { header: false });
      const dataPoints = parsed.data.map((row: any) => ({
        x: row[0],
        y: Number(row[1])
      })).filter((pt) => pt.x !== undefined && !isNaN(pt.y));

      if (dataPoints.length === 0) {
        throw new Error("Could not extract valid [X, Y] data points from your input.");
      }

      const res = await fetch('/api/create-graph', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          xAxis: xAxisLabel,
          yAxis: yAxisLabel,
          dataPoints
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate graph on the server.");
      }

      setGraphData({
        title: data.graph.title,
        xAxis: data.graph.x_axis_label,
        yAxis: data.graph.y_axis_label,
        points: data.graph.data_points
      });

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const renderChart = () => {
    if (!graphData) return null;

    const data = {
      labels: graphType === "bar" || graphType === "line" ? graphData.points.map((p: any) => String(p.x)) : undefined,
      datasets: [
        {
          label: graphData.title || "Dataset",
          data: graphType === "scatter"
            ? graphData.points.map((p: any) => ({ x: Number(p.x) || p.x, y: p.y }))
            : graphData.points.map((p: any) => p.y),
          backgroundColor: 'rgb(54, 162, 235)',
          borderColor: 'rgba(54, 162, 235, 0.8)',
          borderWidth: 2,
        }
      ]
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          title: { display: true, text: graphData.xAxis }
        },
        y: {
          title: { display: true, text: graphData.yAxis }
        }
      }
    };

    switch (graphType) {
      case "bar":
        return <Bar ref={chartRef} data={data} options={options} />;
      case "line":
        return <Line ref={chartRef} data={data} options={options} />;
      case "scatter":
      default:
        return <Scatter ref={chartRef} data={data} options={options as any} />;
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8 w-full">
      <div className="flex flex-col md:flex-row gap-8">

        {/* Left Column: Form */}
        <div className="w-full md:w-1/3 space-y-6">
          <Card className="shadow-sm border-blue-100">
            <CardHeader className="bg-blue-50/50 pb-4 border-b border-blue-50">
              <div className="flex items-center gap-2 text-blue-700 font-semibold mb-1">
                <BarChart2 className="h-5 w-5" /> Configurations
              </div>
              <CardDescription>Enter graph details and datasets</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Graph Title</label>
                <Input placeholder="e.g. Velocity vs Time" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">X-Axis Label</label>
                  <Input placeholder="e.g. Time (s)" value={xAxisLabel} onChange={(e) => setXAxisLabel(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Y-Axis Label</label>
                  <Input placeholder="e.g. Velocity (m/s)" value={yAxisLabel} onChange={(e) => setYAxisLabel(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2 pt-2">
                <label className="text-sm font-medium">Graph Type</label>
                <div className="flex gap-2">
                  {(["scatter", "line", "bar"] as const).map(type => (
                    <Button
                      key={type}
                      variant={graphType === type ? "default" : "outline"}
                      size="sm"
                      onClick={() => setGraphType(type)}
                      className="flex-1 capitalize"
                    >
                      {type}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="space-y-2 pt-2">
                <label className="text-sm font-medium flex justify-between">
                  <span>Data Points (CSV format)</span>
                  <span className="text-xs text-slate-400 font-normal">X, Y per line</span>
                </label>
                <Textarea
                  placeholder="0, 0&#10;1, 9.8&#10;2, 19.6&#10;3, 29.4"
                  value={rawData}
                  onChange={(e) => setRawData(e.target.value)}
                  className="font-mono text-sm h-32"
                />
              </div>

              {error && (
                <div className="flex items-start gap-2 p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-100">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <p>{error}</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="bg-slate-50 border-t border-slate-100 pt-4">
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={handleGenerate}
                disabled={isGenerating}
              >
                {isGenerating ? "Generating..." : (
                  <>
                    <Play className="h-4 w-4 mr-2 fill-current" /> Build Graph
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Right Column: Visualization */}
        <div className="w-full md:w-2/3">
          <Card className="border-slate-200 shadow-sm h-full min-h-[500px] flex flex-col">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl flex items-center gap-2">
                <LayoutTemplate className="h-5 w-5 text-slate-400" />
                Visualization Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex items-center justify-center p-6">
              {graphData ? (
                <div className="w-full h-full min-h-[400px]">
                  {renderChart()}
                </div>
              ) : (
                <div className="text-center text-slate-400 flex flex-col items-center">
                  <BarChart2 className="h-16 w-16 mb-4 opacity-20" />
                  <p>Submit valid data to render your graph here.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
