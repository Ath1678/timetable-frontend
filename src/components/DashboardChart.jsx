import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { day: "Mon", classes: 5 },
  { day: "Tue", classes: 7 },
  { day: "Wed", classes: 6 },
  { day: "Thu", classes: 8 },
  { day: "Fri", classes: 4 },
];

function DashboardChart() {
  return (
    <div style={styles.box}>
      <h3>Weekly Class Load</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="classes" stroke="#2563eb" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

const styles = {
  box: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    marginTop: "20px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },
};

export default DashboardChart;
