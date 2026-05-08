
"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
//import { X, Users, MapPin, GraduationCap, Building2, Briefcase, ChevronRight, Search, ExternalLink, Plus, Check, Minus, FileText, Link2, Clock, Phone, Mail, Globe, BookOpen } from "lucide-react";
//import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
//import { Input } from "@/components/ui/input";
//import { Button } from "@/components/ui/button";
//import { cn } from "@/lib/utils";
import "leaflet/dist/leaflet.css";

// Dynamically import map components to avoid SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const CircleMarker = dynamic(
  () => import("react-leaflet").then((mod) => mod.CircleMarker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);
const Tooltip = dynamic(
  () => import("react-leaflet").then((mod) => mod.Tooltip),
  { ssr: false }
);


// Workplace/Project locations
const workplaces = [
  {
    id: "wp1",
    name: "Aberdeen Hydrogen Plant",
    type: "project",
    coordinates: [57.15, -2.1] as [number, number],
    staffAssigned: 24,
    staffRequired: 100,
    skills: [
      { name: "Hydrogen Fundamentals", have: 18, need: 40 },
      { name: "Electrolyser(s)", have: 8, need: 25 },
      { name: "Hazardous Voltages", have: 20, need: 35 },
      { name: "Plant & Machinery", have: 12, need: 30 },
      { name: "Storage Tanks", have: 6, need: 20 },
    ],
  },
  {
    id: "wp2",
    name: "Manchester Wind Farm",
    type: "project",
    coordinates: [53.48, -2.24] as [number, number],
    staffAssigned: 45,
    staffRequired: 80,
    skills: [
      { name: "Wind Energy", have: 32, need: 50 },
      { name: "Electrical Theory (Fundamentals)", have: 40, need: 60 },
      { name: "Hazardous Voltages", have: 28, need: 40 },
      { name: "Marine", have: 15, need: 25 },
    ],
  },
  {
    id: "wp3",
    name: "London HQ",
    type: "workplace",
    coordinates: [51.51, -0.12] as [number, number],
    staffAssigned: 120,
    staffRequired: 150,
    skills: [
      { name: "Electrical Theory (Fundamentals)", have: 85, need: 100 },
      { name: "Intermediate Electrical Theory", have: 60, need: 80 },
      { name: "Solar Power", have: 45, need: 70 },
      { name: "Energy Storage", have: 55, need: 75 },
    ],
  },
  {
    id: "wp4",
    name: "Cardiff Solar Installation",
    type: "project",
    coordinates: [51.48, -3.18] as [number, number],
    staffAssigned: 18,
    staffRequired: 50,
    skills: [
      { name: "Solar Power", have: 12, need: 30 },
      { name: "Electrical Theory (Fundamentals)", have: 15, need: 35 },
      { name: "Energy Storage", have: 8, need: 20 },
      { name: "Hazardous Voltages", have: 14, need: 25 },
    ],
  },
  {
    id: "wp5",
    name: "Edinburgh R&D Center",
    type: "workplace",
    coordinates: [55.95, -3.19] as [number, number],
    staffAssigned: 35,
    staffRequired: 60,
    skills: [
      { name: "Hydrogen Fundamentals", have: 28, need: 40 },
      { name: "FCEV", have: 15, need: 30 },
      { name: "R&D Interactive Laboratories", have: 20, need: 35 },
      { name: "Hydrogen Production", have: 18, need: 30 },
    ],
  },
  {
    id: "wp6",
    name: "Belfast Marine Hub",
    type: "project",
    coordinates: [54.6, -5.93] as [number, number],
    staffAssigned: 22,
    staffRequired: 45,
    skills: [
      { name: "Marine", have: 16, need: 30 },
      { name: "Wind Energy", have: 12, need: 25 },
      { name: "Storage Tanks", have: 8, need: 18 },
      { name: "Plant & Machinery", have: 10, need: 20 },
    ],
  },
];

// Talent source locations (universities, colleges, job boards)
const talentSources = [
  { id: "ts1", name: "University of Strathclyde", type: "university", coordinates: [55.86, -4.25] as [number, number], skills: ["Hydrogen Fundamentals", "Electrolyser(s)", "FCEV"], graduates: 120, address: "16 Richmond Street, Glasgow G1 1XQ", phone: "+44 141 548 2814", email: "engineering@strath.ac.uk", website: "www.strath.ac.uk", courses: ["MSc Hydrogen & Fuel Cell Technology", "BEng Energy Engineering", "MSc Advanced Energy Systems"] },
  { id: "ts2", name: "Imperial College London", type: "university", coordinates: [51.5, -0.17] as [number, number], skills: ["Electrical Theory (Fundamentals)", "Energy Storage", "Solar Power"], graduates: 250, address: "South Kensington Campus, London SW7 2AZ", phone: "+44 20 7589 5111", email: "electrical.engineering@imperial.ac.uk", website: "www.imperial.ac.uk", courses: ["MEng Electrical & Electronic Engineering", "MSc Sustainable Energy Futures", "MSc Energy Technology"] },
  { id: "ts3", name: "University of Manchester", type: "university", coordinates: [53.47, -2.23] as [number, number], skills: ["Wind Energy", "Marine", "Electrical Theory (Fundamentals)"], graduates: 180, address: "Oxford Road, Manchester M13 9PL", phone: "+44 161 306 6000", email: "eng.admissions@manchester.ac.uk", website: "www.manchester.ac.uk", courses: ["BEng Renewable Energy Engineering", "MSc Electrical Power Systems", "MEng Mechanical Engineering"] },
  { id: "ts4", name: "Cardiff University", type: "university", coordinates: [51.49, -3.18] as [number, number], skills: ["Solar Power", "Energy Storage", "Hazardous Voltages"], graduates: 95, address: "The Parade, Cardiff CF24 3AA", phone: "+44 29 2087 4000", email: "engineering@cardiff.ac.uk", website: "www.cardiff.ac.uk", courses: ["BEng Electrical & Electronic Engineering", "MSc Sustainable Energy & Environment", "MSc Electrical Energy Systems"] },
  { id: "ts5", name: "University of Edinburgh", type: "university", coordinates: [55.94, -3.19] as [number, number], skills: ["Hydrogen Fundamentals", "R&D Interactive Laboratories", "Hydrogen Production"], graduates: 140, address: "Old College, South Bridge, Edinburgh EH8 9YL", phone: "+44 131 650 1000", email: "eng.school@ed.ac.uk", website: "www.ed.ac.uk", courses: ["MSc Sustainable Energy Systems", "BEng Chemical Engineering", "PhD Hydrogen Energy Research"] },
  { id: "ts6", name: "Newcastle College", type: "college", coordinates: [54.97, -1.61] as [number, number], skills: ["Plant & Machinery", "Hazardous Voltages", "Storage Tanks"], graduates: 65, address: "Rye Hill Campus, Scotswood Road, Newcastle NE4 7SA", phone: "+44 191 200 4000", email: "enquiries@ncl-coll.ac.uk", website: "www.ncl-coll.ac.uk", courses: ["HNC Electrical & Electronic Engineering", "Level 3 Diploma in Engineering", "HND Mechanical Engineering"] },
  { id: "ts7", name: "Birmingham City University", type: "university", coordinates: [52.48, -1.89] as [number, number], skills: ["Electrical Theory (Fundamentals)", "Intermediate Electrical Theory", "Solar Power"], graduates: 110, address: "Millennium Point, Curzon Street, Birmingham B4 7XG", phone: "+44 121 331 5000", email: "engineering@bcu.ac.uk", website: "www.bcu.ac.uk", courses: ["BEng Electrical Engineering", "MSc Renewable Energy Engineering", "BEng Electronic Engineering"] },
  { id: "ts8", name: "Liverpool John Moores", type: "university", coordinates: [53.41, -2.98] as [number, number], skills: ["Marine", "Wind Energy", "Storage Tanks"], graduates: 85, address: "Byrom Street, Liverpool L3 3AF", phone: "+44 151 231 2121", email: "courses@ljmu.ac.uk", website: "www.ljmu.ac.uk", courses: ["BEng Maritime Engineering", "MSc Offshore & Ocean Technology", "BEng Mechanical & Marine Engineering"] },
  { id: "ts9", name: "Leeds College of Building", type: "college", coordinates: [53.8, -1.55] as [number, number], skills: ["Hazardous Voltages", "Plant & Machinery", "Electrical Theory (Fundamentals)"], graduates: 45, address: "North Street, Leeds LS2 7QT", phone: "+44 113 222 6000", email: "info@lcb.ac.uk", website: "www.lcb.ac.uk", courses: ["Level 3 Electrical Installation", "HNC Building Services Engineering", "Level 2 Diploma in Electrical Installations"] },
  { id: "ts10", name: "Indeed - Glasgow", type: "jobboard", coordinates: [55.86, -4.25] as [number, number], skills: ["Hydrogen Fundamentals", "Electrolyser(s)", "Plant & Machinery"], candidates: 340, address: "Online Platform", phone: "", email: "support@indeed.com", website: "www.indeed.co.uk" },
  { id: "ts11", name: "LinkedIn Jobs - Bristol", type: "jobboard", coordinates: [51.45, -2.59] as [number, number], skills: ["Solar Power", "Energy Storage", "Wind Energy"], candidates: 520, address: "Online Platform", phone: "", email: "support@linkedin.com", website: "www.linkedin.com/jobs" },
  { id: "ts12", name: "Reed - Sheffield", type: "jobboard", coordinates: [53.38, -1.47] as [number, number], skills: ["Hazardous Voltages", "Electrical Theory (Fundamentals)", "Plant & Machinery"], candidates: 280, address: "Online Platform", phone: "", email: "support@reed.co.uk", website: "www.reed.co.uk" },
  { id: "ts13", name: "Totaljobs - Nottingham", type: "jobboard", coordinates: [52.95, -1.15] as [number, number], skills: ["Energy Storage", "Solar Power", "Wind Energy"], candidates: 195, address: "Online Platform", phone: "", email: "support@totaljobs.com", website: "www.totaljobs.com" },
  { id: "ts14", name: "Queen's University Belfast", type: "university", coordinates: [54.58, -5.94] as [number, number], skills: ["Marine", "Wind Energy", "Hydrogen Fundamentals"], graduates: 75, address: "University Road, Belfast BT7 1NN", phone: "+44 28 9024 5133", email: "engineering@qub.ac.uk", website: "www.qub.ac.uk", courses: ["MEng Mechanical Engineering", "MSc Advanced Marine Engineering", "BEng Aerospace Engineering"] },
];

//
type Workplace = typeof workplaces[0];
type Skill = Workplace["skills"][0];
type TalentSource = typeof talentSources[0];

function MapRightClickHandler({ onRightClick }: { onRightClick: (lat: number, lng: number) => void }) {
  const { useMapEvents } = require("react-leaflet");
  
  useMapEvents({
    contextmenu: (e: { latlng: { lat: number; lng: number }; originalEvent: MouseEvent }) => {
      e.originalEvent.preventDefault();
      onRightClick(e.latlng.lat, e.latlng.lng);
    },
  });
  
  return null;
}

export function SkillsMap(){
  const [selectedWorkplace, setSelectedWorkplace] = useState<Workplace | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [showTalentSources, setShowTalentSources] = useState(false);
  const [highlightedSkill, setHighlightedSkill] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [allWorkplaces, setAllWorkplaces] = useState(workplaces);
  const [placedCoordinates, setPlacedCoordinates] = useState<[number, number] | null>(null);
  const [selectedTalentSource, setSelectedTalentSource] = useState<TalentSource | null>(null);
  const [candidateSearch, setCandidateSearch] = useState("");
  
  // New workplace form state
  const [newWorkplaceName, setNewWorkplaceName] = useState("");
  const [newWorkplaceType, setNewWorkplaceType] = useState<"workplace" | "project">("project");
  const [selectedSkills, setSelectedSkills] = useState<{ name: string; need: number }[]>([]);
  const [assignedWorkers, setAssignedWorkers] = useState<string[]>([]);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [skillSearch, setSkillSearch] = useState("");
  const [workerSearch, setWorkerSearch] = useState("");


  const handleMapRightClick = (lat: number, lng: number) => {
    setPlacedCoordinates([lat, lng]);
    setShowAddModal(true);
    // Reset form state
    setNewWorkplaceName("");
    setNewWorkplaceType("project");
    setSelectedSkills([]);
    setAssignedWorkers([]);
    setStep(1);
  }

  return (
    <>
      <div style={{ height: "900px", width: "100%" }}>
        <MapContainer
          center={[54.5, -4]}
          zoom={6}
          minZoom={5}
          maxZoom={12}
          scrollWheelZoom={true}
          className="h-full w-full"
          style={{ background: "#1a1a2e" }}
        >
          <MapRightClickHandler onRightClick={handleMapRightClick} />
          <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          <div className="absolute top-2 left-12 bg-background/95 backdrop-blur-sm rounded-lg border border-border p-3 text-xs space-y-2 z-[1000]">
            <p className="font-medium text-foreground">Staffing Level</p>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-muted-foreground">&gt;75% staffed</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="text-muted-foreground">50-75% staffed</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-muted-foreground">&lt;50% staffed</span>
            </div>
          </div>
        </MapContainer>
          
      </div>
    </>
  )
}