import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SelectComp({
  items,
  value,
  onChange,
  disabled,
  contentClassName,
  contentStyle,
  triggerClassName,
}) {
  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className={triggerClassName || "min-w-[240px] w-[240px]"}>
        <SelectValue placeholder="Select palette type" />
      </SelectTrigger>
      <SelectContent className={contentClassName} style={contentStyle}>
        <SelectGroup>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
