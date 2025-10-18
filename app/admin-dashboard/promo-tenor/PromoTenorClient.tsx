"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Loading from "@/components/shared/Loading";
import EmptyState from "@/components/shared/EmptyState";
import { getAllPromoTenors, deletePromoTenor } from "@/services/api/promo_tenor";
import { PromoTenor } from "@/types";
import { useToast } from "@/hooks/useToast-old";
import { useEffect } from "react";

export default function PromoTenorClient() {
  const [tenors, setTenors] = useState<PromoTenor[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const { push } = useToast();

  useEffect(() => {
    fetchTenors();
  }, []);

  const fetchTenors = async () => {
    setLoading(true);
    try {
      const data = await getAllPromoTenors();
      setTenors(data);
    } catch (err) {
      console.error("Failed to fetch tenors", err);
      push({ type: "error", message: "Gagal memuat data" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus tenor ini?")) return;
    try {
      await deletePromoTenor(id);
      setTenors((prev) => prev.filter((t) => t.id !== id));
      push({ type: "success", message: "Tenor berhasil dihapus" });
    } catch (err) {
      console.error("Failed to delete tenor", err);
      push({ type: "error", message: "Gagal menghapus tenor" });
    }
  };

  if (loading) return <Loading label="Memuat data..." speed={1.4} />;

  const filtered = tenors.filter((t) => {
    const term = q.trim().toLowerCase();
    if (!term) return true;
    return (
      String(t.tenor).includes(term) ||
      String(t.min_transaction).includes(term) ||
      (t.voucher_code || "").toLowerCase().includes(term)
    );
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <Input
          className="max-w-sm"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search tenor, min transaction, voucher..."
        />
        <Button onClick={() => push({ type: "info", message: "Create form coming soon" })}>
          Tambah Tenor
        </Button>
      </CardHeader>

      <CardContent>
        {filtered.length === 0 ? (
          <EmptyState title="No tenors found" description="Try adjusting your search" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((t) => (
              <div key={t.id} className="p-4 border rounded-md">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold">{t.tenor} Bulan</h4>
                    <p className="text-sm text-muted-foreground">
                      Min: Rp {t.min_transaction.toLocaleString("id-ID")}
                    </p>
                  </div>
                  <Badge variant={t.is_available ? "default" : "secondary"}>
                    {t.is_available ? "Active" : "Inactive"}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm mt-3">
                  <div>
                    <span className="text-muted-foreground">Subsidi:</span>
                    <span className="ml-1 font-medium">{t.subsidi}%</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Admin:</span>
                    <span className="ml-1 font-medium">Rp {t.admin.toLocaleString("id-ID")}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Discount:</span>
                    <span className="ml-1 font-medium">{t.discount}%</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Free:</span>
                    <span className="ml-1 font-medium">{t.free_installment}x</span>
                  </div>
                </div>

                {t.voucher_code && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Voucher: {t.voucher_code}
                  </p>
                )}

                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="ghost" size="sm" onClick={() => push({ type: "info", message: "Edit coming soon" })}>
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(t.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
