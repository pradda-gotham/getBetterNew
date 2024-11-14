import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card } from "@/components/ui/card";

interface PerformanceData {
  date: string;
  score: number;
  clarity: number;
  relevance: number;
  technical: number;
}

interface PerformanceOverTimeProps {
  data: PerformanceData[];
}

export function PerformanceOverTime({ data }: PerformanceOverTimeProps) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <Card className="p-2">
                    <p className="text-sm font-medium">{label}</p>
                    {payload.map((entry) => (
                      <p
                        key={entry.name}
                        className="text-sm"
                        style={{ color: entry.color }}
                      >
                        {`${entry.name}: ${entry.value}%`}
                      </p>
                    ))}
                  </Card>
                );
              }
              return null;
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="score"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="clarity"
            stroke="#10B981"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="relevance"
            stroke="#6366F1"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="technical"
            stroke="#F59E0B"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}