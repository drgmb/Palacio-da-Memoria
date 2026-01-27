import React from 'react';
import { RoomData } from '../types';

interface RoomCardProps {
  room: RoomData;
  index: number;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, index }) => {
  return (
    <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-xl mb-12 flex flex-col md:flex-row transition-all hover:shadow-2xl hover:border-slate-600">
      
      {/* Visual Section */}
      <div className="md:w-1/2 lg:w-5/12 relative min-h-[300px] bg-slate-900 flex items-center justify-center overflow-hidden group">
        
        {room.isGeneratingImage ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-purple-300 font-serif animate-pulse">
              Painting the memory...<br/>
              <span className="text-xs text-slate-500">(Generating Image)</span>
            </p>
          </div>
        ) : room.generatedImageBase64 ? (
          <img 
            src={room.generatedImageBase64} 
            alt={`Memory Palace - ${room.roomName}`}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
           <div className="flex flex-col items-center justify-center p-8 text-center text-slate-500">
             <span className="text-4xl mb-2">📷</span>
             <p>Image unavailable</p>
           </div>
        )}
        
        {/* Room Label Badge */}
        <div className="absolute top-4 left-4 bg-purple-900/90 text-purple-100 px-3 py-1 rounded-full text-sm font-bold border border-purple-500/30 backdrop-blur-md z-10">
          {index + 1}. {room.roomName}
        </div>
      </div>

      {/* Content Section */}
      <div className="md:w-1/2 lg:w-7/12 p-6 md:p-8 flex flex-col justify-between">
        <div>
          <h3 className="text-2xl font-bold text-white mb-4 brand-font border-b border-slate-700 pb-2">
            A Cena
          </h3>
          <p className="text-slate-300 leading-relaxed text-lg mb-8 italic">
            "{room.narrative}"
          </p>

          <div className="bg-slate-900/50 rounded-lg p-5 border border-slate-700/50">
            <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              Dados Técnicos Preservados
            </h4>
            <ul className="space-y-2">
              {room.technicalInfo.map((info, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-slate-400">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0"></span>
                  <span>{info}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-slate-700/50 text-xs text-slate-600 font-mono">
           Prompt visual: {room.imagePrompt.substring(0, 100)}...
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
