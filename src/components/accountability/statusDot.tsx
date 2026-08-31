export default function StatusDot({ status }: { status: string }) {
  const color =
    status === "Complete"
      ? "bg-[#7BAA6E]"
      : status === "Available"
      ? "bg-[#C6A34A]"
      : "bg-[#D8D2C2]";
  return <span className={`h-1.5 w-1.5 rounded-full ${color}`} />;
}
