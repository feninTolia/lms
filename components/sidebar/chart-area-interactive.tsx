'use client';

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { useMemo } from 'react';

export const description = 'An interactive area chart';

// const chartData = [
//   { date: '2025-07-01', enrollments: 2 },
//   { date: '2025-07-02', enrollments: 6 },
//   { date: '2025-07-03', enrollments: 7 },
//   { date: '2025-07-04', enrollments: 2 },
//   { date: '2025-07-05', enrollments: 3 },
//   { date: '2025-07-06', enrollments: 10 },
//   { date: '2025-07-07', enrollments: 3 },
//   { date: '2025-07-09', enrollments: 3 },
//   { date: '2025-07-10', enrollments: 4 },
//   { date: '2025-07-11', enrollments: 8 },
//   { date: '2025-07-12', enrollments: 1 },
//   { date: '2025-07-13', enrollments: 9 },
//   { date: '2025-07-14', enrollments: 3 },
//   { date: '2025-07-15', enrollments: 2 },
//   { date: '2025-07-16', enrollments: 6 },
//   { date: '2025-07-19', enrollments: 1 },
//   { date: '2025-07-21', enrollments: 7 },
// ];

const chartConfig = {
  enrollments: {
    label: 'Enrollments',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig;

type Props = { data: { date: string; enrollments: number }[] };

export function ChartAreaInteractive({ data }: Props) {
  const totalEnrollmentsNumber = useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.enrollments, 0);
  }, [data]);

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Total Enrollments</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            All Enrollments for the last 30 days: {totalEnrollmentsNumber}
          </span>

          <span className="@[540px]/card:hidden">
            Last 30 days: {totalEnrollmentsNumber}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart margin={{ left: 12, right: 12 }} data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={'date'}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval="equidistantPreserveStart"
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                });
              }}
            />

            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-150px"
                  labelFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    });
                  }}
                />
              }
            />

            <Bar dataKey={'enrollments'} fill="var(--chart-1)" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
