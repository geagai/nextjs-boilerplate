'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Copy } from 'lucide-react';
import * as Icons from 'lucide-react';

interface CopyAgentModalProps {
  agent: any;
  onSuccess?: () => void;
}

export function CopyAgentModal({ agent, onSuccess }: CopyAgentModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: agent.name,
    description: agent.description || '',
    api_url: agent.api_url || '',
    category: agent.category || '',
    is_public: agent.is_public || false,
    icon: agent.config?.options?.icon || 'Bot'
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/agents/copy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sourceAgentId: agent.id,
          ...formData
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to copy agent');
      }

      toast({
        title: 'Success',
        description: 'Agent copied successfully',
      });

      setOpen(false);
      onSuccess?.();
      // Redirect to the edit page of the newly created agent
      window.location.href = `/edit-agent/${data.data.id}`;
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to copy agent',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="default" className="min-w-[90px]">
          <Copy className="w-4 h-4 mr-1" />
          Copy
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Copy Agent</DialogTitle>
          <DialogDescription>
            Create a copy of "{agent.name}" with your modifications.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Agent Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter agent name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Agent Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter agent description"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="api_url">API URL</Label>
            <Input
              id="api_url"
              value={formData.api_url}
              onChange={(e) => handleInputChange('api_url', e.target.value)}
              placeholder="Enter API URL"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              placeholder="Enter category"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="is_public">Public Agent</Label>
              <Switch
                id="is_public"
                checked={formData.is_public}
                onCheckedChange={(checked) => handleInputChange('is_public', checked)}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Make this agent visible to all users
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="icon">Icon</Label>
            <Select value={formData.icon} onValueChange={(value) => handleInputChange('icon', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select an icon" />
              </SelectTrigger>
              <SelectContent>
                {[
                  'Bot', 'MessageSquare', 'Brain', 'Zap', 'Code', 'PenTool', 'BarChart3', 
                  'TrendingUp', 'Search', 'Shield', 'Heart', 'Star', 'Lightbulb', 'Target'
                ].map((icon) => {
                  const IconComponent = (Icons as any)[icon];
                  return (
                    <SelectItem key={icon} value={icon}>
                      <div className="flex items-center gap-2">
                        <IconComponent className="w-4 h-4" />
                        {icon}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Copying...' : 'Copy Agent'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 