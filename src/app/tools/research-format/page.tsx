import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

export default function ResearchFormattingPage() {
  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8 w-full">
      <Card className="border-purple-100 shadow-sm bg-gradient-to-br from-purple-50/50 to-white">
        <CardHeader className="pb-4">
          <div className="p-2 bg-purple-100 rounded-lg w-fit mb-4">
            <BookOpen className="h-8 w-8 text-purple-600" />
          </div>
          <CardTitle className="text-3xl font-bold">Research Formatting</CardTitle>
          <CardDescription className="text-lg">
            Align parameters with strict citation syntaxes effortlessly.
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
