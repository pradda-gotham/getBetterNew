import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from 'recharts';

interface SkillsRadarProps {
  data: {
    communication: number;
    technical: number;
    problemSolving: number;
    leadership: number;
    teamwork: number;
  };
}

export function SkillsRadar({ data }: SkillsRadarProps) {
  const chartData = [
    { skill: 'Communication', value: data.communication },
    { skill: 'Technical', value: data.technical },
    { skill: 'Problem Solving', value: data.problemSolving },
    { skill: 'Leadership', value: data.leadership },
    { skill: 'Teamwork', value: data.teamwork },
  ];

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
          <PolarGrid />
          <PolarAngleAxis
            dataKey="skill"
            tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
          />
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