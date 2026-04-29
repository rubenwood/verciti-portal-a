
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


export function SkillsMap(){
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
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    />
                </MapContainer>
            </div>
        </>
    )
}