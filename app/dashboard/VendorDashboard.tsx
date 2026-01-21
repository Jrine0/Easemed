"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Truck, Package, Calendar, Hash, Euro, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { QuoteForm } from "@/components/QuoteForm";
import { CsvManager } from "@/components/CsvManager";

// --- Types ---
type RequestItem = {
  id: string;
  sku: string;
  item_name: string;
  quantity: number;
  target_price: number;
  required_by: string;
  created_at: string;
  organization_name: string;
};

type Profile = {
  id: string;
  email: string | null;
  hospital_name: string | null;
  full_name: string | null;
  country: string | null;
};

type InventoryItem = {
  id: string;
  sku: string;
  item_name: string;
  stock_quantity: number;
  unit_price: number;
};

// New Type for Bids
type BidItem = {
  id: string;
  amount: number;
  delivery_date: string;
  status: "pending" | "accepted" | "rejected";
  created_at: string;
  procurement_requests: {
    item_name: string;
    organization_name: string;
    quantity: number;
  };
};

export function VendorDashboard({
  marketplace,
  profile,
}: {
  marketplace: RequestItem[];
  profile: Profile;
}) {
  const [biddingRequest, setBiddingRequest] = useState<RequestItem | null>(
    null,
  );
  const [isBidOpen, setIsBidOpen] = useState(false);

  // Inventory State
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  // Bids State
  const [myBids, setMyBids] = useState<BidItem[]>([]);

  const supabase = createClient();

  // --- Fetch Data on Mount ---
  useEffect(() => {
    const fetchVendorData = async () => {
      if (!profile.email) return;

      // 1. Get Vendor ID
      const { data: vendor } = await supabase
        .from("vendors")
        .select("id")
        .eq("email", profile.email)
        .single();

      if (vendor) {
        // 2. Fetch Inventory
        const { data: inventoryData } = await supabase
          .from("vendor_inventory")
          .select("*")
          .eq("vendor_id", vendor.id);
        if (inventoryData) setInventory(inventoryData);

        // 3. Fetch Bids (With joined Request data)
        const { data: bidsData } = await supabase
          .from("bids")
          .select(
            `
            *,
            procurement_requests (
              item_name,
              organization_name,
              quantity
            )
          `,
          )
          .eq("vendor_id", vendor.id)
          .order("created_at", { ascending: false });

        if (bidsData) setMyBids(bidsData as unknown as BidItem[]);
      }
    };
    fetchVendorData();
  }, [profile.email, supabase]);

  // --- CSV Upload Handler ---
  const handleInventoryUpload = async (data: any[]) => {
    if (!profile.email) return;

    const { data: vendor } = await supabase
      .from("vendors")
      .select("id")
      .eq("email", profile.email)
      .single();

    if (!vendor) {
      alert("Error: Vendor profile not found.");
      return;
    }

    const formattedData = data.map((item) => ({
      vendor_id: vendor.id,
      sku: item.sku,
      item_name: item.item_name,
      stock_quantity: Number(item.stock_quantity),
      unit_price: Number(item.unit_price),
    }));

    const { error } = await supabase
      .from("vendor_inventory")
      .insert(formattedData);

    if (error) {
      alert("Upload failed: " + error.message);
    } else {
      alert("Inventory uploaded successfully!");
      window.location.reload();
    }
  };

  const openBidModal = (req: RequestItem) => {
    setBiddingRequest(req);
    setIsBidOpen(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* KPI Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-indigo-50 border-indigo-100 shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-indigo-900 font-semibold mb-1">
              Market Opportunities
            </h3>
            <p className="text-3xl font-serif font-bold text-indigo-700">
              {marketplace.length}
            </p>
            <p className="text-xs text-indigo-600/80 mt-2">
              Active RFQs in {profile.country}
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Main Content Tabs */}
      <Tabs defaultValue="marketplace" className="w-full">
        <TabsList className="bg-neutral-100 p-1">
          <TabsTrigger value="marketplace">Live Marketplace</TabsTrigger>
          <TabsTrigger value="my-bids">My Active Bids</TabsTrigger>
          <TabsTrigger value="inventory">Product Catalog</TabsTrigger>
        </TabsList>

        {/* TAB 1: MARKETPLACE */}
        <TabsContent value="marketplace" className="mt-6">
          <div className="grid gap-4">
            {marketplace.length === 0 ? (
              <div className="p-12 border border-dashed border-neutral-200 rounded-xl text-center bg-neutral-50/50">
                <Truck className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                <p className="text-neutral-500">
                  No open requests currently matching your criteria.
                </p>
              </div>
            ) : (
              marketplace.map((req) => (
                <Card
                  key={req.id}
                  className="hover:border-indigo-200 transition-all duration-300 group shadow-sm hover:shadow-md"
                >
                  <CardContent className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="text-xs font-normal text-neutral-600 bg-white border-neutral-200 flex items-center gap-1"
                        >
                          <BuildingIcon className="w-3 h-3" />{" "}
                          {req.organization_name}
                        </Badge>
                        <span className="text-xs text-neutral-400">
                          • Posted{" "}
                          {new Date(req.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      <h3 className="font-bold text-xl text-neutral-900 group-hover:text-indigo-700 transition-colors">
                        {req.item_name}
                      </h3>

                      <div className="flex flex-wrap gap-4 text-sm text-neutral-600">
                        <span className="bg-neutral-100 px-2 py-1 rounded-md text-neutral-700 font-mono text-xs flex items-center border border-neutral-200">
                          <Hash className="w-3 h-3 mr-1" /> {req.sku || "N/A"}
                        </span>
                        <span className="flex items-center font-medium">
                          <Package className="w-4 h-4 mr-1.5 text-indigo-400" />{" "}
                          {req.quantity} Units
                        </span>
                        <span className="flex items-center font-medium">
                          <Euro className="w-4 h-4 mr-1.5 text-indigo-400" />{" "}
                          Target: {req.target_price}
                        </span>
                        <span className="flex items-center font-medium">
                          <Calendar className="w-4 h-4 mr-1.5 text-red-400" />{" "}
                          Due: {req.required_by}
                        </span>
                      </div>
                    </div>

                    <Dialog
                      open={isBidOpen && biddingRequest?.id === req.id}
                      onOpenChange={(open) => {
                        if (!open) setBiddingRequest(null);
                        setIsBidOpen(open);
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button
                          onClick={() => openBidModal(req)}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white shrink-0 shadow-sm"
                        >
                          Submit Quote
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-white sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle>
                            Submit Quote for {req.item_name}
                          </DialogTitle>
                        </DialogHeader>
                        {biddingRequest && (
                          <QuoteForm
                            request={biddingRequest}
                            vendorEmail={profile.email || ""}
                            onSuccess={() => setIsBidOpen(false)}
                          />
                        )}
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* TAB 2: MY BIDS (UPDATED) */}
        <TabsContent value="my-bids" className="mt-6">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-neutral-50">
                  <TableRow>
                    <TableHead>Item Name</TableHead>
                    <TableHead>Organization</TableHead>
                    <TableHead>Your Offer</TableHead>
                    <TableHead>Delivery Date</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myBids.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center p-8 text-neutral-500"
                      >
                        You haven't submitted any bids yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    myBids.map((bid) => (
                      <TableRow key={bid.id}>
                        <TableCell className="font-medium text-neutral-900">
                          {bid.procurement_requests?.item_name ||
                            "Unknown Item"}
                        </TableCell>
                        <TableCell>
                          {bid.procurement_requests?.organization_name ||
                            "Unknown Org"}
                        </TableCell>
                        <TableCell>€{bid.amount}</TableCell>
                        <TableCell>{bid.delivery_date}</TableCell>
                        <TableCell className="text-right">
                          {bid.status === "pending" && (
                            <Badge
                              variant="outline"
                              className="text-amber-600 bg-amber-50 border-amber-200"
                            >
                              Pending Review
                            </Badge>
                          )}
                          {bid.status === "accepted" && (
                            <Badge
                              variant="outline"
                              className="text-emerald-700 bg-emerald-50 border-emerald-200"
                            >
                              Accepted
                            </Badge>
                          )}
                          {bid.status === "rejected" && (
                            <Badge
                              variant="outline"
                              className="text-red-700 bg-red-50 border-red-200"
                            >
                              Rejected
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: INVENTORY */}
        <TabsContent value="inventory">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">My Product Catalog</h2>
            <CsvManager type="inventory" onUpload={handleInventoryUpload} />
          </div>

          <Card>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SKU</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventory.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center p-8 text-neutral-500"
                      >
                        No items in catalog. Upload a CSV to get started.
                      </TableCell>
                    </TableRow>
                  ) : (
                    inventory.map((i) => (
                      <TableRow key={i.id}>
                        <TableCell className="font-mono text-xs">
                          {i.sku}
                        </TableCell>
                        <TableCell className="font-medium">
                          {i.item_name}
                        </TableCell>
                        <TableCell>{i.stock_quantity}</TableCell>
                        <TableCell>€{i.unit_price}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function BuildingIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01" />
      <path d="M16 6h.01" />
      <path d="M8 10h.01" />
      <path d="M16 10h.01" />
      <path d="M8 14h.01" />
      <path d="M16 14h.01" />
    </svg>
  );
}
