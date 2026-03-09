import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2 } from "lucide-react";

export default function GraphGeneratorPage() {
  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8 w-full">
      <Card className="border-blue-100 shadow-sm bg-gradient-to-br from-blue-50/50 to-white">
        <CardHeader className="pb-4">
          <div className="p-2 bg-blue-100 rounded-lg w-fit mb-4">
            <BarChart2 className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="text-3xl font-bold">Graph Generator</CardTitle>
          <CardDescription className="text-lg">
            Import statistical collections to plot dynamic graphical properties instantly.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-500 bg-slate-50">
            [Feature interface drops here]
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
