import StatCard, { dashboardStats } from "./StatCard";


export default function StatsGrid() {
  return (
    <section className="grid gap-5 md:grid-cols-3">
      {dashboardStats.map((stat) => (
        <StatCard
          key={stat.id}
          stat={stat}
        />
      ))}
    </section>
  );
}