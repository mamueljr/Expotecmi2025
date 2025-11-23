import React from 'react';
import { Project } from '../types';
import { PROJECTS, CATEGORY_COLORS } from '../constants';
import { ArrowRight, Users, Sparkles, Trophy } from 'lucide-react';

interface HomeProps {
  onSelectProject: (id: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onSelectProject }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:py-20 space-y-16">
      
      {/* Hero Section */}
      <div className="relative text-center max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-indigo-500 rounded-full blur-[120px] opacity-20 pointer-events-none"></div>
        
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-600 shadow-sm text-sm font-bold mb-8 hover:scale-105 transition-transform cursor-default">
          <span className="flex h-2 w-2 rounded-full bg-indigo-500 mr-2 animate-pulse"></span>
          EXPOTECMI 2025
        </div>
        
        <h1 className="text-6xl sm:text-7xl font-black text-slate-900 mb-6 tracking-tighter leading-[0.9]">
          Evalúa el <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            Talento Futuro
          </span>
        </h1>
        
        <p className="text-lg sm:text-xl text-slate-500 leading-relaxed max-w-xl mx-auto font-medium">
          Tu voto decide quiénes son los innovadores del mañana. Explora los proyectos y califica.
        </p>
      </div>

      {/* Grid de Proyectos */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {PROJECTS.map((project, index) => (
          <div 
            key={project.id}
            onClick={() => onSelectProject(project.id)}
            className="group relative bg-white rounded-[2rem] p-1.5 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-300 cursor-pointer hover:-translate-y-2"
          >
            <div className="relative h-full bg-slate-50 rounded-[1.7rem] p-8 flex flex-col justify-between overflow-hidden border border-slate-100 group-hover:bg-white group-hover:border-white transition-colors">
              
              {/* Decorative Circle */}
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-slate-200/50 rounded-full group-hover:bg-indigo-50 transition-colors duration-500 blur-2xl"></div>

              <div>
                <div className="flex justify-between items-start mb-8 relative z-10">
                  <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${CATEGORY_COLORS[project.category] || 'bg-gray-100 text-gray-800'}`}>
                    {project.category}
                  </span>
                  <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900 transition-all duration-300 shadow-sm">
                      <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
                
                <h3 className="text-3xl font-black text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors tracking-tight leading-none">
                  {project.name}
                </h3>
              </div>
              
              <div className="mt-8 pt-6 border-t border-slate-200/50">
                <div className="flex items-center text-sm font-bold text-slate-400 group-hover:text-slate-600 transition-colors">
                  <Users className="w-4 h-4 mr-2" />
                  <span className="truncate">{project.members.join(', ')}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};