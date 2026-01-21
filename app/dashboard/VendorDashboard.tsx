"use client";

import { useState } from "react";
import { Truck, Package, Calendar, Hash, Euro, Search } from "lucide-react";
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
import { QuoteForm } from "@/components/QuoteForm";

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
              Active RFQs available in {profile.country}
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Main Content Tabs */}
      <Tabs defaultValue="marketplace" className="w-full">
        <TabsList className="bg-neutral-100 p-1">
          <TabsTrigger value="marketplace">Live Marketplace</TabsTrigger>
          <TabsTrigger value="my-bids">My Active Bids</TabsTrigger>
          <TabsTrigger value="analytics">Performance Analytics</TabsTrigger>
        </TabsList>

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

        <TabsContent value="my-bids">
          <div className="p-12 border border-dashed border-neutral-200 rounded-xl text-center">
            <p className="text-neutral-500">
              Your bid history will appear here.
            </p>
          </div>
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
