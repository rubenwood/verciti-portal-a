"use client"

import { ActivityCard } from "./activity-card"

export function ActivityBrowser({ activities }: { activities: Activity[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {activities
        .filter((act) => act.params.stage_ids != null) // change this, sometimes we'll want o modify activities without stages
        .map((act) => (
          <div key={act.id}>
            <ActivityCard activity={act} />
          </div>
        ))}
    </div>
  );
}