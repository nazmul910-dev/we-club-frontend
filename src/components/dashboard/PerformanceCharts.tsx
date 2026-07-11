"use client"

import { TrendingUp } from "lucide-react"

import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

export const description = "A simple area chart"

const chartData = {
  daily: [
    { label: "Mon", value: 120 },
    { label: "Tue", value: 180 },
    { label: "Wed", value: 150 },
    { label: "Thu", value: 220 },
    { label: "Fri", value: 260 },
    { label: "Sat", value: 300 },
    { label: "Sun", value: 280 },
  ],

  weekly: [
    { label: "Week 1", value: 640 },
    { label: "Week 2", value: 890 },
    { label: "Week 3", value: 760 },
    { label: "Week 4", value: 1100 },
  ],

  monthly: [
    { label: "Jan", value: 1860 },
    { label: "Feb", value: 3050 },
    { label: "Mar", value: 2370 },
    { label: "Apr", value: 730 },
    { label: "May", value: 2090 },
    { label: "Jun", value: 2140 },
  ],
};

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  }, 
} satisfies ChartConfig

export function ChartAreaDefault() {
  const [period, setPeriod] =
useState<"daily" | "weekly" | "monthly">(
"monthly"
);

const currentData = useMemo(() => {
return chartData[period];
}, [period]);

  return (
    <Card className="bg-transparent px-0">
<CardHeader className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

<div>

<CardTitle className="text-white">
Performance Overview
</CardTitle>

<CardDescription>
Showing performance statistics
</CardDescription>

</div>

<div className="flex gap-2">

{["daily","weekly","monthly"].map((item)=>(

<button

key={item}

onClick={()=>setPeriod(item as any)}

className={`rounded-lg px-4 py-2 text-sm transition

${
period===item
?

"bg-[#D6B35B] text-black"

:

"bg-neutral-900 text-white hover:bg-neutral-800"

}

`}

>

{item.charAt(0).toUpperCase()+item.slice(1)}

</button>

))}

</div>

</CardHeader>
      <CardContent className="px-0">
        <ChartContainer config={chartConfig} className="h-[250px] sm:h-[320px] lg:h-[420px] w-full" >
          <AreaChart
            accessibilityLayer
            data={currentData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <defs>

<linearGradient
id="goldGradient"
x1="0"
y1="0"
x2="0"
y2="1"
>

<stop
offset="5%"
stopColor="#D6B35B"
stopOpacity={0.65}
/>

<stop
offset="95%"
stopColor="#D6B35B"
stopOpacity={0.05}
/>

</linearGradient>

</defs>
<Area

type="monotone"

dataKey="value"

stroke="#D6B35B"

strokeWidth={3}

fill="url(#goldGradient)"

dot={false}

activeDot={{
r:5
}}

fillOpacity={1}

/>
          </AreaChart>
        </ChartContainer>
      </CardContent>
<CardFooter className="border-t border-neutral-800 mt-6 pt-6">

<div className="grid w-full grid-cols-3 gap-6">

<div>

<p className="text-xs text-neutral-500">
Total Views
</p>

<h3 className="mt-1 text-2xl font-bold text-white">
24,120
</h3>

</div>

<div>

<p className="text-xs text-neutral-500">
Growth
</p>

<h3 className="mt-1 text-2xl font-bold text-emerald-400">
+12.4%
</h3>

</div>

<div>

<p className="text-xs text-neutral-500">
Average
</p>

<h3 className="mt-1 text-2xl font-bold text-white">
804
</h3>

</div>

</div>

</CardFooter>
    </Card>
  )
}
