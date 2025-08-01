"use client";

import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Bot, Brain } from 'lucide-react';
import { CopyAgentModal } from '../components/copy-agent-modal';

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

interface MyAgentsTableProps {
  agents: any[];
  adminSettings?: any;
}

export default function MyAgentsTable({ agents, adminSettings }: MyAgentsTableProps) {
  if (!agents || agents.length === 0) {
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
          <TableHead className="w-32" />
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
              <div className="flex gap-2">
                <Link href={`/edit-agent/${agent.id}`}>
                  <Button size="sm" variant="outline" className="min-w-[90px]">Edit</Button>
                </Link>
                <Link href={`/agent/${agent.id}`} target="_blank" rel="noopener noreferrer">
                  <Button size="sm" variant="default" className="min-w-[90px]">View</Button>
                </Link>
                <CopyAgentModal agent={agent} />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
} 