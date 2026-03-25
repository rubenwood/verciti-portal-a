import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { PieChart, Pie } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

export function PlatformTotalsTable(){

    const [testOrLive, setTestOrLive] = useState<string>("test");
    const [platformData, setData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const getTotals = async (testOrLive:string) => {
        setLoading(true);
        const resp = await fetch(`/api/analytics/get-platform-totals/${testOrLive}`);
        const respJson = await resp.json();
        console.log(respJson);
        setData(respJson);
        setLoading(false);
    }

    const chartData = platformData?.activityStats?.map((a: any, i: number) => ({
        name: a.activityTitle,
        value: a.totalAttempts,
        fill: `var(--chart-${(i % 5) + 1})`,
    })) || [];

    const chartConfig = {
        value: {
            label: "Attempts",
        },
        ...Object.fromEntries(
            chartData.map((item: any, i: number) => [
                item.name,
                {
                    label: item.name,
                    color: `var(--chart-${(i % 5) + 1})`,
                },
            ])
        ),
    };

    return(
        <>
            <select onChange={e => setTestOrLive(e.target.value)} defaultValue="test">
                <option value="test">test</option>
                <option value="live">live</option>
            </select>

            <Button onClick={()=>getTotals(testOrLive)}>Get Platform totals</Button>


            {platformData ? (

                <Card className="rounded-2xl">
                    <CardHeader className="items-center pb-0">
                        <CardTitle>Activity Usage</CardTitle>
                        <CardDescription>Attempts per activity</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 pb-0">
                        <ChartContainer
                            config={chartConfig}
                            className="mx-auto aspect-square max-h-[400px]"
                        >
                            <PieChart>
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent 
                                        formatter={(value, name) => [
                                            <div key={`tt-${value}-${name}`} className="flex justify-between gap-4 w-full">
                                                <span>{name}</span>
                                                <span className="font-medium">{value}</span>
                                            </div>,
                                        ""]}
                                    />}
                                />

                                <Pie
                                    data={chartData}
                                    dataKey="value"
                                    nameKey="name"
                                    innerRadius={120}
                                    outerRadius={170}
                                    paddingAngle={2}
                                    stroke="none"
                                />
                            </PieChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            ) : null}
        </>

    )
}