import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const ROWS = [
  ["XS", "32", "25", "35"],
  ["S", "34", "27", "37"],
  ["M", "36", "29", "39"],
  ["L", "38", "31", "41"],
  ["XL", "40", "33", "43"],
];

// TODO: move to a Shopify metafield so each product can have its own chart.
export function SizeGuide() {
  return (
    <Dialog>
      <DialogTrigger className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
        Size Guide
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Size Guide</DialogTitle>
          <DialogDescription>Body measurements in inches.</DialogDescription>
        </DialogHeader>
        <table className="w-full type-body">
          <thead className="text-left text-muted-foreground">
            <tr>
              {["Size", "Chest", "Waist", "Hips"].map((h) => (
                <th key={h} className="py-2 font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map(([size, ...cells]) => (
              <tr key={size} className="border-t">
                <td className="py-2 font-medium">{size}</td>
                {cells.map((c, i) => (
                  <td key={i} className="py-2 text-muted-foreground">
                    {c}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </DialogContent>
    </Dialog>
  );
}
