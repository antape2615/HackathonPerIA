import { PieChart, Pie, Tooltip, Cell } from "recharts";

export default function Dashboard({ solutions }) {
  const data = [
    { name: "Corto", value: solutions?.corto_plazo?.length || 0 },
    { name: "Mediano", value: solutions?.mediano_plazo?.length || 0 },
    { name: "Largo", value: solutions?.largo_plazo?.length || 0 },
  ];
  const COLORS = ["#34D399", "#FBBF24", "#A78BFA"];
  return (
    <div className="p-4 w-full">
      <h4 className="font-semibold mb-2">Resumen por horizonte</h4>
      <PieChart width={260} height={180}>
        <Pie
          dataKey="value"
          data={data}
          cx={120}
          cy={90}
          outerRadius={70}
          label
        >
          {data.map((entry, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </div>
  );
}
