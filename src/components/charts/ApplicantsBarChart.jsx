import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-lg">
        <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">{label}</p>
        {payload.map((p, i) => (
          <p key={i} className="text-xs" style={{ color: p.color }}>{p.name}: {p.value}</p>
        ))}
      </div>
    );
  }
  return null;
};

export const ApplicantsBarChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={240}>
    <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }} barGap={2}>
      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
      <XAxis dataKey="job" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
      <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
      <Tooltip content={<CustomTooltip />} />
      <Legend iconType="square" iconSize={8} wrapperStyle={{ fontSize: '12px' }} />
      <Bar dataKey="applicants" name="Total" fill="#bfdbfe" radius={[4, 4, 0, 0]} />
      <Bar dataKey="shortlisted" name="Shortlisted" fill="#3b82f6" radius={[4, 4, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
);
