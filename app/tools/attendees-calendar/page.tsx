"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabaseTest } from "@/lib/supabase";

type Attendee = {
  id: string;
  created_at: string;
  name: string | null;
  email: string | null;
  course: string | null;
  course_label: string | null;
  date: string | null;
  days: number | null;
  amount_paid: number | null;
  stripe_payment_id: string | null;
  payment_date: string | null;
};

export default function AttendeesPage() {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [filtered, setFiltered] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState(true);
  const [courseFilter, setCourseFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [dates, setDates] = useState<string[]>([]);

  useEffect(() => {
    fetchAttendees();
  }, []);

  useEffect(() => {
    let result = attendees;
    if (courseFilter !== "all") result = result.filter((a) => a.course === courseFilter);
    if (dateFilter !== "all") result = result.filter((a) => a.date === dateFilter);
    setFiltered(result);
  }, [courseFilter, dateFilter, attendees]);

  async function fetchAttendees() {
    setLoading(true);
    const { data, error } = await supabaseTest
      .from("training_course_attendees")
      .select("*")
      .order("payment_date", { ascending: false });

    if (!error && data) {
      setAttendees(data);
      setFiltered(data);
      const uniqueDates = Array.from(new Set(data.map((a) => a.date).filter(Boolean))) as string[];
      setDates(uniqueDates.sort());
    }

    console.log("Fetched attendees:", data, "Error:", error);
    setLoading(false);
  }

  const totalRevenue = filtered.reduce((sum, a) => sum + (a.amount_paid ?? 0), 0);
  const hasFilters = courseFilter !== "all" || dateFilter !== "all";

  return (
    <div className="p-8 space-y-6 max-w-6xl mx-auto">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Course Attendees</h1>
        <p className="text-muted-foreground text-sm mt-1">Live view of all confirmed bookings</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-xs text-muted-foreground uppercase tracking-widest font-medium">
              Total bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{filtered.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-xs text-muted-foreground uppercase tracking-widest font-medium">
              Total revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">£{(totalRevenue / 100).toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-xs text-muted-foreground uppercase tracking-widest font-medium">
              Upcoming dates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{dates.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-3 items-center">
        <Select value={courseFilter} onValueChange={setCourseFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All courses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All courses</SelectItem>
            <SelectItem value="carbon">Carbon Awareness</SelectItem>
            <SelectItem value="electrical">Electrical Safety</SelectItem>
          </SelectContent>
        </Select>

        <Select value={dateFilter} onValueChange={setDateFilter}>
          <SelectTrigger className="w-56">
            <SelectValue placeholder="All dates" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All dates</SelectItem>
            {dates.map((d) => (
              <SelectItem key={d} value={d}>{d}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { setCourseFilter("all"); setDateFilter("all"); }}
          >
            Clear filters
          </Button>
        )}
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-12 text-center text-muted-foreground text-sm">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground text-sm">No attendees found</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Date Attending</TableHead>
                  <TableHead>Days</TableHead>
                  <TableHead>Paid</TableHead>
                  <TableHead>Booked on</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium">{a.name ?? "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{a.email ?? "—"}</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={
                          a.course === "carbon"
                            ? "bg-[#97fb57]/15 text-[#4a8a1f] dark:text-[#97fb57] border-[#97fb57]/30"
                            : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
                        }
                      >
                        {a.course === "carbon" ? "Carbon Awareness" : "Electrical Safety"}
                      </Badge>
                    </TableCell>
                    <TableCell>{a.date ?? "—"}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {a.days} {a.days === 1 ? "day" : "days"}
                    </TableCell>
                    <TableCell className="font-semibold">
                      £{((a.amount_paid ?? 0) / 100).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {a.payment_date
                        ? new Date(a.payment_date).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

    </div>
  );
}