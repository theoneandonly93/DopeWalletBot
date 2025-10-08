import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, TimeScale } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, TimeScale);

export default function TokenChart({ chartData }){
  if (!chartData || !chartData.datasets) return null;

  const data = {
    labels: chartData.labels || chartData.datasets[0]?.data?.map((_,i)=>i) || [],
    datasets: (chartData.datasets || []).map((d, idx) => ({
      label: d.label || (idx === 0 ? 'Price' : `Series ${idx+1}`),
      data: d.data || [],
      borderColor: d.borderColor || (idx === 0 ? '#3B82F6' : '#9CA3AF'),
      backgroundColor: d.backgroundColor || 'transparent',
      tension: 0.25,
      pointRadius: 0,
    })),
  };

  const opts = {
    plugins: { legend: { display: false } },
    scales: {
      x: { display: false },
      y: { display: true, ticks: { color: '#9CA3AF' }, grid: { color: '#0b0b0d' } }
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="w-full h-52">
      <Line data={data} options={opts} />
    </div>
  );
}
