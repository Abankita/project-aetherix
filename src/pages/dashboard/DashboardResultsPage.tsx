import React, { useEffect, useState } from 'react';
import { aetherixApi, FireSummary } from '@/services/aetherixApi';
import { AlertTriangle, FileText, Sparkles } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useTheme } from '@/context/ThemeContext';

const fmt = (n?: number, digits = 3) => typeof n === 'number' && Number.isFinite(n) ? n.toFixed(digits) : '—';
const card = 'p-5 rounded-2xl bg-white dark:bg-[#111C28] border border-gray-200/80 dark:border-[rgba(160,180,195,0.14)] shadow-xs';

export const DashboardResultsPage: React.FC = () => {
  const [summaries, setSummaries] = useState<Partial<Record<'timber' | 'plaskett', FireSummary>>>({});
  const [activeTab, setActiveTab] = useState<'combined' | 'comparative' | 'limitations'>('combined');
  const { isDark } = useTheme();
  useEffect(() => {
    let mounted = true;
    Promise.all([aetherixApi.summary('timber'), aetherixApi.summary('plaskett')])
      .then(([timber, plaskett]) => mounted && setSummaries({ timber, plaskett }))
      .catch(() => mounted && setSummaries({}));
    return () => { mounted = false; };
  }, []);
  const fires = (['timber', 'plaskett'] as const).flatMap((id) => summaries[id] ? [summaries[id]!] : []);
  const totalAoi = fires.reduce((n, f) => n + f.aoi_pixels, 0);
  const totalValid = fires.reduce((n, f) => n + f.common_valid_score_pixels, 0);
  const data = fires.map((f) => ({ name: f.name, dNBR: f.dNBR.mean, 'NDVI loss': f.NDVI_loss.mean, 'NDMI loss': f.NDMI_loss.mean, 'HH change': f.NISAR_HH_change.mean, 'HV change': f.NISAR_HV_change.mean }));
  const limitations = [
    ['NISAR observations are provisional', 'The package marks NISAR GCOV inputs provisional. Backscatter in dB can respond to moisture, surface roughness, vegetation structure and acquisition geometry.'],
    ['dNBR is not field-calibrated here', 'dNBR is the supplied pre-fire minus post-fire NBR output. The package does not provide field-calibrated severity classes.'],
    ['Screening index is relative', 'The multi-source screening score is an index, not a probability or calibrated burn-severity score.'],
    ['Study grids are independent', 'Timber and Plaskett use separate AOI grids; summary statistics can be compared but pixel locations are not interchangeable.'],
    ['Acquisition dates are unavailable', 'The supplied time-series summary contains phase aggregates but no acquisition-date column. Dates are not inferred.'],
    ['Watershed zonal metrics are unavailable', 'Watershed polygons include HUC and fire-overlap attributes. The package does not include per-watershed raster statistics or hazard rankings.'],
  ];
  const tabs = [['combined', 'Data summary'], ['comparative', 'Fire comparison'], ['limitations', 'Limitations']] as const;
  return <div className="w-full px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto space-y-6">
    <header className="pb-6 border-b border-gray-200 dark:border-[rgba(160,180,195,0.14)]">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-[#172330] border border-blue-200 dark:border-[rgba(160,180,195,0.14)] text-[#36C5D9] text-xs font-mono uppercase mb-3"><FileText className="w-3.5 h-3.5"/> Empirical data summary</div>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-[#18191D] dark:text-[#F3F6F8]">Post-Wildfire Landscape Results</h1>
      <p className="text-sm text-[#626873] dark:text-[#AAB5C2] mt-2 max-w-3xl">Summary statistics are loaded from the supplied raster products. Values describe the study grids and are not field-calibrated severity or risk estimates.</p>
      <nav className="flex flex-wrap gap-2 mt-5">{tabs.map(([id, label]) => <button key={id} onClick={() => setActiveTab(id)} className={`px-4 py-2 rounded-full text-xs font-semibold uppercase ${activeTab === id ? 'bg-[#172330] text-[#36C5D9]' : 'bg-gray-100 dark:bg-[#111C28] text-gray-500'}`}><Sparkles className="inline w-3 h-3 mr-2"/>{label}</button>)}</nav>
    </header>
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {[["Study grids", fires.length ? `${fires.length} fires` : 'Loading'], ['AOI pixels', totalAoi.toLocaleString()], ['Common valid pixels', totalValid.toLocaleString()], ['Common valid coverage', totalAoi ? `${(100 * totalValid / totalAoi).toFixed(1)}%` : '—']].map(([label, value]) => <div className={card} key={label}><div className="text-[11px] font-mono uppercase text-gray-400">{label}</div><div className="text-xl font-bold text-[#36C5D9] font-mono mt-1">{value}</div></div>)}
    </div>
    <p className="max-w-5xl text-sm leading-relaxed text-[#626873] dark:text-[#AAB5C2]">How to read these figures: AOI and valid-pixel counts are grid cells, not acres or hectares. Common valid coverage is the share of the study grid where the combined score has data. Chart values are raster means in the units listed for each layer; they summarize the mapped cells and do not identify a cause by themselves.</p>
    {activeTab !== 'limitations' ? <section className="p-6 rounded-3xl bg-white dark:bg-[#111C28] border border-gray-200 dark:border-[rgba(160,180,195,0.14)] space-y-4">
      <div><h2 className="font-bold text-lg text-[#18191D] dark:text-[#F3F6F8]">{activeTab === 'combined' ? 'Raster summary by fire' : 'Timber and Plaskett comparison'}</h2><p className="text-xs text-[#626873] dark:text-[#AAB5C2]">Mean values from valid pixels in each supplied raster. Units follow the layer metadata.</p></div>
      <div className="h-80"><ResponsiveContainer width="100%" height="100%"><BarChart data={data} margin={{ top: 12, right: 12, left: 0, bottom: 8 }}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? 'rgba(160,180,195,.14)' : '#E5E7EB'}/><XAxis dataKey="name"/><YAxis/><Tooltip/><Legend/><Bar dataKey="dNBR" fill="#F28C45"/><Bar dataKey="NDVI loss" fill="#36C5D9"/><Bar dataKey="NDMI loss" fill="#6599E8"/><Bar dataKey="HH change" fill="#A48DEB"/><Bar dataKey="HV change" fill="#43C99A"/></BarChart></ResponsiveContainer></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{fires.map((f) => <div key={f.id} className={card}><h3 className="font-bold text-[#18191D] dark:text-[#F3F6F8]">{f.name}</h3><dl className="mt-3 grid grid-cols-2 gap-2 text-xs font-mono text-gray-500 dark:text-[#AAB5C2]">{[['Mean dNBR', f.dNBR.mean], ['Mean NDVI loss', f.NDVI_loss.mean], ['Mean NDMI loss', f.NDMI_loss.mean], ['Screening score', f.screening_score.mean], ['Mean NISAR HH change', f.NISAR_HH_change.mean], ['Mean NISAR HV change', f.NISAR_HV_change.mean]].map(([k, v]) => <div key={String(k)}><dt>{k}</dt><dd className="font-bold text-[#18191D] dark:text-[#F3F6F8]">{fmt(Number(v))}</dd></div>)}</dl><p className="text-[10px] mt-3">Common valid score pixels: {f.common_valid_score_pixels.toLocaleString()} ({fmt(f.common_valid_score_percent, 1)}%)</p></div>)}</div>
      {!fires.length && <p className="text-sm text-gray-500">Could not load summaries. Confirm the AETHERIX API is running.</p>}
    </section> : <section className="p-6 rounded-3xl bg-white dark:bg-[#111C28] border border-gray-200 dark:border-[rgba(160,180,195,0.14)] space-y-4"><div className="flex gap-2 items-center"><AlertTriangle className="w-4 h-4 text-amber-500"/><h2 className="font-bold text-lg">Scientific limits and data availability</h2></div><div className="grid md:grid-cols-2 gap-4">{limitations.map(([title, desc]) => <article key={title} className={card}><h3 className="font-bold text-sm">{title}</h3><p className="text-xs text-gray-500 dark:text-[#AAB5C2] mt-2">{desc}</p></article>)}</div></section>}
  </div>;
};
