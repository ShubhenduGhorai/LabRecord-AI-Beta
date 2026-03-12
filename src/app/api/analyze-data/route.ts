import { NextRequest, NextResponse } from "next/server";
import { 
  mean, 
  standardDeviation, 
  linearRegression, 
  linearRegressionLine,
  sampleCorrelation,
  rSquared
} from "simple-statistics";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { userService } from "@/services/userService";

export async function POST(req: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Server Error: Missing Supabase environment variables");
      return NextResponse.json({ error: "Configuration error. Please contact support." }, { status: 500 });
    }

    const body = await req.json().catch(() => ({}));
    const { x, y, isDemo } = body;

    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    // Secure route: limit anonymous compute runs unless specifically requested via demo bounds
    if ((authError || !user) && !isDemo) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!x || !y || !Array.isArray(x) || !Array.isArray(y) || x.length !== y.length) {
      return NextResponse.json({ error: "Invalid data format. x and y must be arrays of equal length." }, { status: 400 });
    }

    if (x.length < 2) {
      return NextResponse.json({ error: "At least two data points are required." }, { status: 400 });
    }

    // Check plan limits unless it's a demo
    if (user && !isDemo) {
      try {
        await userService.checkReportGenerationLimit(user.id);
      } catch (limitError: any) {
        return NextResponse.json({ error: limitError.message }, { status: 403 });
      }
    }

    // Convert to number arrays and filter out non-numeric values
    const numX: number[] = [];
    const numY: number[] = [];
    
    for (let i = 0; i < x.length; i++) {
        const valX = Number(x[i]);
        const valY = Number(y[i]);
        if (!isNaN(valX) && !isNaN(valY)) {
            numX.push(valX);
            numY.push(valY);
        }
    }

    if (numX.length < 2) {
        return NextResponse.json({ error: "At least two valid numeric points are required." }, { status: 400 });
    }

    // 1. Basic Stats
    const yMean = mean(numY);
    const yStdDev = standardDeviation(numY);

    // 2. Linear Regression (y = mx + b)
    const dataPoints = numX.map((xVal, index) => [xVal, numY[index]] as [number, number]);
    const regression = linearRegression(dataPoints);
    const regressionLineFunc = linearRegressionLine(regression);

    // 3. Correlation & R²
    const correlation = sampleCorrelation(numX, numY);
    const r2Value = rSquared(dataPoints, regressionLineFunc);

    // 4. Calculate MAPE and Standard Errors
    let mapeSum = 0;
    let n = 0;
    let ssError = 0;
    let ssX = 0;
    
    for (let i = 0; i < numY.length; i++) {
        const yPredicted = regressionLineFunc(numX[i]);
        const error = numY[i] - yPredicted;
        ssError += error * error;
        ssX += (numX[i] - mean(numX)) ** 2;
        
        if (numY[i] !== 0) {
            mapeSum += Math.abs(error / numY[i]);
            n++;
        }
    }
    
    const error_percent = n > 0 ? (mapeSum / n) * 100 : 0;
    
    // Standard Error of Estimate
    const s_y_x = Math.sqrt(ssError / (numX.length - 2));
    
    // Standard Error of Slope
    const se_slope = s_y_x / Math.sqrt(ssX);
    
    // 5. Build Response Payload
    return NextResponse.json({
      mean: Number(yMean.toFixed(4)),
      std_dev: Number(yStdDev.toFixed(4)),
      slope: Number(regression.m.toFixed(4)),
      intercept: Number(regression.b.toFixed(4)),
      correlation: Number(correlation.toFixed(4)),
      r_squared: Number(r2Value.toFixed(4)),
      error_percent: Number(error_percent.toFixed(2)),
      se_slope: Number(se_slope.toFixed(4)),
      equation: `y = ${regression.m.toFixed(4)}x + ${regression.b.toFixed(4)}`
    });

  } catch (error: any) {
    console.error("Server Error (Analysis API):", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
