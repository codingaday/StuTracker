import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const ProgressBar = ({ subject, percentage }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    // Validate inputs
    if (
      !subject ||
      typeof percentage !== "number" ||
      percentage < 0 ||
      percentage > 100
    ) {
      return;
    }

    if (chartRef.current) {
      // Destroy previous chart instance if it exists
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      // Get canvas context
      const ctx = chartRef.current.getContext("2d");
      if (!ctx) {
        return;
      }

      // Create new chart
      chartInstanceRef.current = new Chart(ctx, {
        type: "bar",
        data: {
          labels: [subject],
          datasets: [
            {
              label: "Progress",
              data: [percentage],
              backgroundColor: "rgba(255, 87, 51, 0.6)", // --accent color
              borderColor: "rgba(255, 87, 51, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          indexAxis: "y", // Horizontal bar
          scales: {
            x: {
              beginAtZero: true,
              max: 100,
              ticks: {
                color: "white",
              },
              grid: {
                color: "rgba(255, 255, 255, 0.1)",
              },
            },
            y: {
              ticks: {
                color: "white",
              },
              grid: {
                display: false,
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

    // Cleanup on unmount
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [subject, percentage]);

  return (
    <div className="mb-4 w-full">
      <canvas ref={chartRef} style={{ height: "40px", width: "100%" }} />
    </div>
  );
};

export default ProgressBar;
