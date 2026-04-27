import { NextResponse } from "next/server";
import { z } from "zod";

const payloadSchema = z.object({
  receipts: z.array(
    z.object({
      id: z.string(),
      merchant: z.string(),
      amount: z.number(),
      category: z.string(),
      date: z.string(),
      taxTag: z.string(),
    }),
  ),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = payloadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid receipt payload." }, { status: 400 });
  }

  const rows = ["id,merchant,amount,category,date,taxTag"];
  for (const receipt of parsed.data.receipts) {
    rows.push(
      `${receipt.id},${receipt.merchant},${receipt.amount},${receipt.category},${receipt.date},${receipt.taxTag}`,
    );
  }

  return new NextResponse(rows.join("\n"), {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=receipt-export.csv",
    },
  });
}
