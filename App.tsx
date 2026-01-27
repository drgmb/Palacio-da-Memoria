import React, { useState } from 'react';
import InputForm from './components/InputForm';
import RoomCard from './components/RoomCard';
import { generatePalaceStructure, generateRoomImage } from './services/geminiService';
import { GenerationStatus, PalaceGenerationRequest, RoomData } from './types';
import JSZip from 'jszip';

const App: React.FC = () => {
  const [status, setStatus] = useState<GenerationStatus>(GenerationStatus.IDLE);
  const [rooms, setRooms] = useState<RoomData[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [requestData, setRequestData] = useState<PalaceGenerationRequest | null>(null);

  const handleGenerate = async (request: PalaceGenerationRequest) => {
    setStatus(GenerationStatus.PLANNING);
    setErrorMsg(null);
    setRooms([]);
    setRequestData(request);

    try {
      // Step 1: Generate Text Structure
      const generatedRooms = await generatePalaceStructure(request);
      
      // Initialize rooms with loading state for images
      const roomsWithLoading = generatedRooms.map(r => ({ ...r, isGeneratingImage: true }));
      setRooms(roomsWithLoading);
      setStatus(GenerationStatus.VISUALIZING);

      // Step 2: Generate Images (Parallel)
      const imagePromises = generatedRooms.map(async (room, index) => {
        const base64Image = await generateRoomImage(room.imagePrompt, request.visualStyle);
        
        setRooms(prevRooms => {
          const newRooms = [...prevRooms];
          if (newRooms[index]) {
            newRooms[index] = {
              ...newRooms[index],
              generatedImageBase64: base64Image,
              isGeneratingImage: false
            };
          }
          return newRooms;
        });
      });

      await Promise.all(imagePromises);
      setStatus(GenerationStatus.COMPLETED);

    } catch (err: any) {
      console.error(err);
      setErrorMsg("Failed to construct the palace. The architect is confused. Please try again.");
      setStatus(GenerationStatus.ERROR);
    }
  };

  const downloadPackage = async () => {
    if (!requestData || rooms.length === 0) return;

    const zip = new JSZip();
    const folderName = requestData.theme.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    
    // Create images folder inside zip
    const imgFolder = zip.folder("images");
    
    let mdContent = `# ${requestData.theme}\n\n`;
    mdContent += `**Style:** ${requestData.visualStyle}\n\n`;
    mdContent += `---\n\n`;

    rooms.forEach((room, index) => {
      mdContent += `## ${index + 1}. ${room.roomName}\n\n`;
      
      // Add image reference to markdown if image exists
      if (room.generatedImageBase64 && imgFolder) {
        // Create a safe filename
        const imageName = `room_${index + 1}.png`;
        // Clean base64 string for JSZip (remove header)
        const base64Data = room.generatedImageBase64.split(',')[1];
        
        // Add to zip folder
        imgFolder.file(imageName, base64Data, {base64: true});
        
        // Add Markdown image syntax
        mdContent += `![${room.roomName}](images/${imageName})\n\n`;
      }

      mdContent += `### Descrição da cena\n${room.narrative}\n\n`;
      
      mdContent += `### Informações técnicas\n`;
      room.technicalInfo.forEach(info => {
        mdContent += `- ${info}\n`;
      });
      mdContent += `\n`;
      
      mdContent += `### Prompt Visual\n> ${room.imagePrompt}\n\n`;
      mdContent += `---\n\n`;
    });

    zip.file(`${folderName}.md`, mdContent);

    try {
      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${folderName}_palace.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Error generating zip", e);
      alert("Error generating download package.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 pb-20">
      
      {/* Header */}
      <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-purple-600 to-indigo-600 p-2 rounded-lg shadow-lg shadow-purple-900/50">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-100 tracking-tight brand-font">
              Mind Palace <span className="text-purple-400">Architect</span>
            </h1>
          </div>
          {status === GenerationStatus.COMPLETED && (
            <button 
              onClick={() => {
                setStatus(GenerationStatus.IDLE);
                setRooms([]);
                setRequestData(null);
              }}
              className="text-sm text-slate-400 hover:text-white transition-colors underline decoration-slate-600 hover:decoration-white"
            >
              New Project
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 mt-12">
        
        {/* Intro / Form State */}
        {status === GenerationStatus.IDLE && (
          <div className="animate-fade-in-up">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 brand-font leading-tight">
                Master Any Subject with the <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">Method of Loci</span>
              </h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                Transform dry technical data into an immersive, unforgettable mental journey. 
                Our AI Architect builds a custom memory palace room by room, complete with vivid visualizations.
              </p>
            </div>
            <InputForm onSubmit={handleGenerate} status={status} />
          </div>
        )}

        {/* Loading / Generating State */}
        {(status === GenerationStatus.PLANNING || status === GenerationStatus.VISUALIZING) && (
          <div className="flex flex-col items-center justify-center py-20 animate-pulse">
            <div className="w-24 h-24 mb-8 relative">
               <div className="absolute inset-0 border-4 border-slate-700 rounded-full"></div>
               <div className="absolute inset-0 border-4 border-purple-500 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2 brand-font">Constructing the Architecture...</h3>
            <p className="text-slate-400">
              {status === GenerationStatus.PLANNING ? "Drafting the blueprints and narratives..." : "Rendering the scenes in your chosen style..."}
            </p>
          </div>
        )}

        {/* Error State */}
        {status === GenerationStatus.ERROR && (
          <div className="bg-red-900/20 border border-red-500/50 rounded-xl p-8 text-center max-w-2xl mx-auto mt-10">
            <h3 className="text-xl font-bold text-red-400 mb-2">Architectural Failure</h3>
            <p className="text-red-200 mb-6">{errorMsg}</p>
            <button 
              onClick={() => setStatus(GenerationStatus.IDLE)}
              className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Results State */}
        {(status === GenerationStatus.VISUALIZING || status === GenerationStatus.COMPLETED) && rooms.length > 0 && (
          <div className="space-y-12 pb-20">
            <div className="text-center mb-12 border-b border-slate-800 pb-8">
              <p className="text-purple-400 font-bold tracking-widest text-sm uppercase mb-2">Project</p>
              <h2 className="text-3xl font-bold text-white brand-font">{requestData?.theme}</h2>
              <p className="text-slate-500 mt-2">Style: {requestData?.visualStyle}</p>
            </div>

            <div className="relative">
              {/* Connector Line */}
              <div className="absolute left-6 md:left-[50%] top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500/0 via-purple-500/20 to-purple-500/0 hidden md:block"></div>

              {rooms.map((room, index) => (
                <div key={index} className="animate-fade-in-up" style={{ animationDelay: `${index * 150}ms` }}>
                  <RoomCard room={room} index={index} />
                </div>
              ))}
            </div>
            
            {status === GenerationStatus.COMPLETED && (
               <div className="text-center pt-10">
                 <p className="text-slate-400 mb-6 italic">"The palace is complete. Walk through it in your mind."</p>
                 <div className="flex flex-col sm:flex-row justify-center gap-4">
                   <button 
                    onClick={() => window.print()}
                    className="px-8 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white rounded-full transition-all flex items-center justify-center gap-2"
                   >
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                     Print Blueprint
                   </button>
                   <button 
                    onClick={downloadPackage}
                    className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 border border-indigo-500 text-white rounded-full transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/50"
                   >
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                     Download Zip
                   </button>
                 </div>
               </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;