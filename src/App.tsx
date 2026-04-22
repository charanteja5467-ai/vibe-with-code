/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#e2e8f0] font-sans selection:bg-fuchsia-500/30 overflow-x-hidden p-4 md:p-8 border-x-4 border-b-4 md:border-8 border-[#0a0a0a]">
      <div className="w-full max-w-6xl mx-auto flex flex-col h-full min-h-[calc(100vh-4rem)]">
        {/* Top Navigation / Header */}
        <header className="flex justify-between items-end mb-8 border-b border-zinc-800 pb-4">
          <div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-amber-400 uppercase">
              Neon // Snake
            </h1>
            <p className="text-[10px] tracking-[0.3em] font-mono text-zinc-500 mt-1 uppercase">
              Neural Rhythm Protocol v4.2.0
            </p>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-8 min-h-0">
          {/* Left Column: Playlist + Player */}
          <aside className="xl:col-span-4 flex flex-col order-2 xl:order-1">
            <h2 className="text-xs font-bold tracking-[0.4em] uppercase text-zinc-600 mb-6 border-l-2 border-fuchsia-500 pl-3">
              Neural Playlist
            </h2>
            <MusicPlayer />
            
            {/* Visualizer Placeholder */}
            <div className="mt-8 mb-4 hidden md:block">
              <div className="flex gap-1 items-end h-12">
                <div className="w-1 bg-cyan-400 h-1/2"></div>
                <div className="w-1 bg-cyan-400 h-3/4"></div>
                <div className="w-1 bg-fuchsia-500 h-full"></div>
                <div className="w-1 bg-cyan-400 h-2/3"></div>
                <div className="w-1 bg-cyan-400 h-1/3"></div>
                <div className="w-1 bg-fuchsia-500 h-5/6"></div>
              </div>
              <p className="text-[9px] font-mono text-zinc-600 mt-2 tracking-widest uppercase">Audio Spectrum RAW_DATA</p>
            </div>
          </aside>

          {/* Center Column: Game Grid */}
          <section className="xl:col-span-5 flex items-start justify-center order-1 xl:order-2">
            <SnakeGame />
          </section>

          {/* Right Column: System Info */}
          <aside className="xl:col-span-3 flex-col text-right hidden lg:flex order-3">
             <div className="border-r-2 border-amber-400 pr-3 mb-8">
               <h3 className="text-xs font-bold tracking-widest uppercase text-zinc-600">Session Status</h3>
               <p className="text-xl font-mono text-white">ACTIVE</p>
             </div>
             
             <div className="space-y-8 flex-1">
               <div>
                 <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Multipliers</h4>
                 <p className="text-2xl font-black text-amber-400">X 2.45</p>
               </div>
               <div>
                 <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Level Tier</h4>
                 <p className="text-2xl font-black text-white">DELTA-9</p>
               </div>
             </div>
             
             <div className="mt-8 bg-zinc-900/50 p-4 border border-zinc-800 rounded-md text-left">
               <div className="text-[10px] font-mono text-zinc-500 mb-2">ENGINE_LOGS:</div>
               <div className="text-[9px] font-mono text-cyan-400 space-y-1">
                 <p>&gt; SNAKE_LOADED_OK</p>
                 <p>&gt; AUDIO_BUFFER_READY</p>
                 <p>&gt; RENDER_LOOP_60FPS</p>
               </div>
             </div>
          </aside>
        </main>
      </div>
    </div>
  );
}
