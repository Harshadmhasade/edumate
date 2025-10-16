import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
}

export function StatsCard({ title, value, icon: Icon, iconColor, iconBg }: StatsCardProps) {
  return (
    <Card className="hover-lift glass-card border-0 overflow-hidden group" data-testid={`card-stats-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <CardContent className="pt-6">
        <div className="flex items-center">
          <div className={`p-3 ${iconBg} rounded-xl group-hover:scale-110 transition-transform duration-300 floating`}>
            <Icon className={`${iconColor}`} />
          </div>
          <div className="ml-4">
            <p className="text-sm text-slate-600 mb-1">{title}</p>
            <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-green-500 bg-clip-text text-transparent" data-testid={`text-${title.toLowerCase().replace(/\s+/g, '-')}-value`}>
              {value}
            </p>
          </div>
        </div>
        <div className="mt-4 h-1 bg-gradient-to-r from-purple-600 to-green-500 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
      </CardContent>
    </Card>
  );
}
