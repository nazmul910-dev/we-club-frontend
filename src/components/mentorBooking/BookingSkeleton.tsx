
export default function BookingSkeleton() {
  return (
    <tr className="border-b">
      {Array.from({ length: 6 }).map((_, index) => (
        <td key={index} className="px-6 py-5">
          <div className="h-4 w-28 animate-pulse rounded bg-gray-100" />
        </td>
      ))}
    </tr>
  );
}