import { useState, useMemo } from 'react'
import './App.css'
import {
  Thermometer,
  TreePine,
  Building2,
  Droplets,
  Wind,
  Sun,
  Info,
  ArrowRight,
  BarChart3,
  MapPin,
  Leaf,
  CloudSun,
  TrendingUp,
  TrendingDown,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

// ── Data ──

const monthlyTempData = [
  { month: 'Jan', urban: 5.2, rural: 3.1 },
  { month: 'Feb', urban: 6.8, rural: 4.5 },
  { month: 'Mar', urban: 11.3, rural: 8.9 },
  { month: 'Apr', urban: 15.7, rural: 12.8 },
  { month: 'May', urban: 21.4, rural: 18.1 },
  { month: 'Jun', urban: 27.2, rural: 23.5 },
  { month: 'Jul', urban: 30.8, rural: 26.4 },
  { month: 'Aug', urban: 30.1, rural: 25.9 },
  { month: 'Sep', urban: 25.6, rural: 21.8 },
  { month: 'Oct', urban: 18.3, rural: 15.1 },
  { month: 'Nov', urban: 11.7, rural: 9.0 },
  { month: 'Dec', urban: 6.9, rural: 4.6 },
]

const landCoverData = [
  { name: 'Buildings', value: 35, color: '#6b7280' },
  { name: 'Roads/Pavement', value: 25, color: '#374151' },
  { name: 'Green Spaces', value: 20, color: '#22c55e' },
  { name: 'Water Bodies', value: 8, color: '#3b82f6' },
  { name: 'Bare Soil', value: 12, color: '#d97706' },
]

const mitigationStrategies = [
  {
    icon: TreePine,
    title: 'Urban Greening',
    description: 'Planting trees and creating green corridors reduces surface temperatures by 2-8°C through shade and evapotranspiration.',
    impact: 'High',
    costLevel: 'Medium',
    tempReduction: -3.5,
  },
  {
    icon: Building2,
    title: 'Cool Roofs',
    description: 'Reflective roofing materials can reduce roof temperatures by up to 30°C, lowering indoor cooling needs by 10-40%.',
    impact: 'High',
    costLevel: 'Low',
    tempReduction: -2.8,
  },
  {
    icon: Droplets,
    title: 'Permeable Pavements',
    description: 'Porous surfaces allow water infiltration, reducing runoff and surface temperatures through evaporative cooling.',
    impact: 'Medium',
    costLevel: 'Medium',
    tempReduction: -1.5,
  },
  {
    icon: Wind,
    title: 'Urban Ventilation',
    description: 'Strategic building orientation and wind corridors improve airflow, dispersing trapped heat from urban canyons.',
    impact: 'Medium',
    costLevel: 'High',
    tempReduction: -1.2,
  },
  {
    icon: Droplets,
    title: 'Water Features',
    description: 'Fountains, ponds, and misting systems provide localized cooling through evaporation, reducing ambient air temperatures.',
    impact: 'Low',
    costLevel: 'Medium',
    tempReduction: -0.8,
  },
  {
    icon: Sun,
    title: 'Solar-Reflective Materials',
    description: 'High-albedo paints and materials on walls and walkways reflect sunlight instead of absorbing it as heat.',
    impact: 'Medium',
    costLevel: 'Low',
    tempReduction: -1.8,
  },
]

const cities = [
  { name: 'Tokyo', uhiIntensity: 3.0, population: 13.96, greenCover: 7.5 },
  { name: 'Delhi', uhiIntensity: 5.5, population: 32.94, greenCover: 5.2 },
  { name: 'Shanghai', uhiIntensity: 4.2, population: 28.52, greenCover: 8.1 },
  { name: 'São Paulo', uhiIntensity: 3.8, population: 22.43, greenCover: 11.3 },
  { name: 'Mumbai', uhiIntensity: 4.8, population: 21.67, greenCover: 6.0 },
  { name: 'Cairo', uhiIntensity: 6.1, population: 22.18, greenCover: 2.3 },
  { name: 'New York', uhiIntensity: 3.5, population: 18.82, greenCover: 14.0 },
  { name: 'London', uhiIntensity: 2.8, population: 9.54, greenCover: 18.4 },
]

// ── Simulator defaults ──

interface SimulatorInputs {
  greenCover: number
  coolRoofs: number
  permeablePavement: number
  waterFeatures: number
}

const defaultSimInputs: SimulatorInputs = {
  greenCover: 20,
  coolRoofs: 10,
  permeablePavement: 5,
  waterFeatures: 2,
}

// ── Helpers ──

function impactColor(impact: string) {
  if (impact === 'High') return 'bg-red-100 text-red-700'
  if (impact === 'Medium') return 'bg-yellow-100 text-yellow-700'
  return 'bg-green-100 text-green-700'
}

function costColor(cost: string) {
  if (cost === 'High') return 'text-red-600'
  if (cost === 'Medium') return 'text-yellow-600'
  return 'text-green-600'
}

// ── Components ──

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-orange-600 via-red-600 to-amber-700 text-white">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-yellow-300 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-red-400 rounded-full blur-3xl" />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 py-20 sm:py-28 flex flex-col items-center text-center gap-6">
        <div className="flex items-center gap-2 bg-white/20 backdrop-blur rounded-full px-4 py-1.5 text-sm font-medium">
          <Thermometer className="w-4 h-4" />
          <span>Simplified Urban Climate Tool</span>
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight max-w-4xl">
          Urban Heat Island <br className="hidden sm:block" /> Analysis Tool
        </h1>
        <p className="text-xl sm:text-2xl font-semibold text-white/90">Debabrata Pal · Kunal Kumar · Mehakpreet Kaur</p>
        <p className="text-lg sm:text-xl max-w-2xl text-white/90">
          Explore how cities trap heat, understand the science behind urban warming, and discover actionable strategies to cool our cities.
        </p>
        <div className="flex flex-wrap justify-center gap-4 mt-2">
          <a href="#dashboard" className="inline-flex items-center gap-2 bg-white text-red-700 font-semibold px-6 py-3 rounded-xl shadow hover:shadow-lg transition">
            Explore Dashboard <ArrowRight className="w-4 h-4" />
          </a>
          <a href="#simulator" className="inline-flex items-center gap-2 border-2 border-white/60 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/10 transition">
            Try Simulator
          </a>
        </div>
      </div>
    </section>
  )
}

function StatCard({ icon: Icon, label, value, sub, accent }: { icon: React.ElementType; label: string; value: string; sub: string; accent: string }) {
  return (
    <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-2 border border-gray-100 hover:shadow-md transition">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${accent}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-400">{sub}</p>
    </div>
  )
}

function WhatIsUHI() {
  const [open, setOpen] = useState(false)
  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-2 mb-6">
          <Info className="w-6 h-6 text-orange-600" />
          <h2 className="text-2xl font-bold text-gray-900">What is the Urban Heat Island Effect?</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              The <strong>Urban Heat Island (UHI)</strong> effect occurs when cities experience significantly higher temperatures than surrounding rural areas. Concrete, asphalt, and buildings absorb and re-emit solar radiation, while reduced vegetation limits natural cooling through evapotranspiration.
            </p>
            <p>
              UHI intensity — the temperature difference between urban and rural zones — can reach <strong>1–7 °C</strong> during the day and even higher at night. This leads to increased energy consumption, elevated pollution levels, and serious public-health risks.
            </p>
            <button onClick={() => setOpen(!open)} className="inline-flex items-center gap-1 text-orange-600 font-medium hover:underline">
              {open ? 'Show less' : 'Learn more about causes'}
              {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {open && (
              <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
                <li><strong>Dark surfaces</strong> — asphalt roads and dark roofs have low albedo, absorbing up to 95 % of sunlight.</li>
                <li><strong>Reduced vegetation</strong> — fewer trees means less shade and evapotranspiration.</li>
                <li><strong>Waste heat</strong> — vehicles, air conditioners, and industrial processes add heat directly.</li>
                <li><strong>Urban geometry</strong> — tall buildings create canyons that trap heat and block wind.</li>
                <li><strong>Reduced sky view</strong> — buildings limit radiative cooling to the night sky.</li>
              </ul>
            )}
          </div>
          <div className="relative rounded-2xl overflow-hidden shadow-lg">
            <img
              src="/uhi-diagram.png"
              alt="Urban heat island diagram showing temperature differences between city center and rural areas"
              className="w-full h-64 object-cover"
              onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/600x300/f97316/fff?text=Urban+Heat+Island+Diagram' }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function Dashboard() {
  return (
    <section id="dashboard" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 space-y-10">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-orange-600" />
          <h2 className="text-2xl font-bold text-gray-900">Analysis Dashboard</h2>
        </div>

        {/* Stat cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Thermometer} label="Avg UHI Intensity" value="4.1 °C" sub="Global urban average" accent="bg-red-500" />
          <StatCard icon={Leaf} label="Green Cover Needed" value="+30 %" sub="To offset 2 °C rise" accent="bg-green-500" />
          <StatCard icon={CloudSun} label="Peak Difference" value="7.2 °C" sub="Summer night-time max" accent="bg-orange-500" />
          <StatCard icon={MapPin} label="Cities Affected" value="400+" sub="Population > 1 M" accent="bg-blue-500" />
        </div>

        {/* Charts row */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Temperature comparison */}
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4">Monthly Temperature: Urban vs Rural (°C)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTempData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="urban" stroke="#ef4444" strokeWidth={2} name="Urban" dot={{ r: 3 }} />
                <Line type="monotone" dataKey="rural" stroke="#22c55e" strokeWidth={2} name="Rural" dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Land cover pie */}
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4">Typical Urban Land Cover Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={landCoverData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={110}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, value }) => `${name} ${value}%`}
                >
                  {landCoverData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* City comparison */}
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">UHI Intensity Across Major Cities (°C)</h3>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={cities} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="uhiIntensity" name="UHI Intensity (°C)" radius={[0, 6, 6, 0]}>
                {cities.map((c, i) => (
                  <Cell key={i} fill={c.uhiIntensity > 4.5 ? '#ef4444' : c.uhiIntensity > 3.5 ? '#f59e0b' : '#22c55e'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  )
}

function MitigationSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        <div className="flex items-center gap-2">
          <Leaf className="w-6 h-6 text-green-600" />
          <h2 className="text-2xl font-bold text-gray-900">Mitigation Strategies</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mitigationStrategies.map((s) => (
            <div key={s.title} className="bg-white rounded-2xl shadow border border-gray-100 p-6 flex flex-col gap-3 hover:shadow-md transition">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <s.icon className="w-5 h-5 text-green-700" />
                </div>
                <h3 className="font-semibold text-gray-900">{s.title}</h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{s.description}</p>
              <div className="flex items-center gap-3 mt-auto pt-2 text-xs font-medium">
                <span className={`px-2 py-0.5 rounded-full ${impactColor(s.impact)}`}>Impact: {s.impact}</span>
                <span className={`${costColor(s.costLevel)}`}>Cost: {s.costLevel}</span>
                <span className="ml-auto flex items-center gap-1 text-blue-600">
                  {s.tempReduction < -2 ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                  {s.tempReduction} °C
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Simulator() {
  const [inputs, setInputs] = useState<SimulatorInputs>({ ...defaultSimInputs })

  const result = useMemo(() => {
    const baseUHI = 5.0
    const greenReduction = inputs.greenCover * 0.06
    const roofReduction = inputs.coolRoofs * 0.04
    const pavementReduction = inputs.permeablePavement * 0.03
    const waterReduction = inputs.waterFeatures * 0.02
    const totalReduction = greenReduction + roofReduction + pavementReduction + waterReduction
    const finalUHI = Math.max(0, baseUHI - totalReduction)
    return { baseUHI, totalReduction: Math.min(totalReduction, baseUHI), finalUHI }
  }, [inputs])

  const sliders: { key: keyof SimulatorInputs; label: string; max: number; unit: string; color: string }[] = [
    { key: 'greenCover', label: 'Green Cover', max: 60, unit: '%', color: 'accent-green-600' },
    { key: 'coolRoofs', label: 'Cool Roofs Adopted', max: 80, unit: '%', color: 'accent-blue-600' },
    { key: 'permeablePavement', label: 'Permeable Pavement', max: 50, unit: '%', color: 'accent-amber-600' },
    { key: 'waterFeatures', label: 'Water Features Area', max: 20, unit: '%', color: 'accent-cyan-600' },
  ]

  return (
    <section id="simulator" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        <div className="flex items-center gap-2">
          <Thermometer className="w-6 h-6 text-orange-600" />
          <h2 className="text-2xl font-bold text-gray-900">UHI Mitigation Simulator</h2>
        </div>
        <p className="text-gray-600 max-w-2xl">
          Adjust the sliders below to see how different mitigation strategies can reduce a city's Urban Heat Island intensity. The baseline UHI is set at <strong>5.0 °C</strong>.
        </p>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Sliders */}
          <div className="space-y-6">
            {sliders.map((s) => (
              <div key={s.key} className="space-y-1">
                <div className="flex justify-between text-sm font-medium text-gray-700">
                  <span>{s.label}</span>
                  <span>{inputs[s.key]}{s.unit}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={s.max}
                  value={inputs[s.key]}
                  onChange={(e) => setInputs({ ...inputs, [s.key]: Number(e.target.value) })}
                  className={`w-full h-2 rounded-lg cursor-pointer ${s.color}`}
                />
              </div>
            ))}
            <button
              onClick={() => setInputs({ ...defaultSimInputs })}
              className="text-sm text-orange-600 hover:underline font-medium"
            >
              Reset to defaults
            </button>
          </div>

          {/* Results */}
          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-8 border border-orange-100 flex flex-col items-center justify-center gap-4">
            <p className="text-sm text-gray-500 font-medium">Simulated UHI Intensity</p>
            <div className="text-6xl font-extrabold text-gray-900">
              {result.finalUHI.toFixed(1)}<span className="text-2xl font-medium text-gray-500"> °C</span>
            </div>
            <div className="flex items-center gap-2 text-green-600 font-semibold">
              <TrendingDown className="w-5 h-5" />
              <span>−{result.totalReduction.toFixed(1)} °C reduction</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mt-4">
              <div
                className="h-3 rounded-full transition-all duration-500"
                style={{
                  width: `${(result.finalUHI / result.baseUHI) * 100}%`,
                  background: result.finalUHI > 3.5 ? '#ef4444' : result.finalUHI > 2 ? '#f59e0b' : '#22c55e',
                }}
              />
            </div>
            <p className="text-xs text-gray-400">0 °C (no UHI) ← → 5 °C (baseline)</p>
          </div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-10">
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-4 text-sm">
        <p>&copy; {new Date().getFullYear()} Urban Heat Island Analysis Tool — Simplified</p>
        <div className="flex flex-col items-center gap-1">
          <p className="text-gray-300 font-medium">Created by</p>
          <p className="text-white">Debabrata Pal &middot; Kunal Kumar &middot; Mehakpreet Kaur</p>
        </div>
        <p className="flex items-center gap-1">
          Built with <Leaf className="w-4 h-4 text-green-400" /> for a cooler planet
        </p>
      </div>
    </footer>
  )
}

// ── App ──

function App() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <HeroSection />
      <WhatIsUHI />
      <Dashboard />
      <MitigationSection />
      <Simulator />
      <Footer />
    </div>
  )
}

export default App
