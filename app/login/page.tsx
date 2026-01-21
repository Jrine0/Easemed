// "use client";

// import { useState } from "react";
// import { createClient } from "@/utils/supabase/client";
// import { useRouter } from "next/navigation";
// import { Building2, Truck, Loader2 } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { cn } from "@/lib/utils";

// // Comprehensive list of European markets
// const EU_COUNTRIES = [
//   "Austria",
//   "Belgium",
//   "Bulgaria",
//   "Croatia",
//   "Cyprus",
//   "Czech Republic",
//   "Denmark",
//   "Estonia",
//   "Finland",
//   "France",
//   "Germany",
//   "Greece",
//   "Hungary",
//   "Ireland",
//   "Italy",
//   "Latvia",
//   "Lithuania",
//   "Luxembourg",
//   "Malta",
//   "Netherlands",
//   "Poland",
//   "Portugal",
//   "Romania",
//   "Slovakia",
//   "Slovenia",
//   "Spain",
//   "Sweden",
//   "Switzerland",
//   "United Kingdom",
// ];

// export default function LoginPage() {
//   const [isLoading, setIsLoading] = useState(false);
//   const [isSignUp, setIsSignUp] = useState(false);

//   // Auth Fields
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   // Profile Fields - ALL INITIALIZED TO EMPTY
//   const [fullName, setFullName] = useState("");
//   const [orgName, setOrgName] = useState("");
//   const [address, setAddress] = useState("");
//   const [country, setCountry] = useState<string | undefined>(undefined);
//   const [userType, setUserType] = useState<"hospital" | "vendor">("hospital");
//   const [selectedRole, setSelectedRole] = useState("");

//   const router = useRouter();
//   const supabase = createClient();

//   const handleAuth = async (e: React.FormEvent) => {
//     e.preventDefault();

//     // STRICT VALIDATION
//     if (isSignUp) {
//       if (
//         !email ||
//         !password ||
//         !fullName ||
//         !orgName ||
//         !address ||
//         !country
//       ) {
//         alert("All fields are mandatory. Please complete the form.");
//         return;
//       }
//       // Specific check for Role if user is a Hospital
//       if (userType === "hospital" && !selectedRole) {
//         alert("Please select your Job Role.");
//         return;
//       }
//     }

//     setIsLoading(true);
//     const finalRole = userType === "vendor" ? "vendor" : selectedRole;

//     try {
//       if (isSignUp) {
//         const { error } = await supabase.auth.signUp({
//           email,
//           password,
//           options: {
//             data: {
//               full_name: fullName,
//               hospital_name: orgName,
//               address: address,
//               country: country,
//               role: finalRole,
//             },
//           },
//         });
//         if (error) throw error;
//         alert(
//           "Account created successfully! Please check your email to verify.",
//         );
//       } else {
//         const { error } = await supabase.auth.signInWithPassword({
//           email,
//           password,
//         });
//         if (error) throw error;
//         router.push("/dashboard");
//         router.refresh();
//       }
//     } catch (error: any) {
//       alert(error.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Visual Theme
//   const theme = {
//     hospital: {
//       accent: "text-teal-600",
//       button: "bg-teal-600 hover:bg-teal-700 text-white",
//       tabActive:
//         "data-[state=active]:text-teal-900 data-[state=active]:border-teal-600",
//     },
//     vendor: {
//       accent: "text-indigo-600",
//       button: "bg-indigo-600 hover:bg-indigo-700 text-white",
//       tabActive:
//         "data-[state=active]:text-indigo-900 data-[state=active]:border-indigo-600",
//     },
//   };
//   const activeTheme = theme[userType];

//   return (
//     <div className="min-h-screen w-full flex items-center justify-center bg-white text-neutral-900 font-sans py-12">
//       <div className="w-full max-w-[440px] px-6">
//         {/* Header */}
//         <div className="flex flex-col items-center mb-8 space-y-4">
//           <div
//             className={cn(
//               "p-4 rounded-2xl bg-neutral-50 shadow-sm transition-colors",
//               activeTheme.accent,
//             )}
//           >
//             {userType === "hospital" ? (
//               <Building2 size={32} />
//             ) : (
//               <Truck size={32} />
//             )}
//           </div>
//           <div className="text-center">
//             <h1 className="text-3xl tracking-tight text-neutral-900 font-serif font-bold">
//               {isSignUp ? "Create Account" : "Welcome Back"}
//             </h1>
//             <p className="text-sm text-neutral-500 mt-1">
//               European Procurement Portal
//             </p>
//           </div>
//         </div>

//         {/* Tabs */}
//         <Tabs
//           defaultValue="hospital"
//           onValueChange={(v) => setUserType(v as "hospital" | "vendor")}
//           className="w-full mb-8"
//         >
//           <TabsList className="w-full bg-transparent border-b border-neutral-200 p-0 h-auto rounded-none flex gap-8 justify-center">
//             <TabsTrigger
//               value="hospital"
//               className={cn(
//                 "rounded-none border-b-2 border-transparent px-4 pb-3 pt-2 font-medium text-neutral-400 shadow-none transition-all",
//                 theme.hospital.tabActive,
//               )}
//             >
//               Hospital
//             </TabsTrigger>
//             <TabsTrigger
//               value="vendor"
//               className={cn(
//                 "rounded-none border-b-2 border-transparent px-4 pb-3 pt-2 font-medium text-neutral-400 shadow-none transition-all",
//                 theme.vendor.tabActive,
//               )}
//             >
//               Vendor
//             </TabsTrigger>
//           </TabsList>
//         </Tabs>

//         {/* Form */}
//         <form onSubmit={handleAuth} className="space-y-4">
//           {isSignUp && (
//             <div className="space-y-4 animate-in fade-in slide-in-from-top-1 duration-300">
//               {/* 1. Full Name */}
//               <div className="space-y-2">
//                 <Label htmlFor="fullname">
//                   User Full Name <span className="text-red-500">*</span>
//                 </Label>
//                 <Input
//                   id="fullname"
//                   required
//                   placeholder="e.g. Dr. Sarah Miller"
//                   value={fullName}
//                   onChange={(e) => setFullName(e.target.value)}
//                   className="bg-neutral-50 border-neutral-200"
//                   autoComplete="name"
//                 />
//               </div>

//               {/* 2. Organization Name */}
//               <div className="space-y-2">
//                 <Label htmlFor="orgname">
//                   {userType === "hospital" ? "Hospital Name" : "Company Name"}{" "}
//                   <span className="text-red-500">*</span>
//                 </Label>
//                 <Input
//                   id="orgname"
//                   required
//                   placeholder={
//                     userType === "hospital"
//                       ? "e.g. Charité Berlin"
//                       : "e.g. Bayer AG"
//                   }
//                   value={orgName}
//                   onChange={(e) => setOrgName(e.target.value)}
//                   className="bg-neutral-50 border-neutral-200"
//                   autoComplete="organization"
//                 />
//               </div>

//               {/* 3. Address */}
//               <div className="space-y-2">
//                 <Label htmlFor="address">
//                   Full Address <span className="text-red-500">*</span>
//                 </Label>
//                 <Input
//                   id="address"
//                   required
//                   placeholder="e.g. Charitéplatz 1, 10117 Berlin"
//                   value={address}
//                   onChange={(e) => setAddress(e.target.value)}
//                   className="bg-neutral-50 border-neutral-200"
//                   autoComplete="street-address"
//                 />
//               </div>

//               {/* 4. Country (EU Dropdown) */}
//               <div className="space-y-2">
//                 <Label>
//                   Country <span className="text-red-500">*</span>
//                 </Label>
//                 <Select required onValueChange={(val) => setCountry(val)}>
//                   <SelectTrigger className="bg-neutral-50 border-neutral-200">
//                     <SelectValue placeholder="Select EU Country" />
//                   </SelectTrigger>
//                   <SelectContent className="z-50 max-h-52 w-[var(--radix-select-trigger-width)] overflow-y-auto bg-white text-neutral-900 border border-neutral-200 shadow-lg">
//                     {EU_COUNTRIES.map((c) => (
//                       <SelectItem key={c} value={c}>
//                         {c}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               {/* 5. User Role (Hospital Only) */}
//               {userType === "hospital" && (
//                 <div className="space-y-2">
//                   <Label>
//                     Job Role <span className="text-red-500">*</span>
//                   </Label>
//                   <Select onValueChange={(val) => setSelectedRole(val)}>
//                     <SelectTrigger className="bg-neutral-50 border-neutral-200">
//                       <SelectValue placeholder="Select Your Role" />
//                     </SelectTrigger>
//                     <SelectContent className=" z-50 max-h-52 w-[var(--radix-select-trigger-width)] overflow-y-auto  bg-white text-neutral-900 border border-neutral-200 shadow-lg">
//                       <SelectItem value="cpo">
//                         Chief Procurement Officer
//                       </SelectItem>
//                       <SelectItem value="sourcing_director">
//                         Director of Sourcing
//                       </SelectItem>
//                       <SelectItem value="procurement_analyst">
//                         Procurement Analyst
//                       </SelectItem>
//                       <SelectItem value="contract_specialist">
//                         Contract Specialist
//                       </SelectItem>
//                       <SelectItem value="ops_director">
//                         Director of Operations
//                       </SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Email & Password (Always Visible) */}
//           <div className="space-y-2">
//             <Label htmlFor="email">
//               Email <span className="text-red-500">*</span>
//             </Label>
//             <Input
//               id="email"
//               required
//               type="email"
//               placeholder="e.g. name@organization.eu"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="bg-neutral-50 border-neutral-200"
//               autoComplete="email"
//             />
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="password">
//               Password <span className="text-red-500">*</span>
//             </Label>
//             <Input
//               id="password"
//               required
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="bg-neutral-50 border-neutral-200"
//               autoComplete={isSignUp ? "new-password" : "current-password"}
//             />
//           </div>

//           <Button
//             type="submit"
//             disabled={isLoading}
//             className={cn(
//               "w-full h-11 text-md font-medium mt-6 font-serif tracking-wide",
//               activeTheme.button,
//             )}
//           >
//             {isLoading ? (
//               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//             ) : isSignUp ? (
//               "Complete Registration"
//             ) : (
//               "Sign In"
//             )}
//           </Button>
//         </form>

//         <div className="mt-8 text-center text-sm">
//           <button
//             onClick={() => setIsSignUp(!isSignUp)}
//             className="font-medium text-neutral-500 hover:text-neutral-900 underline transition-colors"
//           >
//             {isSignUp
//               ? "Already have an account? Login"
//               : "New to Easemed? Register"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Building2, Truck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

// Comprehensive list of European markets
const EU_COUNTRIES = [
  "Austria",
  "Belgium",
  "Bulgaria",
  "Croatia",
  "Cyprus",
  "Czech Republic",
  "Denmark",
  "Estonia",
  "Finland",
  "France",
  "Germany",
  "Greece",
  "Hungary",
  "Ireland",
  "Italy",
  "Latvia",
  "Lithuania",
  "Luxembourg",
  "Malta",
  "Netherlands",
  "Poland",
  "Portugal",
  "Romania",
  "Slovakia",
  "Slovenia",
  "Spain",
  "Sweden",
  "Switzerland",
  "United Kingdom",
];

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  // Auth Fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Profile Fields - ALL INITIALIZED TO EMPTY
  const [fullName, setFullName] = useState("");
  const [orgName, setOrgName] = useState("");
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState<string | undefined>(undefined);
  const [userType, setUserType] = useState<"hospital" | "vendor">("hospital");
  const [selectedRole, setSelectedRole] = useState("");

  const router = useRouter();
  const supabase = createClient();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();

    // STRICT VALIDATION
    if (isSignUp) {
      if (
        !email ||
        !password ||
        !fullName ||
        !orgName ||
        !address ||
        !country
      ) {
        alert("All fields are mandatory. Please complete the form.");
        return;
      }
      // Specific check for Role if user is a Hospital
      if (userType === "hospital" && !selectedRole) {
        alert("Please select your Job Role.");
        return;
      }
    }

    setIsLoading(true);
    const finalRole = userType === "vendor" ? "vendor" : selectedRole;

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              hospital_name: orgName,
              address: address,
              country: country,
              role: finalRole,
            },
          },
        });
        if (error) throw error;
        alert(
          "Account created successfully! Please check your email to verify.",
        );
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Visual Theme
  const theme = {
    hospital: {
      accent: "text-teal-600",
      button: "bg-teal-600 hover:bg-teal-700 text-white",
      tabActive:
        "data-[state=active]:text-teal-900 data-[state=active]:border-teal-600",
    },
    vendor: {
      accent: "text-indigo-600",
      button: "bg-indigo-600 hover:bg-indigo-700 text-white",
      tabActive:
        "data-[state=active]:text-indigo-900 data-[state=active]:border-indigo-600",
    },
  };
  const activeTheme = theme[userType];

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white text-neutral-900 font-sans py-12">
      <div className="w-full max-w-[440px] px-6">
        {/* Header */}
        <div className="flex flex-col items-center mb-8 space-y-4">
          <div
            className={cn(
              "p-4 rounded-2xl bg-neutral-50 shadow-sm transition-colors",
              activeTheme.accent,
            )}
          >
            {userType === "hospital" ? (
              <Building2 size={32} />
            ) : (
              <Truck size={32} />
            )}
          </div>
          <div className="text-center">
            <h1 className="text-3xl tracking-tight text-neutral-900 font-serif font-bold">
              {isSignUp ? "Create Account" : "Welcome Back"}
            </h1>
            <p className="text-sm text-neutral-500 mt-1">
              European Procurement Portal
            </p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs
          defaultValue="hospital"
          onValueChange={(v) => setUserType(v as "hospital" | "vendor")}
          className="w-full mb-8"
        >
          <TabsList className="w-full bg-transparent border-b border-neutral-200 p-0 h-auto rounded-none flex gap-8 justify-center">
            <TabsTrigger
              value="hospital"
              className={cn(
                "rounded-none border-b-2 border-transparent px-4 pb-3 pt-2 font-medium text-neutral-400 shadow-none transition-all",
                theme.hospital.tabActive,
              )}
            >
              Hospital
            </TabsTrigger>
            <TabsTrigger
              value="vendor"
              className={cn(
                "rounded-none border-b-2 border-transparent px-4 pb-3 pt-2 font-medium text-neutral-400 shadow-none transition-all",
                theme.vendor.tabActive,
              )}
            >
              Vendor
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Form */}
        <form onSubmit={handleAuth} className="space-y-4">
          {isSignUp && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-1 duration-300">
              {/* 1. Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullname">
                  User Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="fullname"
                  required
                  placeholder="e.g. Dr. Sarah Miller"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="bg-neutral-50 border-neutral-200"
                  autoComplete="name"
                />
              </div>

              {/* 2. Organization Name */}
              <div className="space-y-2">
                <Label htmlFor="orgname">
                  {userType === "hospital" ? "Hospital Name" : "Company Name"}{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="orgname"
                  required
                  placeholder={
                    userType === "hospital"
                      ? "e.g. Charité Berlin"
                      : "e.g. Bayer AG"
                  }
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="bg-neutral-50 border-neutral-200"
                  autoComplete="organization"
                />
              </div>

              {/* 3. Address */}
              <div className="space-y-2">
                <Label htmlFor="address">
                  Full Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="address"
                  required
                  placeholder="e.g. Charitéplatz 1, 10117 Berlin"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="bg-neutral-50 border-neutral-200"
                  autoComplete="street-address"
                />
              </div>

              {/* 4. Country (EU Dropdown) */}
              <div className="space-y-2">
                <Label>
                  Country <span className="text-red-500">*</span>
                </Label>
                <Select required onValueChange={(val) => setCountry(val)}>
                  <SelectTrigger className="bg-neutral-50 border-neutral-200">
                    <SelectValue placeholder="Select EU Country" />
                  </SelectTrigger>
                  <SelectContent className="z-50 max-h-52 w-[var(--radix-select-trigger-width)] overflow-y-auto bg-white text-neutral-900 border border-neutral-200 shadow-lg">
                    {EU_COUNTRIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 5. User Role (Hospital Only) */}
              {userType === "hospital" && (
                <div className="space-y-2">
                  <Label>
                    Job Role <span className="text-red-500">*</span>
                  </Label>
                  <Select onValueChange={(val) => setSelectedRole(val)}>
                    <SelectTrigger className="bg-neutral-50 border-neutral-200">
                      <SelectValue placeholder="Select Your Role" />
                    </SelectTrigger>
                    <SelectContent className="z-50 max-h-52 w-[var(--radix-select-trigger-width)] overflow-y-auto bg-white text-neutral-900 border border-neutral-200 shadow-lg">
                      <SelectItem value="cpo">
                        Chief Procurement Officer (CPO)
                      </SelectItem>
                      <SelectItem value="head_of_department">
                        Head of Department (HOD)
                      </SelectItem>
                      <SelectItem value="procurement_analyst">
                        Procurement Analyst
                      </SelectItem>
                      <SelectItem value="sourcing_director">
                        Director of Sourcing
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}

          {/* Email & Password (Always Visible) */}
          <div className="space-y-2">
            <Label htmlFor="email">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              required
              type="email"
              placeholder="e.g. name@organization.eu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-neutral-50 border-neutral-200"
              autoComplete="email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">
              Password <span className="text-red-500">*</span>
            </Label>
            <Input
              id="password"
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-neutral-50 border-neutral-200"
              autoComplete={isSignUp ? "new-password" : "current-password"}
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className={cn(
              "w-full h-11 text-md font-medium mt-6 font-serif tracking-wide",
              activeTheme.button,
            )}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : isSignUp ? (
              "Complete Registration"
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="font-medium text-neutral-500 hover:text-neutral-900 underline transition-colors"
          >
            {isSignUp
              ? "Already have an account? Login"
              : "New to Easemed? Register"}
          </button>
        </div>
      </div>
    </div>
  );
}
