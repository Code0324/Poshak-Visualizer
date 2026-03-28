import { Clock } from "lucide-react";
import Link from "next/link";

/**
 * Phase 7 will build the full generation history page here.
 */
export default function HistoryPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-white to-amber-50">
      <div className="text-center space-y-4">
        <div className="inline-flex p-4 rounded-2xl bg-amber-100 mb-2">
          <Clock className="h-8 w-8 text-amber-600" />
        </div>
        <h1 className="text-2xl font-bold">Generation History</h1>
        <p className="text-muted-foreground">Coming in Phase 7 — Polish & History</p>
        <Link
          href="/"
          className="inline-block mt-4 text-sm text-rose-600 hover:underline"
        >
          ← Back to Home
        </Link>
      </div>
    </main>
  );
}
