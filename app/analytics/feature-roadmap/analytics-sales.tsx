import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export function Legend() {
  return (
    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mb-6">
      <LegendItem color="bg-blue-100 border-blue-300" label="Universities & colleges" />
      <LegendItem color="bg-green-100 border-green-300" label="Organisations / L&D" />
      <LegendItem color="bg-amber-100 border-amber-300" label="Both" />
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className={`w-2 h-2 rounded-sm border ${color}`} />
      <span>{label}</span>
    </div>
  );
}

interface BadgeProps {
  type: "uni" | "org" | "both";
}

const styles = {
  uni: "bg-blue-100 text-blue-700",
  org: "bg-green-100 text-green-700",
  both: "bg-amber-100 text-amber-700",
  pending: "text-xs underline decoration-dashed text-amber-300",
  inprogress: "text-xs underline decoration-dashed text-blue-400",
  done: "text-xs font-bold underline decoration-dashed text-green-300",
};

const labels = {
  uni: "University",
  org: "Organisation",
  both: "Both",
};

export function Badge({ type }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-block text-[11px] px-2 py-[2px] rounded mb-2 font-medium",
        styles[type]
      )}
    >
      {labels[type]}
    </span>
  );
}

export function StatCard({ title, desc, badge, status }: StatItem) {
  return (
    <Card className="border border-border/60 hover:border-border transition-colors cursor-pointer">
      <CardContent className="p-4">
        <Badge type={badge} />
        <p className={styles[status]}>{status}</p>
        <p className="text-sm font-medium text-foreground mb-1">
          {title}
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {desc}
        </p>
      </CardContent>
    </Card>
  );
}

interface StatItem {
  title: string;
  desc: string;
  badge: "both" | "uni" | "org";
  status: "done" | "inprogress" | "pending";
}

interface SectionProps {
  id: string;
  title: string;
  items: StatItem[];
}

const featureSections: SectionProps[] = [
  {
    id: "feature-1",
    title: "Learner progress & risk",
    items: [
      {
        title: "At-risk learner flags",
        desc: "Identify users falling behind via inactivity streaks, repeated failures, or low engagement scores.",
        badge: "both",
        status:"inprogress",
      },
      {
        title: "Learning velocity",
        desc: "Time from enrolment to completion vs. expected pace. Spot fast-trackers and stragglers.",
        badge: "both",
        status: "inprogress"
      },
      {
        title: "Drop-off points",
        desc: "Exact moment learners abandon a module — by timestamp or content section, not just overall rate.",
        badge: "both",
        status: "inprogress"
      },
      {
        title: "Re-enrolment rate",
        desc: "How many learners return to repeat or advance into follow-on courses.",
        badge: "uni", 
        status: "pending"
      },
    ],
  },
  {
    id: "feature-2",
    title: "Assessment quality",
    items: [
      {
        title: "Item analysis",
        desc: "Per-question difficulty index and discrimination — reveals poorly written or misleading questions.",
        badge: "uni",
        status:"pending",
      },
      {
        title: "Score distribution",
        desc: "Histogram of scores per assessment — shows whether tests are too easy, too hard, or well-spread.",
        badge: "both",
        status:"inprogress",
      },
      {
        title: "Time on task",
        desc: "Time spent per question vs. module vs. course — flags guessers and learners who are struggling.",
        badge: "both",
        status:"inprogress",
      },
      {
        title: "Knowledge gap heatmap",
        desc: "Aggregate wrong answers by topic to surface shared misunderstandings across a cohort.",
        badge: "both",
        status:"pending",
      },
    ],
  },
  {
    id: "feature-3",
    title: "Compliance & certification",
    items: [
      {
        title: "Compliance status",
        desc: "% of staff who've completed mandatory training, with expiry dates and overdue counts per team.",
        badge: "org",
        status:"pending",
      },
      {
        title: "Certificate tracking",
        desc: "Issued credentials with expiry, renewal reminders, and verifiable download links for each user.",
        badge: "both",
        status:"pending",
      },
      {
        title: "Audit-ready exports",
        desc: "One-click PDF/CSV report showing who completed what, when, and with what score — for regulators.",
        badge: "org",
        status:"pending",
      },
      {
        title: "CPD / credit hours",
        desc: "Accumulated continuing professional development hours per learner, mapped to external standards.",
        badge: "both",
        status:"inprogress",
      },
    ],
  },
  {
    id: "feature-4",
    title: "Team & cohort management",
    items: [
      {
        title: "Cohort benchmarking",
        desc: "Compare performance across intake years, departments, or sections on the same course.",
        badge: "uni",
        status:"pending",
      },
      {
        title: "Group assignment tracking",
        desc: "Assign courses to teams or cohorts and track group-level progress vs. individual progress.",
        badge: "both",
        status:"inprogress",
      },
      {
        title: "Instructor effectiveness",
        desc: "Correlate learner outcomes with which instructor or facilitator delivered the course.",
        badge: "uni",
        status:"pending",
      },
    ],
  },
  {
    id: "feature-5",
    title: "Engagement & content quality",
    items: [
      {
        title: "Engagement depth",
        desc: "Play-through %, resource downloads, forum posts — beyond simple completion rates.",
        badge: "both",
        status:"pending",
      },
      {
        title: "Learner satisfaction (NPS)",
        desc: "Post-course rating and NPS survey, aggregated per module and instructor.",
        badge: "both",
        status:"pending",
      },
      {
        title: "Learning path funnels",
        desc: "Where in a multi-course pathway learners stall — enables smarter prerequisite design.",
        badge: "both",
        status:"pending",
      },
    ],
  },
  {
    id: "feature-6",
    title: "ROI & business metrics",
    items: [
      {
        title: "Training-to-performance link",
        desc: "Correlate course completions with HR outcome data (sales figures, error rates, promotions).",
        badge: "org",
        status:"pending",
      },
      {
        title: "Licence utilisation",
        desc: "Seat usage vs. purchased licences — helps admins right-size contracts at renewal.",
        badge: "both",
        status:"done",
      },
      {
        title: "Scheduled report digests",
        desc: "Automated weekly/monthly email summaries sent to admins, managers, or accreditation bodies.",
        badge: "both",
        status:"pending",
      },
    ],
  },
];

export { featureSections };
export type { SectionProps, StatItem };

export function Section({ title, items }: SectionProps) {
  return (
    <div className="mb-8">
      <p className="text-[11px] font-medium tracking-wider uppercase text-muted-foreground mb-2">
        {title}
      </p>

      <div className="grid gap-3 grid-cols-[repeat(auto-fit,minmax(170px,1fr))]">
        {items.map((item, i) => (
          <StatCard key={i} {...item} />
        ))}
      </div>
    </div>
  );
}

export function AnalyticsFeatures() {
  return (
    <div className="m-12 px-12 pt-4">
      <h2 className="text-lg">
        Feature Roadmap
      </h2>

      <Legend />

      {featureSections.map((feature, index) => (
        <Section key={index} {...feature} />
      ))}
    </div>
  );
}