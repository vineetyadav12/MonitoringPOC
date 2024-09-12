import { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";

const EChart = () => {
  const initialData = Array.from({ length: 500 }, (_, index) => [index, 0]);
  const [data, setData] = useState(initialData);
  const [dataPoints, setDataPoints] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:4000");

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setDataPoints((prevPoints) => [...prevPoints, data]);
    };

    return () => socket.close();
  }, []);

  // Update chart data
  const simulateECG = (index: number) => {
    const newIndex = (index + 6) % 500;
    const range =
      newIndex > index
        ? data.slice(index + 1, newIndex)
        : [...data.slice(index + 1), ...data.slice(0, newIndex)];

    const newData: any = [...data];

    for (const i of range) {
      newData[data.indexOf(i)][1] = null;
    }

    // Create a copy of the array to avoid mutating state directly

    newData[index][1] = dataPoints[0];
    setData(newData);
  };

  useEffect(() => {
    setDataPoints((prevPoints) => {
      const newPoints = [...prevPoints];
      if (newPoints.length > 100) {
        newPoints.shift(); // Maintain a window of 100 data points
      }
      return newPoints;
    });
    const interval = setInterval(() => {
      simulateECG(currentIndex);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % 500);
    }, 100);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [currentIndex]);

  const option = {
    grid: {
      left: "30px",
      right: "30px",
      top: "10px",
      bottom: "30px",
    },
    tooltip: {
      formatter: () => {
        return false;
      },
    },
    xAxis: {
      type: "value",
      show: false,
    },
    yAxis: {
      type: "value",
      show: false,
    },
    series: [
      {
        type: "line",
        smooth: true,
        data: data,
        showSymbol: false,
        lineStyle: { color: "#00ff00" },
      },
    ],
  };

  return (
    <ReactECharts option={option} style={{ height: "200px", width: "100vw" }} />
  );
};

export default EChart;
