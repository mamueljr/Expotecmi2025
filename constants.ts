import { Project } from './types';

export const PIN_CODE = "4621";

export const PROJECTS: Project[] = [
  {
    id: 'fate-bound',
    name: 'FATE BOUND',
    category: 'JUEGO',
    members: ['Nath', 'Kath']
  },
  {
    id: 'lebab',
    name: 'LEBAB',
    category: 'ERP',
    members: ['Luis', 'Kevin']
  },
  {
    id: 'zero-impact',
    name: 'ZERO IMPACT',
    category: 'SOCIAL',
    members: ['Santi']
  },
  {
    id: 'ihira',
    name: 'IHIRA',
    category: 'SOCIAL',
    members: ['Raul', 'Miguel', 'Elias']
  },
  {
    id: 'edu-sched',
    name: 'EDU SCHED',
    category: 'PROF',
    members: ['Angel', 'Luis', 'Arturo']
  },
  {
    id: 'lia',
    name: 'LIA',
    category: 'ML',
    members: ['Laila']
  },
  {
    id: 'photo-algo',
    name: 'PHOTO ALGO',
    category: 'SOCIAL',
    members: ['Osvaldo', 'Adrian']
  }
];

export const CATEGORY_COLORS: Record<string, string> = {
  'JUEGO': 'bg-purple-100 text-purple-800 border-purple-200',
  'ERP': 'bg-blue-100 text-blue-800 border-blue-200',
  'SOCIAL': 'bg-green-100 text-green-800 border-green-200',
  'PROF': 'bg-amber-100 text-amber-800 border-amber-200',
  'ML': 'bg-rose-100 text-rose-800 border-rose-200',
};