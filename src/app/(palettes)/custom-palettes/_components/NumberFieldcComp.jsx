import {
  NumberField,
  Label,
  Group,
  Input,
  Button,
} from "react-aria-components";
import { Plus, Minus } from "lucide-react";

export default function NumberFieldcComp({
  label,
  value,
  onChange,
  min,
  max,
  step,
}) {
  return (
    <NumberField
      className="bg-white text-black p-1 rounded"
      minValue={min}
      maxValue={max}
      value={value}
      onChange={onChange}
      step={step}
    >
      <Label>{label}</Label>
      <Group className="flex items-center space-x-1">
        <Button slot="decrement" className="p-1">
          <Minus size={18} />
        </Button>
        <Input className="w-16 text-center" />
        <Button slot="increment" className="p-1">
          <Plus size={18} />
        </Button>
      </Group>
    </NumberField>
  );
}
