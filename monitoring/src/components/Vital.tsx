const Vital = ({
  title,
  value = 0,
  color = "#00ff00",
}: {
  title: string;
  value: number;
  color?: string;
}) => {
  return (
    <div style={{ display: "flex" }}>
      <h2 style={{ color: color }}>{title}</h2>
      <div style={{ fontSize: "6rem", color: color, margin: "0 auto" }}>
        {value}
      </div>
    </div>
  );
};

export default Vital;
