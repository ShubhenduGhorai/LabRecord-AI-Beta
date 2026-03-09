import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HardDrive } from "lucide-react";

export default function CloudStoragePage() {
  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8 w-full">
      <Card className="border-slate-200 shadow-sm bg-gradient-to-br from-slate-50 to-white">
        <CardHeader className="pb-4">
          <div className="p-2 bg-slate-200 rounded-lg w-fit mb-4">
            <HardDrive className="h-8 w-8 text-slate-700" />
          </div>
          <CardTitle className="text-3xl font-bold">Cloud Storage</CardTitle>
          <CardDescription className="text-lg">
            Recover previously deployed PDF archives from our vault.
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
