export function ContrastBadge({ value }) {
  const v = parseFloat(value);
  if (v >= 7)
    return (
      <span className="text-[6px] bg-green-500 text-white px-1 py-0.5 rounded font-bold">
        AAA
      </span>
    );
  if (v >= 4.5)
    return (
      <span className="text-[6px] bg-blue-500 text-white px-1 py-0.5 rounded font-bold">
        AA
      </span>
    );
  return (
    <span className="text-[6px] bg-red-500 text-white px-1 py-0.5 rounded font-bold">
      FAIL
    </span>
  );
}
