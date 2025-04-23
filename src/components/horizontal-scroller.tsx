import { ScrollArea } from "@/components/ui/scroll-area";

export default function HorizontalScroller({ items }: any) {
  return (
    <ScrollArea className="w-full overflow-x-auto">
      <div className="flex space-x-4 py-2">
        {items.map((item: any, index: any) => (
          <div key={index}>{item}</div>
        ))}
      </div>
    </ScrollArea>
  );
}
