import React, { useState, useEffect } from 'react';
import { PROJECTS, PIN_CODE } from '../constants';
import { db } from '../services/db';
import { ProjectStats, Evaluation } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { Trash2, Download, LogOut, AlertTriangle, Lock, TrendingUp, Users, Award, Sheet, ExternalLink } from 'lucide-react';

interface AdminDashboardProps {
  onLogout: () => void;
  isAuthenticated: boolean;
  onLoginSuccess: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ isAuthenticated, onLoginSuccess, onLogout }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [stats, setStats] = useState<ProjectStats[]>([]);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  
  // Estado de conexión
  const [sheetStatus, setSheetStatus] = useState<{connected: boolean, error: string | null}>({
    connected: false,
    error: null
  });

  useEffect(() => {
    let unsubscribe: () => void;
    
    const handleStatus = (e: any) => {
        setSheetStatus(e.detail);
    };
    window.addEventListener('sheet-status', handleStatus);

    if (isAuthenticated) {
      unsubscribe = db.subscribeToEvaluations((data) => {
        setEvaluations(data);
        calculateStats(data);
      });
    }
    return () => {
      if (unsubscribe) unsubscribe();
      window.removeEventListener('sheet-status', handleStatus);
    };
  }, [isAuthenticated]);

  const calculateStats = (evals: Evaluation[]) => {
    const calculatedStats: ProjectStats[] = PROJECTS.map(p => {
      const pEvaluations = evals.filter(e => e.projectId === p.id);
      const total = pEvaluations.length;
      
      if (total === 0) {
        return {
          id: p.id,
          name: p.name,
          totalVotes: 0,
          avgInnovation: 0,
          avgDesign: 0,
          avgFunctionality: 0,
          payYes: 0,
          payNo: 0
        };
      }

      const sumInn = pEvaluations.reduce((acc, curr) => acc + curr.innovation, 0);
      const sumDes = pEvaluations.reduce((acc, curr) => acc + curr.design, 0);
      const sumFun = pEvaluations.reduce((acc, curr) => acc + curr.functionality, 0);
      const payYes = pEvaluations.filter(e => e.wouldPay).length;

      return {
        id: p.id,
        name: p.name,
        totalVotes: total,
        avgInnovation: parseFloat((sumInn / total).toFixed(1)),
        avgDesign: parseFloat((sumDes / total).toFixed(1)),
        avgFunctionality: parseFloat((sumFun / total).toFixed(1)),
        payYes,
        payNo: total - payYes
      };
    });

    setStats(calculatedStats);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === PIN_CODE) {
      onLoginSuccess();
      setError('');
    } else {
      setError('PIN Incorrecto');
      setPin('');
    }
  };

  const handleReset = async () => {
    await db.clearDatabase();
    setShowConfirmReset(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-md glass-card p-10 rounded-[2.5rem]">
          <div className="flex justify-center mb-8">
            <div className="p-6 bg-slate-900 rounded-2xl shadow-xl shadow-slate-300">
              <Lock className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-black text-center mb-2 text-slate-900 tracking-tight">Acceso Admin</h2>
          <p className="text-center text-slate-500 mb-8 font-medium">Introduce el PIN de seguridad</p>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <input
                type="password"
                inputMode="numeric"
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full text-center text-5xl font-bold tracking-[0.5em] py-6 border-b-4 border-slate-200 focus:border-indigo-600 transition-colors bg-transparent outline-none text-slate-800 placeholder-slate-200"
                placeholder="••••"
                autoFocus
              />
            </div>
            {error && <p className="text-red-500 text-sm text-center font-bold bg-red-50 py-3 rounded-xl">{error}</p>}
            <button
              type="submit"
              className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold text-lg hover:bg-indigo-600 transition-all shadow-xl hover:shadow-indigo-500/30"
            >
              Entrar al Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  const totalVotesGlobal = evaluations.length;
  const bestProject = [...stats].sort((a, b) => {
    const scoreA = a.totalVotes > 0 ? (a.avgInnovation + a.avgDesign + a.avgFunctionality) / 3 + (a.payYes / a.totalVotes) * 2 : 0;
    const scoreB = b.totalVotes > 0 ? (b.avgInnovation + b.avgDesign + b.avgFunctionality) / 3 + (b.payYes / b.totalVotes) * 2 : 0;
    return scoreB - scoreA;
  })[0];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 pb-20">
      
      {/* Header Admin */}
      <div className="glass-card p-6 rounded-[2rem] flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Resultados en Vivo</h1>
          
          <div className="flex flex-wrap items-center gap-2 mt-2">
            {sheetStatus.connected ? (
                <div className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100">
                    <Sheet className="w-3 h-3 mr-2" />
                    <span className="text-xs font-bold uppercase tracking-wide">Google Sheets Conectado</span>
                </div>
            ) : (
                <div 
                    className="flex items-center text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-100"
                >
                    <AlertTriangle className="w-3 h-3 mr-2" />
                    <span className="text-xs font-bold uppercase tracking-wide">Sin conexión a Sheet</span>
                </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <a 
            href="https://docs.google.com/spreadsheets"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center px-5 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Abrir Sheet
          </a>
          <button 
            onClick={() => db.exportData()}
            className="flex items-center px-5 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4 mr-2" />
            CSV Local
          </button>
          <button 
            onClick={() => setShowConfirmReset(true)}
            className="flex items-center px-5 py-3 bg-red-50 border border-red-100 rounded-xl text-sm font-bold text-red-600 hover:bg-red-100 transition-colors"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Limpiar Local
          </button>
          <button 
            onClick={onLogout}
            className="flex items-center px-5 py-3 bg-slate-800 text-white rounded-xl text-sm font-bold hover:bg-slate-900 transition-colors shadow-lg"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Salir
          </button>
        </div>
      </div>

      {showConfirmReset && (
        <div className="bg-red-500 text-white p-6 rounded-3xl flex flex-col sm:flex-row justify-between items-center animate-in fade-in slide-in-from-top-2 gap-4 shadow-xl shadow-red-200">
          <div className="flex items-center">
            <div className="bg-white/20 p-3 rounded-full mr-4">
               <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-bold text-xl">¿Estás seguro?</p>
              <p className="text-white/80">Esto borrará la vista local. Recuerda limpiar el Excel manualmente.</p>
            </div>
          </div>
          <div className="flex space-x-3 w-full sm:w-auto">
            <button onClick={() => setShowConfirmReset(false)} className="flex-1 sm:flex-none px-6 py-3 bg-white/10 rounded-xl font-bold hover:bg-white/20">Cancelar</button>
            <button onClick={handleReset} className="flex-1 sm:flex-none px-6 py-3 bg-white text-red-600 rounded-xl font-bold hover:bg-red-50 shadow-md">Sí, Borrar</button>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="relative overflow-hidden bg-slate-900 p-8 rounded-[2rem] shadow-2xl text-white group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full blur-[60px] opacity-40 group-hover:opacity-60 transition-opacity"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
               <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Ganador Actual</p>
               <Award className="w-6 h-6 text-yellow-400" />
            </div>
            <h3 className="text-3xl font-black truncate">{bestProject && bestProject.totalVotes > 0 ? bestProject.name : '—'}</h3>
            <div className="mt-4 inline-flex items-center bg-white/10 px-3 py-1 rounded-lg backdrop-blur-md">
                <span className="text-sm font-bold mr-2">Score:</span>
                <span className="text-xl font-black text-yellow-400">
                    {bestProject && bestProject.totalVotes > 0 ? 
                        ((bestProject.avgInnovation + bestProject.avgDesign + bestProject.avgFunctionality)/3).toFixed(1) 
                        : '0.0'}
                </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
           <div className="flex justify-between items-start mb-2">
               <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Participación</p>
               <Users className="w-6 h-6 text-indigo-500" />
            </div>
            <h3 className="text-4xl font-black text-slate-900">{totalVotesGlobal}</h3>
            <p className="text-slate-500 text-sm mt-2 font-medium">Votos totales registrados</p>
        </div>

        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
           <div className="flex justify-between items-start mb-2">
               <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Aceptación</p>
               <TrendingUp className="w-6 h-6 text-green-500" />
            </div>
            <h3 className="text-4xl font-black text-slate-900">
              {evaluations.length > 0 ? Math.round((evaluations.filter(e => e.wouldPay).length / evaluations.length) * 100) : 0}%
            </h3>
            <p className="text-slate-500 text-sm mt-2 font-medium">Intención de compra global</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Popularity Chart */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
            <span className="w-2 h-8 bg-indigo-500 rounded-full mr-3"></span>
            Votos Totales
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats} layout="vertical" margin={{ left: 0, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" allowDecimals={false} hide />
                <YAxis 
                   dataKey="name" 
                   type="category" 
                   width={100} 
                   tick={{fontSize: 11, fontWeight: 700, fill: '#64748b'}} 
                   axisLine={false}
                   tickLine={false}
                />
                <Tooltip 
                   cursor={{fill: '#f8fafc'}} 
                   contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 'bold'}}
                />
                <Bar dataKey="totalVotes" radius={[0, 8, 8, 0]} barSize={28}>
                   {stats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#6366f1', '#ec4899', '#8b5cf6', '#10b981', '#f59e0b'][index % 5]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quality Metrics */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
            <span className="w-2 h-8 bg-purple-500 rounded-full mr-3"></span>
            Calidad (Innovación)
          </h3>
          <div className="h-80">
             <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats} margin={{top: 20}}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 600}} interval={0} angle={-45} textAnchor="end" height={80} tickLine={false} axisLine={false} />
                <YAxis domain={[0, 5]} hide />
                <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 'bold'}} />
                <Bar dataKey="avgInnovation" fill="#8b5cf6" radius={[8, 8, 0, 0]} barSize={36}>
                   <Cell fill="#8b5cf6" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-8 py-8 border-b border-slate-50">
          <h3 className="text-xl font-bold text-slate-900">Análisis Comercial Detallado</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-8 py-5 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Proyecto</th>
                <th className="px-8 py-5 text-center text-xs font-black text-green-600 uppercase tracking-widest">Lo Compran</th>
                <th className="px-8 py-5 text-center text-xs font-black text-red-400 uppercase tracking-widest">No Compran</th>
                <th className="px-8 py-5 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Barra de Éxito</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {stats.map((stat) => {
                const percent = stat.totalVotes > 0 ? Math.round((stat.payYes / stat.totalVotes) * 100) : 0;
                return (
                  <tr key={stat.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-8 py-5 text-sm font-bold text-slate-800">{stat.name}</td>
                    <td className="px-8 py-5 text-center">
                        <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-lg font-bold text-sm">
                            {stat.payYes}
                        </span>
                    </td>
                    <td className="px-8 py-5 text-center">
                        <span className="inline-block px-3 py-1 bg-red-50 text-red-400 rounded-lg font-bold text-sm">
                            {stat.payNo}
                        </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center w-full max-w-xs">
                        <span className="text-xs font-bold w-10 mr-2 text-slate-400">{percent}%</span>
                        <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                             className={`h-full rounded-full transition-all duration-500 ${percent > 60 ? 'bg-gradient-to-r from-green-400 to-green-600' : percent > 30 ? 'bg-orange-400' : 'bg-red-400'}`} 
                             style={{ width: `${percent}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};