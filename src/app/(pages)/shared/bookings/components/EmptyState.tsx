import React from 'react';
import type { EmptyStateProps } from '../types/EmptyStateProps';

export const EmptyState: React.FC<EmptyStateProps> = ({ title, description, icon }) => {
  return (
    <div className="text-center py-12">
      {icon && <div className="mb-4 flex justify-center opacity-50">{icon}</div>}
      <h3 className="text-lg font-semibold text-muted-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground/70">{description}</p>
    </div>
  );
};
