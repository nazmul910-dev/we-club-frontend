import { Card, CardContent } from "../ui/card";

export default function StatCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
}) {
  return (
    <Card className="border-[#E9E2D2] rounded-lg bg-white">
      <CardContent className="flex items-center justify-between p-5">
        <div>
          <p className="text-sm text-gray-500">{title}</p>

          <p className="mt-1 text-2xl font-semibold text-gray-900">
            {value}
          </p>
        </div>

        <div className="rounded-lg bg-gray-50 p-2.5">
          <Icon className="h-5 w-5 text-gray-500" />
        </div>
      </CardContent>
    </Card>
  );
}