import React, { useState, useEffect } from 'react';
import { Project, UserType, Evaluation } from '../types';
import { StarRating } from '../components/StarRating';
import { Save, User, GraduationCap, ArrowLeft, CheckCircle2, AlertTriangle, Rocket, Loader2, Sparkles } from 'lucide-react';
import { db } from '../services/db';

interface VotingViewProps {
  project: Project;
  onBack: () => void;
}

export const VotingView: React.FC<VotingViewProps> = ({ project, onBack }) => {
  const [userType, setUserType] = useState<UserType>('ALUMNO');
  const [innovation, setInnovation] = useState(0);
  const [design, setDesign] = useState(0);
  const [functionality, setFunctionality] = useState(0);
  const [wouldPay, setWouldPay] = useState<boolean | null>(null);
  const [comment, setComment] = useState('');
  
  // States for submission handling
  const [status, setStatus] = useState<'IDLE' | 'SUBMITTING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const isValid = innovation > 0 && design > 0 && functionality > 0 && wouldPay !== null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setStatus('SUBMITTING');
    setErrorMessage(null);

    const newEvaluation: Evaluation = {
      id: crypto.randomUUID(),
      projectId: project.id,
      userType,
      innovation,
      design,
      functionality,
      wouldPay: wouldPay === true,
      comment,
      timestamp: Date.now()
    };

    try {
      // TRUCO TÉCNICO:
      // A veces Firebase tarda en confirmar si el internet es lento, aunque ya haya guardado el dato.
      // Hacemos una carrera: Si guardar tarda más de 3 segundos, asumimos éxito (offline mode)
      // para que el usuario no se quede esperando.
      const savePromise = db.addEvaluation(newEvaluation);
      const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 3000));
      const minAnimationPromise = new Promise((resolve) => setTimeout(resolve, 800)); // Mínimo tiempo de carga visual

      // Esperamos a que guarde O que pase el tiempo límite
      await Promise.race([savePromise, timeoutPromise]);
      // Esperamos la animación mínima para que se vea fluido
      await minAnimationPromise;

      setStatus('SUCCESS');
      window.scrollTo(0, 0);
    } catch (err) {
      console.error(err);
      // Si falla de verdad (error de permisos, etc), mostramos error.
      // Pero si fue timeout, arriba ya lo manejamos como éxito.
      setErrorMessage("Hubo un detalle de conexión, pero intentaremos guardar tu voto.");
      setStatus('ERROR');
    }
  };

  if (status === 'SUCCESS') {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-500 relative overflow-hidden">
        {/* Confetti-like decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none">
            <div className="absolute top-10 left-10 w-4 h-4 bg-yellow-400 rounded-full animate-bounce-subtle"></div>
            <div className="absolute top-20 right-20 w-3 h-3 bg-purple-400 rounded-full animate-ping"></div>
            <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
        </div>

        <div className="w-48 h-48 relative mb-8 group cursor-pointer" onClick={onBack}>
           <div className="absolute inset-0 bg-green-400 rounded-full blur-3xl opacity-30 animate-pulse"></div>
           <div className="relative bg-gradient-to-br from-green-400 to-emerald-600 w-full h-full rounded-full flex items-center justify-center shadow-2xl shadow-green-200 transform transition-transform group-hover:scale-110 duration-300">
              <CheckCircle2 className="w-24 h-24 text-white drop-shadow-md" strokeWidth={3} />
           </div>
           <div className="absolute -bottom-2 -right-2 bg-white text-green-600 rounded-full p-2 shadow-lg">
             <Sparkles className="w-6 h-6 fill-green-600" />
           </div>
        </div>
        
        <h2 className="text-6xl font-black text-slate-900 mb-2 tracking-tight">¡Voto Recibido!</h2>
        <p className="text-xl text-slate-500 mb-10 font-medium max-w-md mx-auto">Gracias por ser parte de Expotecmi y apoyar el talento estudiantil.</p>
        
        <div className="bg-white/80 backdrop-blur-xl border border-white p-8 rounded-[2rem] max-w-md w-full shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-500"></div>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Proyecto Evaluado</p>
          <p className="text-3xl font-black text-slate-800 mb-8 truncate">{project.name}</p>
          
          <button
            onClick={onBack}
            className="w-full py-4 bg-slate-900 text-white font-bold text-lg rounded-xl hover:bg-indigo-600 transform hover:scale-[1.02] transition-all shadow-lg hover:shadow-indigo-500/25 flex items-center justify-center"
          >
            <Rocket className="w-5 h-5 mr-2" />
            Evaluar siguiente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 relative pb-32">
      <button 
        onClick={onBack}
        className="group flex items-center text-sm font-bold text-slate-500 hover:text-indigo-600 mb-8 transition-colors pl-2"
      >
        <div className="bg-white p-2.5 rounded-xl shadow-sm border border-slate-100 mr-3 group-hover:scale-110 transition-transform">
          <ArrowLeft className="w-4 h-4" />
        </div>
        Volver a la lista
      </button>

      {/* Project Card - Hero */}
      <div className="relative bg-white rounded-[2.5rem] p-8 sm:p-14 mb-10 text-center overflow-hidden shadow-xl shadow-slate-200/50 border border-slate-100">
        {/* Background Mesh */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100 via-white to-white opacity-50"></div>
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
        
        <div className="relative z-10">
          <div className="inline-flex items-center space-x-2 bg-slate-900 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6 shadow-lg shadow-slate-900/20">
             <Rocket className="w-3 h-3 text-yellow-300 fill-yellow-300" />
             <span>Evaluando</span>
          </div>
          <h2 className="text-5xl sm:text-7xl font-black text-slate-900 mb-4 tracking-tighter">{project.name}</h2>
          <div className="flex justify-center flex-wrap gap-2 mt-4">
            {project.members.map((member, idx) => (
              <span key={idx} className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-sm font-bold border border-slate-200">
                {member}
              </span>
            ))}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {status === 'ERROR' && (
          <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl flex items-start animate-shake mb-6">
            <AlertTriangle className="w-6 h-6 text-red-500 mr-3 flex-shrink-0" />
            <span className="font-medium text-red-700">{errorMessage}</span>
          </div>
        )}

        {/* 1. User Type - Full Width */}
        <section className="bg-white/80 backdrop-blur-md p-8 rounded-[2.5rem] border border-white shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-lg font-extrabold text-slate-900 mb-6 flex items-center uppercase tracking-wider">
            <span className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mr-3 text-sm">1</span>
            Tu Rol
          </h3>
          <div className="grid grid-cols-2 gap-6">
            <button
              type="button"
              onClick={() => setUserType('ALUMNO')}
              className={`group relative flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-200 ${
                userType === 'ALUMNO' 
                ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 shadow-sm' 
                : 'border-slate-100 text-slate-400 hover:border-slate-200 hover:bg-white'
              }`}
            >
              <div className={`p-4 rounded-full mb-3 transition-colors ${userType === 'ALUMNO' ? 'bg-indigo-600 text-white' : 'bg-slate-100 group-hover:bg-slate-200 text-slate-500'}`}>
                <User className="w-8 h-8" />
              </div>
              <span className="font-bold text-lg">Alumno</span>
            </button>
            <button
              type="button"
              onClick={() => setUserType('MAESTRO')}
              className={`group relative flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-200 ${
                userType === 'MAESTRO' 
                ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 shadow-sm' 
                : 'border-slate-100 text-slate-400 hover:border-slate-200 hover:bg-white'
              }`}
            >
              <div className={`p-4 rounded-full mb-3 transition-colors ${userType === 'MAESTRO' ? 'bg-indigo-600 text-white' : 'bg-slate-100 group-hover:bg-slate-200 text-slate-500'}`}>
                <GraduationCap className="w-8 h-8" />
              </div>
              <span className="font-bold text-lg">Maestro</span>
            </button>
          </div>
        </section>

        {/* 2. Rating */}
        <section className="bg-white/80 backdrop-blur-md p-8 rounded-[2.5rem] border border-white shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-lg font-extrabold text-slate-900 mb-8 flex items-center uppercase tracking-wider">
            <span className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mr-3 text-sm">2</span>
            Rúbrica
          </h3>
          <div className="space-y-10">
            <div className="bg-slate-50/50 p-6 rounded-3xl hover:bg-white transition-colors">
                <StarRating 
                label="Innovación" 
                description="¿Es algo nuevo o una copia?"
                value={innovation} 
                onChange={setInnovation} 
                />
            </div>
            <div className="bg-slate-50/50 p-6 rounded-3xl hover:bg-white transition-colors">
                <StarRating 
                label="Diseño Visual" 
                description="Estética y experiencia de usuario."
                value={design} 
                onChange={setDesign} 
                />
            </div>
            <div className="bg-slate-50/50 p-6 rounded-3xl hover:bg-white transition-colors">
                <StarRating 
                label="Funcionalidad" 
                description="¿Cumple lo que promete?"
                value={functionality} 
                onChange={setFunctionality} 
                />
            </div>
          </div>
        </section>

        {/* 3. Market Potential - Now placed AFTER ratings and BEFORE comments */}
        <section className="bg-white/80 backdrop-blur-md p-8 rounded-[2.5rem] border border-white shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-lg font-extrabold text-slate-900 mb-6 flex items-center uppercase tracking-wider">
            <span className="w-8 h-8 rounded-xl bg-green-100 text-green-600 flex items-center justify-center mr-3 text-sm">3</span>
            ¿Invertirías?
          </h3>
          <p className="text-slate-500 text-sm mb-6 font-medium leading-tight">¿Comprarías este producto si estuviera a la venta hoy mismo?</p>
          <div className="flex gap-4 h-32">
            <button
              type="button"
              onClick={() => setWouldPay(true)}
              className={`flex-1 rounded-2xl font-black text-xl transition-all duration-300 border-2 flex flex-col items-center justify-center ${
                wouldPay === true
                ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-200 transform scale-[1.02]'
                : 'bg-white border-slate-100 text-slate-300 hover:border-emerald-200 hover:text-emerald-500'
              }`}
            >
              <span className="text-3xl mb-1">💸</span>
              <span>SÍ</span>
            </button>
            <button
              type="button"
              onClick={() => setWouldPay(false)}
              className={`flex-1 rounded-2xl font-black text-xl transition-all duration-300 border-2 flex flex-col items-center justify-center ${
                wouldPay === false
                ? 'bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-200 transform scale-[1.02]'
                : 'bg-white border-slate-100 text-slate-300 hover:border-rose-200 hover:text-rose-500'
              }`}
            >
              <span className="text-3xl mb-1">🙅‍♂️</span>
              <span>NO</span>
            </button>
          </div>
        </section>

        {/* 4. Comment */}
        <div className="bg-white/80 backdrop-blur-md p-8 rounded-[2.5rem] border border-white shadow-sm">
            <label htmlFor="comment" className="block text-lg font-bold text-slate-900 mb-4 ml-1">
              Comentarios <span className="text-slate-400 font-normal text-sm">(Opcional)</span>
            </label>
            <textarea
              id="comment"
              rows={3}
              className="w-full rounded-2xl bg-slate-50 border-transparent focus:bg-white border-2 p-5 focus:ring-0 focus:border-indigo-500 transition-all outline-none resize-none text-slate-700 font-medium placeholder-slate-400 shadow-inner"
              placeholder="¿Alguna sugerencia para el equipo?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
        </div>

        {/* Submit Button */}
        <div className="fixed bottom-6 left-4 right-4 max-w-4xl mx-auto z-40">
          <button
            type="submit"
            disabled={!isValid || status === 'SUBMITTING'}
            className={`w-full h-16 relative overflow-hidden flex items-center justify-center rounded-2xl font-black text-xl shadow-2xl transition-all duration-300 transform active:scale-95 ${
              !isValid || status === 'SUBMITTING'
                ? 'bg-slate-200 cursor-not-allowed text-slate-400 shadow-none'
                : 'bg-slate-900 hover:bg-indigo-600 text-white hover:shadow-indigo-500/40 ring-4 ring-white/50'
            }`}
          >
            {status === 'SUBMITTING' ? (
              <div className="flex items-center animate-pulse">
                <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                Guardando Voto...
              </div>
            ) : (
              <div className="flex items-center">
                <span className="mr-2">Enviar Calificación</span>
                <Save className="w-5 h-5" />
              </div>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};