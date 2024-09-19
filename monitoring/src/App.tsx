import { useState, useEffect } from "react";
import EChart from "./components/EChart";
import Vital from "./components/Vital";
import "./App.css";

function App() {
  const [ecgData, setEcgData] = useState<any>(0);
  const [eegData, setEegData] = useState<any>(0);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:4000");

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setEcgData(data.ECG);
      setEegData(data.EEG);
    };

    return () => socket.close();
  }, []);

  return (
    <>
      <div style={{ display: "flex", width: "100vw" }}>
        <div style={{ width: "80%" }}>
          <EChart title="ECG" chartData={ecgData} />
          <EChart
            title="EEG"
            chartData={eegData}
            chartColor="red"
            points={1000}
          />
        </div>
        <div style={{ width: "20%", borderLeft: "1px solid #fff" }}>
          <Vital title={"HR"} value={ecgData} />
          <Vital title={"SPO2"} value={ecgData} />
        </div>
      </div>
    </>
  );
}

export default App;
