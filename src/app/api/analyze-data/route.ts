import { NextRequest, NextResponse } from "next/server";
import { mean, standardDeviation, linearRegression, linearRegressionLine } from "simple-statistics";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { x, y, isDemo } = body;

    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Secure route: limit anonymous compute runs unless specifically requested via demo bounds
    if (!user && !isDemo) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!x || !y || !Array.isArray(x) || !Array.isArray(y) || x.length !== y.length) {
      return NextResponse.json({ error: "Invalid data format. x and y must be arrays of equal length." }, { status: 400 });
    }

    if (x.length < 2) {
       return NextResponse.json({ error: "At least two data points are required." }, { status: 400 });
    }

    // Convert to number arrays to be safe
    const numX = x.map(Number);
    const numY = y.map(Number);

    // 1. Calculate Simple Statistics
    const yMean = mean(numY);
    const yStdDev = standardDeviation(numY);

    // 2. Perform Linear Regression
    const dataPoints = numX.map((xVal, index) => [xVal, numY[index]]);
    const regression = linearRegression(dataPoints);
    const regressionLineFunc = linearRegressionLine(regression);

    // 3. Calculate Error Percentage (Mean Absolute Percentage Error)
    let mapeSum = 0;
    let n = 0;
    for(let i = 0; i < numY.length; i++) {
       if(numY[i] !== 0) { // prevent divide by zero
          const yPredicted = regressionLineFunc(numX[i]);
          mapeSum += Math.abs((numY[i] - yPredicted) / numY[i]);
          n++;
       }
    }
    const error_percent = n > 0 ? (mapeSum / n) * 100 : 0;

    // 4. Build Response Payload
    return NextResponse.json({
      mean: Number(yMean.toFixed(4)),
      std_dev: Number(yStdDev.toFixed(4)),
      slope: Number(regression.m.toFixed(4)),
      intercept: Number(regression.b.toFixed(4)),
      error_percent: Number(error_percent.toFixed(2))
    });

  } catch (error: any) {
    console.error("Analysis Error:", error);
    return NextResponse.json({ error: "Failed to analyze data." }, { status: 500 });
  }
}
