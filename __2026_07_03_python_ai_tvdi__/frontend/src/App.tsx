import { type FormEvent, useState } from 'react'
import { AlertCircle, BrainCircuit, CheckCircle2, Flower2, LoaderCircle, RefreshCw, Sparkles } from 'lucide-react'

type Values = { sepal_length: number; sepal_width: number; petal_length: number; petal_width: number }
type Prediction = { prediction_id: number; prediction_label: string; probabilities: Record<string, number> }
type TrainResult = { status: string; accuracy: number; train_time: number; feature_importances: Record<string, number>; message: string }

const API_URL = (import.meta.env.VITE_API_URL ?? 'https://two0260724.onrender.com').replace(/\/$/, '')
const initialValues: Values = { sepal_length: 5.1, sepal_width: 3.5, petal_length: 1.4, petal_width: 0.2 }
const species: Record<string, { zh: string; color: string; soft: string; note: string }> = {
  setosa: { zh: '山鳶尾', color: '#0f766e', soft: '#ccfbf1', note: '花瓣短小，特徵十分鮮明。' },
  versicolor: { zh: '變色鳶尾', color: '#b45309', soft: '#fef3c7', note: '介於兩個品種之間的優雅平衡。' },
  virginica: { zh: '維吉尼亞鳶尾', color: '#7e22ce', soft: '#f3e8ff', note: '花瓣通常更長、更寬。' },
}

const fields: Array<{ key: keyof Values; label: string; en: string }> = [
  { key: 'sepal_length', label: '萼片長度', en: 'Sepal length' },
  { key: 'sepal_width', label: '萼片寬度', en: 'Sepal width' },
  { key: 'petal_length', label: '花瓣長度', en: 'Petal length' },
  { key: 'petal_width', label: '花瓣寬度', en: 'Petal width' },
]

function App() {
  const [values, setValues] = useState<Values>(initialValues)
  const [result, setResult] = useState<Prediction | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [train, setTrain] = useState<TrainResult | null>(null)
  const [training, setTraining] = useState(false)

  const predict = async (event?: FormEvent) => {
    event?.preventDefault(); setLoading(true); setError('')
    try {
      const response = await fetch(`${API_URL}/predict`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values) })
      if (!response.ok) throw new Error(await response.text())
      setResult(await response.json())
    } catch {
      setError('暫時無法連線至預測服務，請確認 API 網址與後端服務狀態。')
    } finally { setLoading(false) }
  }

  const trainModel = async () => {
    setTraining(true); setError('')
    try {
      const response = await fetch(`${API_URL}/train`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ n_estimators: 100, max_depth: 0, test_size: 0.2, random_state: 42 }) })
      if (!response.ok) throw new Error(await response.text())
      setTrain(await response.json())
    } catch { setError('模型重新訓練失敗，請稍後再試。') } finally { setTraining(false) }
  }

  const selected = result ? species[result.prediction_label] ?? species.setosa : null
  return <main className="min-h-screen bg-stone-50 text-slate-800">
    <section className="hero"><div className="orb orb-one" /><div className="orb orb-two" />
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
        <div className="flex items-center gap-3 text-teal-100"><Flower2 size={28} /><span className="font-semibold tracking-[.18em]">IRIS INTELLIGENCE</span></div>
        <h1 className="mt-7 max-w-3xl text-4xl font-black tracking-tight text-white sm:text-6xl">用數據，看見<br/><em>鳶尾花的名字。</em></h1>
        <p className="mt-6 max-w-xl text-lg leading-8 text-teal-50/85">輸入花朵的四項測量值，讓隨機森林模型為你辨識鳶尾花品種。</p>
      </div>
    </section>
    <section className="mx-auto -mt-7 max-w-6xl px-5 pb-16 sm:px-8">
      {error && <div className="mb-6 flex gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700"><AlertCircle className="shrink-0" />{error}</div>}
      <div className="grid gap-6 lg:grid-cols-[1.05fr_.95fr]">
        <form onSubmit={predict} className="panel p-6 sm:p-8"><div className="mb-7 flex items-start justify-between"><div><p className="eyebrow">STEP 01</p><h2 className="section-title">測量花朵</h2></div><span className="rounded-xl bg-teal-50 p-3 text-teal-700"><Sparkles /></span></div>
          <div className="grid gap-5 sm:grid-cols-2">{fields.map(({ key, label, en }) => <label key={key} className="field"><span>{label}<small>{en}</small></span><div><input type="number" min="0.1" max="10" step="0.1" value={values[key]} onChange={e => setValues({ ...values, [key]: Number(e.target.value) })}/><b>cm</b></div></label>)}</div>
          <button className="primary-button mt-8" disabled={loading}>{loading ? <LoaderCircle className="animate-spin" /> : <BrainCircuit />}{loading ? 'AI 正在辨識…' : '開始 AI 辨識'}</button>
        </form>
        <div className="panel overflow-hidden p-6 sm:p-8"><div className="mb-7"><p className="eyebrow">STEP 02</p><h2 className="section-title">辨識結果</h2></div>
          {!result ? <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-8 text-center"><Flower2 size={40} className="text-teal-600"/><p className="mt-4 font-bold text-slate-600">等待測量數據</p><p className="mt-1 text-sm text-slate-400">按下辨識按鈕後，結果會顯示在這裡。</p></div> : <><div className="rounded-2xl p-6" style={{ backgroundColor: selected?.soft }}><p className="text-sm font-bold uppercase tracking-widest" style={{ color: selected?.color }}>預測品種</p><div className="mt-2 flex items-center justify-between gap-3"><div><h3 className="text-3xl font-black" style={{ color: selected?.color }}>{selected?.zh}</h3><p className="mt-1 text-slate-600">Iris {result.prediction_label}</p></div><CheckCircle2 size={38} style={{ color: selected?.color }} /></div><p className="mt-4 text-sm text-slate-600">{selected?.note}</p></div><div className="mt-7 space-y-4">{Object.entries(result.probabilities).sort((a,b) => b[1]-a[1]).map(([name, probability]) => <div key={name}><div className="mb-1.5 flex justify-between text-sm font-semibold"><span>{species[name]?.zh ?? name}</span><span>{(probability * 100).toFixed(1)}%</span></div><div className="bar"><i style={{ width: `${probability * 100}%`, backgroundColor: species[name]?.color }} /></div></div>)}</div></>}
        </div>
      </div>
      <section className="mt-8 panel p-6 sm:p-8"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center"><div><p className="eyebrow">MODEL LAB</p><h2 className="section-title">模型訓練室</h2><p className="mt-2 text-sm text-slate-500">以預設參數重新訓練模型，並查看最新評估結果。</p></div><button type="button" onClick={trainModel} className="secondary-button" disabled={training}>{training ? <LoaderCircle className="animate-spin"/> : <RefreshCw/>}{training ? '訓練中…' : '重新訓練'}</button></div>
        {train && <div className="mt-7 grid gap-4 sm:grid-cols-3"><Metric label="測試準確率" value={`${(train.accuracy * 100).toFixed(2)}%`} /><Metric label="訓練時間" value={`${train.train_time.toFixed(3)} s`} /><Metric label="模型狀態" value="已更新" /></div>}
      </section>
    </section>
  </main>
}
function Metric({ label, value }: { label: string; value: string }) { return <div className="rounded-2xl bg-slate-50 p-5"><p className="text-sm font-medium text-slate-500">{label}</p><p className="mt-2 text-2xl font-black text-teal-800">{value}</p></div> }
export default App
