import { PieChart, Pie, Cell } from "recharts";
import { motion } from "framer-motion";

interface GaugeChartProps {
  value: number;
  label?: string;
}

const GaugeChart = ({ value, label = "Win Probability" }: GaugeChartProps) => {
  const data = [
    { value: value },
    { value: 100 - value },
  ];
  const color = value >= 70 ? "hsl(142, 71%, 45%)" : value >= 40 ? "hsl(32, 95%, 44%)" : "hsl(0, 84%, 60%)";

  return (
    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6, type: "spring" }} className="flex flex-col items-center">
      <div className="relative">
        <PieChart width={200} height={120}>
          <Pie data={data} cx={100} cy={100} startAngle={180} endAngle={0} innerRadius={60} outerRadius={85} dataKey="value" stroke="none">
            <Cell fill={color} />
            <Cell fill="hsl(var(--muted))" />
          </Pie>
        </PieChart>
        <div className="absolute inset-0 flex items-center justify-center pt-4">
          <span className="text-3xl font-bold text-foreground">{value}%</span>
        </div>
      </div>
      <p className="text-sm font-medium text-muted-foreground mt-1">{label}</p>
    </motion.div>
  );
};

export default GaugeChart;
