// "use client";

// import { useEffect, useState } from "react";
// import { createClient } from "@/utils/supabase/client";
// import { useRouter } from "next/navigation";
// import { getSortedVendors } from "@/lib/vendors";
// import { Building2, Truck, LogOut, MapPin, UserCircle } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";

// // Import the split dashboards
// import { HospitalDashboard } from "./HospitalDashboard";
// import { VendorDashboard } from "./VendorDashboard";

// // --- Types ---
// type Profile = {
//   id: string;
//   role: string | null;
//   hospital_name: string | null;
//   full_name: string | null;
//   country: string | null;
//   address: string | null;
//   email: string | null;
// };

// type RequestItem = {
//   id: string;
//   sku: string;
//   item_name: string;
//   quantity: number;
//   target_price: number;
//   required_by: string;
//   created_at: string;
//   organization_name: string;
// };

// const formatRole = (role: string | null) => {
//   if (!role) return "Guest";
//   return role
//     .split("_")
//     .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//     .join(" ");
// };

// export default function DashboardPage() {
//   const [profile, setProfile] = useState<Profile | null>(null);
//   const [requests, setRequests] = useState<RequestItem[]>([]);
//   const [vendors, setVendors] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   // Hospital Edit State (Lifted up to manage refresh)
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [editingRequest, setEditingRequest] = useState<RequestItem | null>(
//     null,
//   );

//   const router = useRouter();
//   const supabase = createClient();

//   // 1. Fetch Data
//   useEffect(() => {
//     async function loadData() {
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();
//       if (!user) {
//         router.push("/login");
//         return;
//       }

//       const { data: profileData } = await supabase
//         .from("profiles")
//         .select("*")
//         .eq("id", user.id)
//         .single();
//       if (profileData) setProfile(profileData);

//       const { data: requestData } = await supabase
//         .from("procurement_requests")
//         .select("*")
//         .order("created_at", { ascending: false });
//       if (requestData) setRequests(requestData);

//       const vendorList = await getSortedVendors(profileData?.country);
//       setVendors(vendorList);

//       setLoading(false);
//     }
//     loadData();
//   }, [router, supabase]);

//   // 2. Handlers
//   const handleLogout = async () => {
//     await supabase.auth.signOut();
//     router.push("/login");
//   };

//   const handleDelete = async (id: string) => {
//     if (!confirm("Are you sure you want to delete this request?")) return;
//     const { error } = await supabase
//       .from("procurement_requests")
//       .delete()
//       .eq("id", id);
//     if (!error) setRequests((prev) => prev.filter((r) => r.id !== id));
//   };

//   const openEditModal = (req: RequestItem) => {
//     setEditingRequest(req);
//     setIsDialogOpen(true);
//   };

//   const openNewModal = () => {
//     setEditingRequest(null);
//     setIsDialogOpen(true);
//   };

//   const handleFormSuccess = async () => {
//     setIsDialogOpen(false);
//     const { data } = await supabase
//       .from("procurement_requests")
//       .select("*")
//       .order("created_at", { ascending: false });
//     if (data) setRequests(data);
//   };

//   if (loading)
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-white">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
//       </div>
//     );
//   if (!profile) return null;

//   const isVendor = profile.role === "vendor";

//   return (
//     <div className="min-h-screen bg-white">
//       {/* GLOBAL NAVIGATION */}
//       <nav className="border-b border-neutral-200 bg-white sticky top-0 z-50 shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
//           <div className="flex items-center gap-2">
//             {isVendor ? (
//               <Truck className="w-6 h-6 text-indigo-600" />
//             ) : (
//               <Building2 className="w-6 h-6 text-teal-600" />
//             )}
//             <span className="font-serif text-xl font-bold tracking-tight text-neutral-900">
//               Easemed
//             </span>
//           </div>
//           <div className="flex items-center gap-6">
//             <div className="text-right hidden sm:block">
//               <div className="text-sm font-bold text-neutral-900 leading-tight">
//                 {profile.hospital_name || "Organization"}
//               </div>
//               <div className="text-xs text-neutral-500 font-medium mt-0.5 flex items-center justify-end gap-1">
//                 <span>{profile.full_name}</span>
//                 <span className="w-1 h-1 rounded-full bg-neutral-300"></span>
//                 <span className="text-teal-700 font-semibold">
//                   {formatRole(profile.role)}
//                 </span>
//               </div>
//             </div>
//             <div className="h-8 w-px bg-neutral-200 hidden sm:block"></div>
//             <Button
//               onClick={handleLogout}
//               variant="ghost"
//               size="sm"
//               className="text-neutral-500 hover:text-red-600 hover:bg-red-50"
//             >
//               <LogOut className="w-4 h-4 mr-2" /> Logout
//             </Button>
//           </div>
//         </div>
//       </nav>

//       <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
//         {/* SHARED HEADER */}
//         <div className="mb-10 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
//           <div>
//             <h1 className="font-serif text-3xl font-bold text-neutral-900 tracking-tight">
//               {isVendor ? "Supplier Portal" : "Procurement Dashboard"}
//             </h1>
//             <div className="flex items-center gap-2 mt-2 text-neutral-500">
//               <UserCircle className="w-4 h-4" />
//               <p>Welcome back, {profile.full_name}</p>
//             </div>
//           </div>
//           {profile.country && (
//             <div className="flex flex-col items-end gap-1">
//               <Badge
//                 variant="outline"
//                 className="py-1.5 px-3 border-neutral-200 bg-white shadow-sm flex gap-2"
//               >
//                 <MapPin className="w-3.5 h-3.5 text-teal-600" />
//                 <span className="text-neutral-700 font-medium">
//                   {profile.country} Market
//                 </span>
//               </Badge>
//             </div>
//           )}
//         </div>

//         {/* CONDITIONAL DASHBOARD RENDER */}
//         {isVendor ? (
//           <VendorDashboard marketplace={requests} profile={profile} />
//         ) : (
//           <HospitalDashboard
//             requests={requests}
//             vendors={vendors}
//             profile={profile}
//             onEdit={openEditModal}
//             onDelete={handleDelete}
//             onNew={openNewModal}
//             isDialogOpen={isDialogOpen}
//             setIsDialogOpen={setIsDialogOpen}
//             editingRequest={editingRequest}
//             onFormSuccess={handleFormSuccess}
//           />
//         )}
//       </main>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { getSortedVendors } from "@/lib/vendors";
import { Building2, Truck, LogOut, MapPin, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RFQForm } from "@/components/RFQForm";

// Import the split dashboards
import { HospitalDashboard } from "./HospitalDashboard";
import { VendorDashboard } from "./VendorDashboard";

// --- Types ---
type Profile = {
  id: string;
  role: string | null;
  hospital_name: string | null;
  full_name: string | null;
  country: string | null;
  address: string | null;
  email: string | null;
};

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

const formatRole = (role: string | null) => {
  if (!role) return "Guest";
  return role
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// --- HELPER: GET DYNAMIC TITLE ---
const getDashboardTitle = (role: string | null, isVendor: boolean) => {
  if (isVendor) return "Supplier Portal";
  if (role === "cpo") return "CPO Command Center";
  if (role === "head_of_department") return "Departmental Request Portal";
  if (role === "procurement_analyst") return "Analyst Workspace";
  return "Procurement Dashboard";
};

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Hospital Edit State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState<RequestItem | null>(
    null,
  );

  const router = useRouter();
  const supabase = createClient();

  // 1. Fetch Data
  useEffect(() => {
    async function loadData() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      // Safe fetch with maybeSingle()
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (profileData) setProfile(profileData);

      const { data: requestData } = await supabase
        .from("procurement_requests")
        .select("*")
        .order("created_at", { ascending: false });
      if (requestData) setRequests(requestData);

      const vendorList = await getSortedVendors(profileData?.country);
      setVendors(vendorList);

      setLoading(false);
    }
    loadData();
  }, [router, supabase]);

  // 2. Handlers
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this request?")) return;
    const { error } = await supabase
      .from("procurement_requests")
      .delete()
      .eq("id", id);
    if (!error) setRequests((prev) => prev.filter((r) => r.id !== id));
  };

  const openEditModal = (req: RequestItem) => {
    setEditingRequest(req);
    setIsDialogOpen(true);
  };

  // FIX: Ensure this sets state to open dialog
  const openNewModal = () => {
    setEditingRequest(null);
    setIsDialogOpen(true);
  };

  const handleFormSuccess = async () => {
    setIsDialogOpen(false);
    const { data } = await supabase
      .from("procurement_requests")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setRequests(data);
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
      </div>
    );
  if (!profile) return null;

  const isVendor = profile.role === "vendor";

  return (
    <div className="min-h-screen bg-white">
      {/* GLOBAL NAVIGATION */}
      <nav className="border-b border-neutral-200 bg-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2">
            {isVendor ? (
              <Truck className="w-6 h-6 text-indigo-600" />
            ) : (
              <Building2 className="w-6 h-6 text-teal-600" />
            )}
            <span className="font-serif text-xl font-bold tracking-tight text-neutral-900">
              Easemed
            </span>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-bold text-neutral-900 leading-tight">
                {profile.hospital_name || "Organization"}
              </div>
              <div className="text-xs text-neutral-500 font-medium mt-0.5 flex items-center justify-end gap-1">
                <span>{profile.full_name}</span>
                <span className="w-1 h-1 rounded-full bg-neutral-300"></span>
                <span className="text-teal-700 font-semibold">
                  {formatRole(profile.role)}
                </span>
              </div>
            </div>
            <div className="h-8 w-px bg-neutral-200 hidden sm:block"></div>
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="sm"
              className="text-neutral-500 hover:text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        {/* DYNAMIC HEADER */}
        <div className="mb-10 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
          <div>
            <h1 className="font-serif text-3xl font-bold text-neutral-900 tracking-tight">
              {getDashboardTitle(profile.role, isVendor)}
            </h1>
            <div className="flex items-center gap-2 mt-2 text-neutral-500">
              <UserCircle className="w-4 h-4" />
              <p>Welcome back, {profile.full_name}</p>
            </div>
          </div>
          {profile.country && (
            <div className="flex flex-col items-end gap-1">
              <Badge
                variant="outline"
                className="py-1.5 px-3 border-neutral-200 bg-white shadow-sm flex gap-2"
              >
                <MapPin className="w-3.5 h-3.5 text-teal-600" />
                <span className="text-neutral-700 font-medium">
                  {profile.country} Market
                </span>
              </Badge>
            </div>
          )}
        </div>

        {/* CONDITIONAL DASHBOARD RENDER */}
        {isVendor ? (
          <VendorDashboard marketplace={requests} profile={profile} />
        ) : (
          <>
            <HospitalDashboard
              requests={requests}
              vendors={vendors}
              profile={profile}
              // PASSING HANDLERS DOWN
              onEdit={openEditModal}
              onDelete={handleDelete}
              onNew={openNewModal}
            />

            {/* GLOBAL DIALOG CONTAINER (Controlled here to ensure it works for Analyst) */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent className="sm:max-w-[650px] bg-white">
                <DialogHeader>
                  <DialogTitle className="font-serif text-2xl">
                    {editingRequest
                      ? "Edit Procurement Request"
                      : "New Procurement Request"}
                  </DialogTitle>
                </DialogHeader>
                <RFQForm
                  hospitalName={profile.hospital_name || "Unknown"}
                  onSuccess={handleFormSuccess}
                  initialData={editingRequest}
                />
              </DialogContent>
            </Dialog>
          </>
        )}
      </main>
    </div>
  );
}
