"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Badge, Button } from "@celebrai/ui";
import type { VendorRFP } from "@celebrai/schemas";
import { ExternalLink, Mail, Phone, Star } from "lucide-react";

const STATUS_VARIANTS = {
  draft: "neutral",
  sent: "default",
  responded: "warning",
  shortlisted: "success",
  contracted: "success",
  rejected: "danger",
} as const satisfies Record<VendorRFP["status"], "neutral" | "default" | "warning" | "success" | "danger">;

interface VendorCardProps {
  rfp: VendorRFP;
  onViewChecklist?: (rfp: VendorRFP) => void;
}

export function VendorCard({ rfp, onViewChecklist }: VendorCardProps) {
  const { vendor } = rfp;
  const answeredCount = rfp.checklistItems.filter((i) => i.answered).length;
  const totalCount = rfp.checklistItems.length;

  return (
    <Card variant="bordered" className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div>
          <CardTitle>{vendor.name}</CardTitle>
          <CardDescription className="capitalize mt-0.5">
            {vendor.category.replace("-", " ")} · {vendor.city}
          </CardDescription>
        </div>
        <Badge variant={STATUS_VARIANTS[rfp.status]}>
          {rfp.status.charAt(0).toUpperCase() + rfp.status.slice(1)}
        </Badge>
      </CardHeader>

      <CardContent>
        <div className="flex flex-wrap gap-4 text-sm text-slate-600">
          {vendor.rating && (
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span>{vendor.rating.toFixed(1)}</span>
            </div>
          )}
          <Badge variant="neutral" className="capitalize">
            {vendor.priceRange.replace("-", " ")}
          </Badge>
        </div>

        {/* Checklist Progress */}
        <div className="mt-3">
          <div className="flex justify-between text-xs text-slate-500 mb-1">
            <span>RFP Progress</span>
            <span>{answeredCount}/{totalCount}</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-violet-600 transition-all"
              style={{ width: `${(answeredCount / totalCount) * 100}%` }}
            />
          </div>
        </div>

        {/* Contact */}
        <div className="mt-3 flex gap-3">
          {vendor.email && (
            <a
              href={`mailto:${vendor.email}`}
              className="flex items-center gap-1 text-xs text-slate-500 hover:text-violet-600 transition-colors"
            >
              <Mail className="h-3 w-3" />
              Email
            </a>
          )}
          {vendor.phone && (
            <a
              href={`tel:${vendor.phone}`}
              className="flex items-center gap-1 text-xs text-slate-500 hover:text-violet-600 transition-colors"
            >
              <Phone className="h-3 w-3" />
              Call
            </a>
          )}
          {vendor.website && (
            <a
              href={vendor.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-slate-500 hover:text-violet-600 transition-colors"
            >
              <ExternalLink className="h-3 w-3" />
              Website
            </a>
          )}
        </div>
      </CardContent>

      <CardFooter className="gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onViewChecklist?.(rfp)}
          className="flex-1"
        >
          View Checklist ({answeredCount}/{totalCount})
        </Button>
      </CardFooter>
    </Card>
  );
}
