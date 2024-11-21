import React, {  useState } from 'react';
import {

  LinkFormData,
  Link as LinkType,
  SocialPlatform,
} from '../../../types';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

import {
  Github,
  // Twitter,
  Linkedin,
  Instagram,
  Facebook,
  Youtube,
  Globe,
  X,
} from 'lucide-react';
// import { platform } from 'os';



export const SOCIAL_PLATFORMS: SocialPlatform[] = [
  {
    id: 'github',
    name: 'GitHub',
    icon: Github,
    placeholder: 'https://github.com/username',
    baseUrl: 'https://github.com/'
  },
  {
    id: 'x',
    name: 'X',
    icon: X,
    placeholder: 'https://x.com/username',
    baseUrl: 'https://x.com/'
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: Linkedin,
    placeholder: 'https://linkedin.com/in/username',
    baseUrl: 'https://linkedin.com/in/'
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: Instagram,
    placeholder: 'https://instagram.com/username',
    baseUrl: 'https://instagram.com/'
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: Facebook,
    placeholder: 'https://facebook.com/username',
    baseUrl: 'https://facebook.com/'
  },
  {
    id: 'youtube',
    name: 'YouTube',
    icon: Youtube,
    placeholder: 'https://youtube.com/@username',
    baseUrl: 'https://youtube.com/@'
  },
  {
    id: 'website',
    name: 'Website',
    icon: Globe,
    placeholder: 'https://yourwebsite.com',
    baseUrl: ''
  }
];

interface SocialLinkFormProps {
  platform: SocialPlatform;
  currentLink?: LinkType;
  onSubmit: (data: LinkFormData) => void;
}

export const SocialLinkForm: React.FC<SocialLinkFormProps> = ({ platform, currentLink, onSubmit }) => {
  const [url, setUrl] = useState(currentLink?.url || '');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) {
      toast({
        title: "Error",
        description: "Please enter a valid URL",
        variant: "destructive"
      });
      return;
    }
    onSubmit({
      title: platform.name,
      url: url.startsWith('http') ? url : `https://${url}`
    });
  };

  return (

    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <platform.icon className="h-5 w-5" />
          <label className="text-sm font-medium">{platform.name} URL</label>
        </div>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder={platform.placeholder}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
        />
      </div>

      <Button type="submit" className="w-full">
        Save Link
      </Button>
    </form>
  );
};