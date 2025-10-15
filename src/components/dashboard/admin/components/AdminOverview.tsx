import React from 'react';
import { Card, CardContent } from '@components/ui/card';

export default function AdminOverview({ stats }: { stats: Array<{ name: string; value: string; change: string }> }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <Card key={stat.name}>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-sm text-gray-500">{stat.name}</p>
            <p className="text-xs text-green-600 mt-2">{stat.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
