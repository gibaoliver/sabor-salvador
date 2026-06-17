import React, { useState } from 'react';
import { Database, Copy, Check, RefreshCw, AlertTriangle, Cloud, Server, BookOpen, Layers } from 'lucide-react';
import { SQL_CREATION_SCRIPT } from '../supabaseService';

interface SupabaseConsoleProps {
  dbLoading: boolean;
  dbTablesMissing: boolean;
  restaurantsCount: number;
  eventsCount: number;
  onRefresh: () => void;
  onSeed: () => Promise<{ success: boolean; message: string }>;
}

export default function SupabaseConsole({
  dbLoading,
  dbTablesMissing,
  restaurantsCount,
  eventsCount,
  onRefresh,
  onSeed
}: SupabaseConsoleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleCopySQL = async () => {
    try {
      await navigator.clipboard.writeText(SQL_CREATION_SCRIPT);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleSeedData = async () => {
    setIsSyncing(true);
    setSyncResult(null);
    try {
      const res = await onSeed();
      setSyncResult(res);
      if (res.success) {
        onRefresh();
      }
    } catch (err: any) {
      setSyncResult({ success: false, message: err.message || 'Erro ao sincronizar dados.' });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans text-left">
      {/* Floating activation pill */}
      <button
        id="btn-supabase-console-toggle"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-full shadow-2xl border transition-all duration-300 font-bold hover:scale-105 cursor-pointer ${
          dbTablesMissing
            ? 'bg-amber-500 hover:bg-amber-600 text-white border-amber-400'
            : 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-400'
        }`}
      >
        <Database className={`w-4 h-4 ${dbLoading ? 'animate-spin' : ''}`} />
        <span className="text-xs tracking-tight">Supabase: {dbTablesMissing ? 'Tabelas Pendentes' : 'Conectado'}</span>
        <span className="flex h-2 w-2 relative">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
            dbTablesMissing ? 'bg-amber-300' : 'bg-emerald-300'
          }`}></span>
          <span className={`relative inline-flex rounded-full h-2 w-2 ${
            dbTablesMissing ? 'bg-amber-200' : 'bg-emerald-200'
          }`}></span>
        </span>
      </button>

      {/* Admin Panel Overlay */}
      {isOpen && (
        <div className="absolute bottom-14 right-0 w-[420px] max-w-[calc(100vw-2rem)] bg-white border border-neutral-200 shadow-2xl rounded-2xl overflow-hidden animate-fade-in text-neutral-800 transition-all">
          
          {/* HEADER */}
          <div className="bg-neutral-900 text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-400" />
              <div>
                <h4 className="font-extrabold text-sm tracking-tight">Painel Supabase Salvador</h4>
                <p className="text-[10px] text-neutral-400 font-medium">Controle de sincronização em tempo real</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-neutral-400 hover:text-white font-extrabold text-xs cursor-pointer"
            >
              FECHAR
            </button>
          </div>

          {/* STATUS CARDS */}
          <div className="p-5 space-y-4 max-h-[480px] overflow-y-auto">
            
            {/* API SERVER CONFIG */}
            <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-100 space-y-2">
              <div className="flex justify-between items-center text-[10px] font-bold text-neutral-400 uppercase">
                <span>Servidor Conectado</span>
                <span className="text-emerald-600 flex items-center gap-1">
                  <Cloud className="w-3 h-3" /> REST Ativa
                </span>
              </div>
              <p className="text-xs font-mono font-bold text-neutral-700 bg-neutral-100 p-1.5 rounded break-all">
                https://onouxbiwzovtwkueyrnn.supabase.co
              </p>
            </div>

            {/* HEALTH MATRIX */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl border flex flex-col justify-between bg-white border-neutral-200">
                <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Restaurantes</span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-2xl font-black text-neutral-900">{restaurantsCount}</span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                    dbTablesMissing ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {dbTablesMissing ? 'Pendente' : 'Ativo'}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl border flex flex-col justify-between bg-white border-neutral-200">
                <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Eventos Culturais</span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-2xl font-black text-neutral-900">{eventsCount}</span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                    dbTablesMissing ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {dbTablesMissing ? 'Pendente' : 'Ativo'}
                  </span>
                </div>
              </div>
            </div>

            {/* WARNING OR SUCCESS MESSAGE */}
            {dbTablesMissing ? (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-2.5">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-extrabold text-xs text-amber-800">Tabelas não encontradas no banco!</h5>
                    <p className="text-[10px] text-amber-700 mt-0.5 font-medium leading-relaxed">
                      Como você acabou de criar o banco de dados no Supabase, é necessário criar as tabelas (<code className="font-mono bg-amber-100/70 px-1 py-0.5 rounded font-bold">restaurants</code> e <code className="font-mono bg-amber-100/70 px-1 py-0.5 rounded font-bold">events</code>) antes de sincronizar.
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="block text-[9px] font-bold uppercase text-amber-800 tracking-wider">Como resolver em 30 segundos:</span>
                  <ol className="text-[10px] text-amber-700 space-y-1 list-decimal pl-4 font-semibold leading-normal">
                    <li>Copie o script de criação SQL abaixo completinho.</li>
                    <li>Vá no seu painel da <strong>Supabase</strong> e acesse a aba <strong>SQL Editor</strong>.</li>
                    <li>Clique em <strong>New Query</strong>, cole o script e clique em <strong>Run</strong> no painel!</li>
                  </ol>
                </div>

                {/* SQL CODE BLOCK BOX */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-extrabold text-neutral-500 uppercase">Script SQL de Inicialização</span>
                    <button
                      type="button"
                      onClick={handleCopySQL}
                      className="text-[10px] font-black text-amber-800 flex items-center gap-1 hover:underline cursor-pointer bg-white px-2 py-1 rounded border border-amber-200"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-600 font-bold">Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-amber-800" />
                          <span>Copiar Código SQL</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="text-[9px] bg-neutral-900 text-neutral-300 font-mono p-3 rounded-lg overflow-x-auto max-h-[120px] shadow-inner text-left select-all">
                    {SQL_CREATION_SCRIPT}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                <div className="flex items-start gap-2.5">
                  <Server className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-extrabold text-xs text-emerald-800">Banco de Dados Supabase Conectado!</h5>
                    <p className="text-[10px] text-emerald-700 mt-1 font-medium leading-relaxed">
                      As tabelas estão criadas e prontas para gravação. O site já está consultando e gravando avaliações, restaurantes e agendas diretamente na nuvem!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* SEED ACTION SECTION */}
            <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-100 space-y-3.5">
              <div className="flex justify-between items-center">
                <div>
                  <h6 className="text-[11px] font-black text-neutral-700 uppercase tracking-tight">Sincronizar Dados Iniciais</h6>
                  <p className="text-[9px] text-neutral-400 font-medium">Preencha o banco de dados com os dados padrão do site</p>
                </div>
                <button
                  type="button"
                  onClick={onRefresh}
                  disabled={dbLoading}
                  className="p-1 px-2.5 bg-white border border-neutral-200 hover:border-neutral-300 rounded font-bold text-[9px] flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className={`w-3 h-3 ${dbLoading ? 'animate-spin' : ''}`} />
                  <span>Verificar</span>
                </button>
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  disabled={isSyncing}
                  onClick={handleSeedData}
                  className={`w-full font-black text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
                    dbTablesMissing
                      ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/10'
                  }`}
                >
                  {isSyncing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Sincronizando com Supabase...</span>
                    </>
                  ) : (
                    <>
                      <Layers className="w-3.5 h-3.5" />
                      <span>Enviar 8 Restaurantes e sementes iniciais →</span>
                    </>
                  )}
                </button>

                {dbTablesMissing && (
                  <p className="text-[9px] text-amber-700 text-center font-bold">
                    ⚠️ Atived as tabelas via SQL Editor primeiro para poder enviar os dados iniciais.
                  </p>
                )}

                {/* SHOW SYNC STATUS */}
                {syncResult && (
                  <div className={`p-2.5 rounded-lg border text-[10px] font-bold text-center ${
                    syncResult.success 
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                      : 'bg-rose-50 text-rose-800 border-rose-200'
                  }`}>
                    {syncResult.message}
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* FOOTER METADATA */}
          <div className="bg-neutral-900 py-3.5 px-5 flex items-center justify-between text-[9px] text-neutral-400 font-bold border-t border-neutral-800 uppercase tracking-wider">
            <span>Sabor Salvador Hub</span>
            <span className="text-emerald-400">Ambiente de Produção Ativo</span>
          </div>

        </div>
      )}
    </div>
  );
}
