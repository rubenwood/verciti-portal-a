"use client"
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function StatCard(props: any) {
  return (
    <Card key={props.stat.label}>
        <CardContent className="p-4">
        <div className="flex items-center justify-between">
            <props.stat.icon className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-medium text-success">{props.stat.change}</span>
        </div>
        <div className="mt-3">
            <p className="text-2xl font-bold text-foreground">{props.stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{props.stat.label}</p>
        </div>
        </CardContent>
    </Card>
  )
}