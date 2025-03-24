import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const ProgressBar = ({ subject, percentage }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      // Destroy existing chart if it exists
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      const ctx = chartRef.current.getContext("2d");
      chartInstanceRef.current = new Chart(ctx, {
        type: "bar",
        data: {
          labels: [subject],
          datasets: [
            {
              label: "Progress",
              data: [percentage],
              backgroundColor: "var(--accent)",
              borderColor: "var(--accent)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          indexAxis: "y",
          scales: {
            x: {
              beginAtZero: true,
              max: 100,
              ticks: {
                color: "var(--text-primary)",
              },
            },
            y: {
              ticks: {
                color: "var(--text-primary)",
              },
            },
          },
          plugins: {
            legend: {
              display: false,
            },
          },
        },
      });
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [subject, percentage]);

  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold mb-2">
        {subject}: {percentage}%
      </h3>
      <canvas ref={chartRef} className="w-full h-8"></canvas>
    </div>
  );
};

export default ProgressBar;
