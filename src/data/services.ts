import agniveer from "@/assets/services/agniveer.jpg";
import sscGd from "@/assets/services/ssc-gd.jpg";
import panAadhaar from "@/assets/services/pan-aadhaar.jpg";
import certificate from "@/assets/services/certificate.jpg";
import admission from "@/assets/services/admission.jpg";
import voter from "@/assets/services/voter.jpg";
import passport from "@/assets/services/passport.jpg";
import railway from "@/assets/services/railway.jpg";

export type ServiceItem = {
  name: string;
  cat: "recruitment" | "admission" | "certificate" | "identity" | "scholarship";
  org: string;
  date: string;
  apps: string;
  fee: string;
  image: string;
  description: string;
  eligibility: string[];
  documents: string[];
};

export const SERVICES: ServiceItem[] = [
  {
    name: "Agniveer (GD, Tradesman, Clerk)", cat: "recruitment", org: "Indian Army",
    date: "May 10, 2026", apps: "25,000", fee: "₹250", image: agniveer,
    description: "Apply online for Indian Army Agniveer recruitment under the Agnipath scheme. Multiple posts available across India.",
    eligibility: ["Age 17.5 – 21 years", "10th / 12th pass (post-wise)", "Indian citizen", "Physical & medical standards"],
    documents: ["Aadhaar Card", "10th/12th Marksheet", "Domicile Certificate", "Passport-size Photo", "Signature"],
  },
  {
    name: "RI AMIN", cat: "recruitment", org: "RI ODISHA",
    date: "Jan 30, 2026", apps: "3,250", fee: "₹300", image: certificate,
    description: "Revenue Inspector & Amin recruitment by Government of Odisha. Surveying and revenue duties.",
    eligibility: ["Graduate from recognized university", "Age 21 – 32 years", "Odisha domicile preferred"],
    documents: ["Aadhaar Card", "Graduation Certificate", "Caste Certificate", "Photo & Signature"],
  },
  {
    name: "NDA 2026", cat: "recruitment", org: "UPSC",
    date: "Dec 29, 2025", apps: "394", fee: "₹100", image: agniveer,
    description: "National Defence Academy entrance exam by UPSC for joining Army, Navy and Air Force as officers.",
    eligibility: ["Unmarried male/female", "12th pass (PCM for Navy/AF)", "Age 16.5 – 19.5 years"],
    documents: ["Aadhaar", "10th Certificate (DOB)", "12th Marksheet", "Photo & Signature"],
  },
  {
    name: "SSC GD Constable 2026", cat: "recruitment", org: "SSC",
    date: "Dec 30, 2025", apps: "25,487", fee: "₹100", image: sscGd,
    description: "SSC General Duty Constable recruitment for BSF, CISF, CRPF, ITBP, SSB, AR & SSF.",
    eligibility: ["10th pass", "Age 18 – 23 years", "Physical standards apply"],
    documents: ["Aadhaar", "10th Marksheet", "Domicile Certificate", "Photo & Signature"],
  },
  {
    name: "CTET", cat: "recruitment", org: "CBSE",
    date: "Dec 11, 2025", apps: "12,000", fee: "₹1,000", image: admission,
    description: "Central Teacher Eligibility Test conducted by CBSE for teaching jobs in central government schools.",
    eligibility: ["Graduate + B.Ed / D.El.Ed", "Indian citizen"],
    documents: ["Aadhaar", "Graduation Certificate", "B.Ed Certificate", "Photo & Signature"],
  },
  {
    name: "OTET", cat: "recruitment", org: "BSE",
    date: "Nov 26, 2025", apps: "10,000", fee: "₹500", image: admission,
    description: "Odisha Teacher Eligibility Test for primary and upper-primary teachers in Odisha schools.",
    eligibility: ["D.El.Ed / B.Ed", "Odisha domicile"],
    documents: ["Aadhaar", "Educational Certificates", "Domicile", "Photo & Signature"],
  },
  {
    name: "Merchant Navy 2025", cat: "recruitment", org: "Navy",
    date: "Dec 9, 2025", apps: "4,000", fee: "₹500", image: passport,
    description: "Merchant Navy recruitment for officer cadet and rating posts on cargo and passenger ships.",
    eligibility: ["12th PCM", "Age 17 – 25 years", "Medical fit"],
    documents: ["Aadhaar", "12th Marksheet", "Medical Certificate", "Passport"],
  },
  {
    name: "RRB NTPC", cat: "recruitment", org: "Indian Railways",
    date: "Nov 25, 2025", apps: "9,99,999", fee: "₹500", image: railway,
    description: "Railway Recruitment Board NTPC exam for Non-Technical Popular Categories — graduate & undergraduate posts.",
    eligibility: ["12th / Graduate", "Age 18 – 33 years"],
    documents: ["Aadhaar", "Education Certificate", "Photo & Signature"],
  },
  {
    name: "+2 Admission CHSE", cat: "admission", org: "CHSE Odisha",
    date: "Open", apps: "—", fee: "₹200", image: admission,
    description: "Apply for +2 (Class 11) admission via CHSE Odisha SAMS portal. Arts, Science, Commerce streams.",
    eligibility: ["10th pass from BSE/CBSE/ICSE"],
    documents: ["Aadhaar", "10th Marksheet", "School Leaving Certificate", "Caste Certificate"],
  },
  {
    name: "+3 Admission CHSE", cat: "admission", org: "CHSE Odisha",
    date: "Open", apps: "—", fee: "₹200", image: admission,
    description: "Apply for +3 (Degree) admission via CHSE Odisha SAMS portal. UG admission across colleges.",
    eligibility: ["+2 pass"],
    documents: ["Aadhaar", "+2 Marksheet", "CLC", "Caste Certificate"],
  },
  {
    name: "Income Certificate", cat: "certificate", org: "Govt. of Odisha",
    date: "Always", apps: "—", fee: "₹150", image: certificate,
    description: "Apply for Income Certificate issued by Tahasildar / Revenue Department of Odisha.",
    eligibility: ["Resident of Odisha"],
    documents: ["Aadhaar", "Ration Card", "Salary Slip / Affidavit", "Resident Proof"],
  },
  {
    name: "Caste Certificate", cat: "certificate", org: "Govt. of Odisha",
    date: "Always", apps: "—", fee: "₹150", image: certificate,
    description: "Apply for SC/ST/OBC/SEBC Caste Certificate from Government of Odisha.",
    eligibility: ["Belongs to specified category", "Resident of Odisha"],
    documents: ["Aadhaar", "Father's Caste Certificate", "Resident Proof", "Photo"],
  },
  {
    name: "Resident Certificate", cat: "certificate", org: "Govt. of Odisha",
    date: "Always", apps: "—", fee: "₹150", image: certificate,
    description: "Apply for Residence / Domicile Certificate of Odisha.",
    eligibility: ["Continuous residence in Odisha"],
    documents: ["Aadhaar", "Voter ID / Ration Card", "Land Records / Rent Agreement"],
  },
  {
    name: "PAN Card", cat: "identity", org: "NSDL",
    date: "Always", apps: "—", fee: "₹120", image: panAadhaar,
    description: "Apply for new PAN card or correction in existing PAN through NSDL/UTIITSL.",
    eligibility: ["Indian citizen / NRI", "Age 18+ (minor with guardian)"],
    documents: ["Aadhaar", "Photo", "Signature", "Address Proof"],
  },
  {
    name: "Aadhaar Update", cat: "identity", org: "UIDAI",
    date: "Always", apps: "—", fee: "₹100", image: panAadhaar,
    description: "Update name, address, mobile, DOB or photo on existing Aadhaar card.",
    eligibility: ["Existing Aadhaar holder"],
    documents: ["Existing Aadhaar", "Proof of update (address/DOB etc.)"],
  },
  {
    name: "Voter ID", cat: "identity", org: "ECI",
    date: "Always", apps: "—", fee: "₹100", image: voter,
    description: "Apply for new Voter ID (EPIC) or update details via Election Commission of India.",
    eligibility: ["Indian citizen", "Age 18+"],
    documents: ["Aadhaar", "Address Proof", "Photo", "Date of Birth Proof"],
  },
];

export const getService = (name: string) =>
  SERVICES.find((s) => s.name.toLowerCase() === name.toLowerCase());
