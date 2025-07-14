"use client";
import { useEffect, useState } from 'react';
import AddonMissing from '../../agents/AddonMissing';

export default function EditAgentRoute() {
  const [EditAgentPage, setEditAgentPage] = useState<React.ComponentType | null>(null);
  useEffect(() => {
    let isMounted = true;
    import('@/ai-agents/edit-agent/[id]/page')
      .then(mod => {
        if (isMounted) {
          setEditAgentPage(mod.default || null);
        }
      })
      .catch(() => {
        if (isMounted) setEditAgentPage(null);
      });
    return () => { isMounted = false; };
  }, []);

  if (EditAgentPage === null) {
    return (
      <AddonMissing addonName="AI Agents" purchaseUrl="https://www.geag.ai/ai-agents-addon" />
    );
  }
  if (!EditAgentPage) {
    return <div>Loading...</div>;
  }
  return <EditAgentPage />;
} 