
"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
//import { X, Users, MapPin, GraduationCap, Building2, Briefcase, ChevronRight, Search, ExternalLink, Plus, Check, Minus, FileText, Link2, Clock, Phone, Mail, Globe, BookOpen } from "lucide-react";
//import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
//import { Input } from "@/components/ui/input";
//import { Button } from "@/components/ui/button";
//import { cn } from "@/lib/utils";
import "leaflet/dist/leaflet.css";


import { PostgrestError, SupabaseClient, User } from '@supabase/supabase-js';
import { supabaseMain, supabaseTest } from "@/lib/supabase";
import { getWorkPlaces } from "@/app/db/analytics/general/workplaces";
import { getTalentSources } from "@/app/db/analytics/general/talent-sources";

import { talentSources } from "./temp-data"

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

//
//type Workplace = typeof workplaces[0];
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
  const [workplaces, setWorkplaces] = useState<Workplace[] | null>(null);
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


  const handleMapRightClick = async (lat: number, lng: number) => {
    setPlacedCoordinates([lat, lng]);
    setShowAddModal(true);
    // Reset form state
    setNewWorkplaceName("");
    setNewWorkplaceType("project");
    setSelectedSkills([]);
    setAssignedWorkers([]);
    setStep(1);
  }

  const init = async () => {
    try{
      const workplacesResp: Workplace[] = await getWorkPlaces(supabaseTest, "verciti");
      console.log(workplacesResp);
      setWorkplaces(workplacesResp);
    }catch(e){
      console.error(e);
    }
  }

  useEffect(() => {
    init();
  }, [])

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

          {/* turn this into a list of reusable components */}
          {workplaces?.map((workplace) => (
            <CircleMarker
              key={workplace.id}
              center={[workplace.coords.lat, workplace.coords.long]}
              radius={10}
              pathOptions={{
                fillColor: "#3b82f6",
                color: "#ffffff",
                weight: 1,
                fillOpacity: 0.8,
              }}
              eventHandlers={{
                click: () => {
                  setSelectedWorkplace(workplace);
                },
              }}
            >
              <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                {workplace.name}
              </Tooltip>

              <Popup>
                <div>
                  <h3 className="font-bold">{workplace.name}</h3>
                </div>
              </Popup>
            </CircleMarker>
          ))}

          {/* {talentSources?.map((talentSources) => (
            <CircleMarker
              key={talentSources.id}
              center={[talentSources.coordinates[0], talentSources.coordinates[1]]}
              radius={10}
              pathOptions={{
                fillColor: "#f6bb3b",
                color: "#ffffff",
                weight: 1,
                fillOpacity: 0.8,
              }}
              eventHandlers={{
                click: () => {
                  //setSelectedWorkplace(workplace);
                },
              }}
            >
              <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                {talentSources.name}
              </Tooltip>

              <Popup>
                <div>
                  <h3 className="font-bold">{talentSources.name}</h3>
                </div>
              </Popup>
            </CircleMarker>
          ))} */}



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