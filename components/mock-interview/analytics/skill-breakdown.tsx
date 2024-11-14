import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

interface SkillBreakdownProps {
  data: {
    [key: string]: number[];
  };
}

export function SkillBreakdown({ data }: SkillBreakdownProps) {
  const processedData = Object.entries(data).map(([skill, values]) => ({
    skill: skill.charAt(0).toUpperCase() + skill.slice(1),
    value: Math.round(
      values.reduce((acc, val) => acc + val, 0) / values.length
    ),
  }));

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={processedData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="skill" />
          <PolarRadiusAxis angle={30} domain={[0, 100]} />
          <Radar
            name="Skills"
            dataKey="value"
            stroke="hsl(var(--primary))"
            fill="hsl(var(--primary))"
            fillOpacity={0.2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}