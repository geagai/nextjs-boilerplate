"use client";

import { useAgents } from '@/ai-agents/hooks/use-agents';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Bot, Brain } from 'lucide-react';

function renderAgentIcon(icon: any) {
  if (!icon) return <Bot className="w-6 h-6 text-muted-foreground" />;
  if (icon === 'Bot') return <Bot className="w-6 h-6" />;
  if (icon === 'Brain') return <Brain className="w-6 h-6" />;
  // Emoji or fallback
  if (typeof icon === 'string' && /\p{Emoji}/u.test(icon)) {
    return <span className="w-6 h-6 inline-block text-lg">{icon}</span>;
  }
  return <span className="w-6 h-6 inline-block text-lg">{icon}</span>;
}

export default function MyAgentsTable() {
  const { agents, isLoading, error } = useAgents({ onlyPublic: false });

  if (isLoading) {
    return <div className="bg-muted/50 p-8 rounded-lg text-center text-muted-foreground">Loading agents...</div>;
  }
  if (error) {
    return <div className="bg-destructive/20 p-8 rounded-lg text-center text-destructive">Error: {error}</div>;
  }
  if (!agents.length) {
    return <div className="bg-muted/50 p-8 rounded-lg text-center text-muted-foreground">No agents found.</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12" />
          <TableHead>Public</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Agent Name</TableHead>
          <TableHead>API URL</TableHead>
          <TableHead className="w-12" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {agents.map((agent) => (
          <TableRow key={agent.id}>
            <TableCell>{renderAgentIcon(agent.icon)}</TableCell>
            <TableCell>{agent.is_public ? 'Yes' : 'No'}</TableCell>
            <TableCell>
              {agent.category
                ? agent.category.split(',').map((cat: string, idx: number) => (
                    <div key={idx}>{cat.trim()}</div>
                  ))
                : '-'}
            </TableCell>
            <TableCell>{agent.name}</TableCell>
            <TableCell>
              <span className="truncate max-w-[180px] inline-block align-middle" title={agent.api_url}>{agent.api_url}</span>
            </TableCell>
            <TableCell>
              <Link href={`/edit-agent/${agent.id}`}>
                <Button size="sm" variant="outline">Edit</Button>
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
} 