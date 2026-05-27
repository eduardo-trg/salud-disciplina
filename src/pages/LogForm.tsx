import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ConnectionStatus } from '../components/ConnectionStatus';
import { BottomNav } from '../components/BottomNav';
import { useFirebaseSync } from '../hooks/useFirebaseSync';
import { FOOD_HIERARCHY, SNACK_HIERARCHY } from '../lib/offlineStorage';
import type { MealItem, MealTime, DrinkType, DrinkItem } from '../lib/offlineStorage';
import { db, auth } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

const ACTIVITY_TYPES = ['Caminata', 'Bicicleta', 'Fuerza', 'Movilidad', 'Descanso'];

export default function LogForm() {
  const navigate = useNavigate();
  const { saveLog, isLoading, pendingCount } = useFirebaseSync();

  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [existingDay, setExistingDay] = useState(false);

  const [meals, setMeals] = useState<Record<MealTime, MealItem[]>>({ desayuno: [], comida: [], cena: [], snack: [] });
  const [activities, setActivities] = useState<{ type: string; minutes: number }[]>([]);
  const [editingActivity, setEditingActivity] = useState(false);
  const [tempActivity, setTempActivity] = useState({ type: '', minutes: 20 });

  const [foodPicker, setFoodPicker] = useState<{ meal: MealTime; step: 'subgroup' | 'food' } | null>(null);
  const [tempGroup, setTempGroup] = useState<string>('');
  const [tempSubgroup, setTempSubgroup] = useState<string>('');
  const [tempFood, setTempFood] = useState('');
  const [tempPortion, setTempPortion] = useState<'pequeña' | 'mediana' | 'grande'>('mediana');

  const [sleepHours, setSleepHours] = useState(7);
  const [sleepQuality, setSleepQuality] = useState<1|2|3|4|5>(3);
  const [drinks, setDrinks] = useState<DrinkItem[]>([]);
  const [editingDrink, setEditingDrink] = useState(false);
  const [tempDrink, setTempDrink] = useState<DrinkItem>({ type: 'refresco', name: '', portion: 'mediana' });

  const [wellness, setWellness] = useState({ energy: 3, satiety: 3, sleep: 3 });

  const [mealTimes, setMealTimes] = useState({ first: '', last: '' });
  const [showMetrics, setShowMetrics] = useState(false);
  const [metrics, setMetrics] = useState({ weight: '', bpSys: '', bpDia: '', glucose: '', note: '' });

  useEffect(() => {
    setMeals({ desayuno: [], comida: [], cena: [], snack: [] });
    setActivities([]); setDrinks([]);
    setWellness({ energy: 3, satiety: 3, sleep: 3 });
    setSleepHours(7); setSleepQuality(3);
    setFoodPicker(null); setTempGroup(''); setTempSubgroup(''); setTempFood('');
    setMealTimes({ first: '', last: '' });
    setShowMetrics(false); setMetrics({ weight: '', bpSys: '', bpDia: '', glucose: '', note: '' });

    const checkExisting = async () => {
      try {
        const userId = auth.currentUser?.uid;
        if (userId) {
          const docSnap = await getDoc(doc(db, `users/${userId}/daily_logs`, selectedDate));
          setExistingDay(docSnap.exists());
        }
      } catch { setExistingDay(false); }
    };
    checkExisting();
  }, [selectedDate]);

  const handleConfirmFood = () => {
    if (!foodPicker || !tempGroup || !tempSubgroup || !tempFood) return;
    const hierarchy = foodPicker.meal === 'snack' ? SNACK_HIERARCHY : FOOD_HIERARCHY;
    const h = hierarchy as any;
    const newItem: MealItem = {
      group: h[tempGroup].label,
      subgroup: h[tempGroup].subgroups[tempSubgroup].label,
      food: tempFood,
      portion: tempPortion
    };
    setMeals(prev => ({ ...prev, [foodPicker.meal]: [...prev[foodPicker.meal], newItem] }));
    setFoodPicker(null); setTempGroup(''); setTempSubgroup(''); setTempFood(''); setTempPortion('mediana');
  };

  const handleAddActivity = () => {
    if (!tempActivity.type) return;
    setActivities(prev => [...prev, { ...tempActivity }]);
    setEditingActivity(false); setTempActivity({ type: '', minutes: 20 });
  };

  const removeItem = (meal: MealTime, index: number) => setMeals(prev => ({ ...prev, [meal]: prev[meal].filter((_, i) => i !== index) }));
  const removeActivity = (index: number) => setActivities(prev => prev.filter((_, i) => i !== index));

  const handleSaveDay = async () => {
    const logData: any = {
      date: selectedDate,
      sleep: { hours: sleepHours, quality: sleepQuality },
      meals, drinks, activities, wellness
    };

    if (mealTimes.first || mealTimes.last) {
      logData.mealTimes = { first: mealTimes.first || '00:00', last: mealTimes.last || '00:00' };
    }

    const m: any = {};
    if (metrics.weight) m.weight = Number(metrics.weight);
    if (metrics.bpSys) m.bpSystolic = Number(metrics.bpSys);
    if (metrics.bpDia) m.bpDiastolic = Number(metrics.bpDia);
    if (metrics.glucose) m.glucose = Number(metrics.glucose);
    if (metrics.note) m.note = metrics.note.trim();
    if (Object.keys(m).length > 0) logData.metrics = m;

    await saveLog(logData);
    navigate('/');
  };

  return (
    <div className="min-h-screen pb-24 transition-opacity duration-300">
      <ConnectionStatus />
      <main className="max-w-md mx-auto px-4 pt-6">
        <header className="mb-6">
          <h1 className="text-2xl font-bold">Registrar mi día</h1>
          <p className="text-gray-600">Agrega lo que consumiste y tu actividad</p>
        </header>

        {pendingCount > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4 text-center transition-all duration-200">
            <p className="text-sm text-yellow-800">📦 {pendingCount} registro(s) pendiente(s)</p>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4 transition-all duration-200">
          <label className="block text-sm font-medium text-blue-800 mb-2">📆 Registrando día:</label>
          <input type="date" value={selectedDate} max={new Date().toISOString().split('T')[0]} onChange={(e) => setSelectedDate(e.target.value)} className="w-full p-2 border rounded bg-white text-blue-900 font-medium focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all" />
          {existingDay && <p className="text-xs text-blue-700 mt-1">⚠️ Este día ya tiene registros. Se actualizarán al guardar.</p>}
        </div>

        <section className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
          <h2 className="text-lg font-semibold mb-3">⏰ Horarios de alimentación</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Primer alimento</label>
              <input type="time" value={mealTimes.first} onChange={e => setMealTimes({...mealTimes, first: e.target.value})} className="w-full p-2 border rounded bg-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Último alimento</label>
              <input type="time" value={mealTimes.last} onChange={e => setMealTimes({...mealTimes, last: e.target.value})} className="w-full p-2 border rounded bg-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all" />
            </div>
          </div>
        </section>

        {(['desayuno', 'comida', 'cena', 'snack'] as MealTime[]).map((time) => {
          const hierarchy = time === 'snack' ? SNACK_HIERARCHY : FOOD_HIERARCHY;
          const h = hierarchy as any;
          const groups = Object.keys(h);

          return (
            <section key={time} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
              <h2 className="text-lg font-semibold capitalize mb-3">{time === 'snack' ? '🍿 Snack' : time}</h2>
              <div className="flex flex-wrap gap-2 mb-3">
                {meals[time].length === 0 ? <p className="text-sm text-gray-400 italic">Sin registros aún</p> :
                  meals[time].map((item, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-sm transition-all duration-150 hover:bg-gray-200">
                      {item.food} ({item.portion})
                      <button onClick={() => removeItem(time, idx)} className="text-red-500 ml-1 font-bold hover:text-red-700 transition-colors">×</button>
                    </span>
                  ))}
              </div>
              {!foodPicker || foodPicker.meal !== time ? (
                <div className="flex flex-wrap gap-2">
                  {groups.map(g => (
                    <button key={g} onClick={() => { setTempGroup(g); setFoodPicker({ meal: time, step: 'subgroup' }); }} className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 active:scale-[0.98]">
                      {h[g].icon} + {h[g].label}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 p-3 rounded-lg space-y-3 transition-all duration-200">
                  {foodPicker.step === 'subgroup' && tempGroup && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium flex justify-between"><span>Subgrupos en {h[tempGroup].label}:</span> <button onClick={() => { setFoodPicker(null); setTempGroup(''); setTempSubgroup(''); }} className="text-red-500 text-xs hover:text-red-700 transition-colors">✕ Cerrar</button></p>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(h[tempGroup].subgroups).map(([key, sub]: [string, any]) => (
                          <button key={key} onClick={() => { setTempSubgroup(key); setTempFood(sub.items[0]); setFoodPicker({ ...foodPicker, step: 'food' }); }} className="p-2 bg-white border rounded text-sm hover:bg-blue-50 text-left transition-all duration-150 active:scale-[0.98]">{(sub as any).label}</button>
                        ))}
                      </div>
                    </div>
                  )}
                  {foodPicker.step === 'food' && tempSubgroup && tempGroup && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium flex justify-between"><span>{h[tempGroup].subgroups[tempSubgroup].label}</span> <button onClick={() => setFoodPicker({ ...foodPicker, step: 'subgroup' })} className="text-blue-600 text-xs hover:underline transition-colors">← Atrás</button></p>
                      <select value={tempFood} onChange={e => setTempFood(e.target.value)} className="w-full p-2 border rounded bg-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all">
                        {h[tempGroup].subgroups[tempSubgroup].items.map((f: string) => <option key={f} value={f}>{f}</option>)}
                      </select>
                      <div className="flex gap-2">
                        {(['pequeña', 'mediana', 'grande'] as const).map(p => (
                          <button key={p} onClick={() => setTempPortion(p)} className={`flex-1 py-1 rounded text-sm transition-all duration-150 active:scale-[0.98] ${tempPortion === p ? 'bg-blue-600 text-white' : 'bg-white border hover:bg-blue-50'}`}>{p}</button>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => { setFoodPicker(null); setTempGroup(''); setTempSubgroup(''); setTempFood(''); setTempPortion('mediana'); }} className="flex-1 py-2 border rounded transition-all duration-150 active:scale-[0.98]">Cancelar</button>
                        <button onClick={handleConfirmFood} disabled={!tempFood} className="flex-1 py-2 bg-blue-600 text-white rounded disabled:opacity-50 transition-all duration-150 active:scale-[0.98]">Agregar</button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </section>
          );
        })}

        <section className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
          <h2 className="text-lg font-semibold mb-3">🏃 Actividad</h2>
          <div className="flex flex-wrap gap-2 mb-3">
            {activities.length === 0 ? <p className="text-sm text-gray-400 italic">Sin registros aún</p> :
              activities.map((a, idx) => (
                <span key={idx} className="inline-flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-sm transition-all duration-150 hover:bg-gray-200">
                  {a.type} ({a.minutes} min)
                  <button onClick={() => removeActivity(idx)} className="text-red-500 ml-1 font-bold hover:text-red-700 transition-colors">×</button>
                </span>
              ))}
          </div>
          {!editingActivity ? (
            <button onClick={() => setEditingActivity(true)} className="w-full bg-green-50 hover:bg-green-100 text-green-700 py-2 rounded-lg text-sm font-medium transition-all duration-150 active:scale-[0.98]">+ Agregar actividad</button>
          ) : (
            <div className="bg-gray-50 p-3 rounded-lg space-y-3 transition-all duration-200">
              <select value={tempActivity.type} onChange={e => setTempActivity({...tempActivity, type: e.target.value})} className="w-full p-2 border rounded bg-white focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none transition-all">
                {ACTIVITY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <div className="flex gap-2">
                {[15, 20, 30, 45].map(m => (
                  <button key={m} onClick={() => setTempActivity({...tempActivity, minutes: m})} className={`flex-1 py-1 rounded text-sm transition-all duration-150 active:scale-[0.98] ${tempActivity.minutes === m ? 'bg-green-600 text-white' : 'bg-white border hover:bg-green-50'}`}>{m}m</button>
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={() => setEditingActivity(false)} className="flex-1 py-2 border rounded transition-all duration-150 active:scale-[0.98]">Cancelar</button>
                <button onClick={handleAddActivity} className="flex-1 py-2 bg-green-600 text-white rounded transition-all duration-150 active:scale-[0.98]">Agregar</button>
              </div>
            </div>
          )}
        </section>

        <section className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
          <h2 className="text-lg font-semibold mb-3">😴 Sueño (día anterior)</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Horas dormidas</label>
              <select value={sleepHours} onChange={e => setSleepHours(Number(e.target.value))} className="w-full p-2 border rounded bg-white focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none transition-all">
                {[4,5,6,7,8,9,10].map(h => <option key={h} value={h}>{h}h</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Calidad</label>
              <div className="flex gap-1">
                {[1,2,3,4,5].map(n => (
                  <button key={n} onClick={() => setSleepQuality(n as any)} className={`flex-1 py-2 rounded text-lg transition-all duration-150 active:scale-[0.98] ${sleepQuality >= n ? 'bg-purple-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>{n}</button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
          <h2 className="text-lg font-semibold mb-3">🥤 Bebidas</h2>
          {drinks.length === 0 ? <p className="text-sm text-gray-400 italic mb-2">Sin registros aún</p> :
            drinks.map((d, idx) => (
              <span key={idx} className="inline-flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-sm mr-2 mb-2 transition-all duration-150 hover:bg-gray-200">
                {d.name} ({d.portion})
                <button onClick={() => setDrinks(prev => prev.filter((_, i) => i !== idx))} className="text-red-500 ml-1 hover:text-red-700 transition-colors">×</button>
              </span>
            ))}
          {!editingDrink ? (
            <button onClick={() => setEditingDrink(true)} className="w-full bg-purple-50 hover:bg-purple-100 text-purple-700 py-2 rounded-lg text-sm font-medium transition-all duration-150 active:scale-[0.98]">+ Agregar bebida</button>
          ) : (
            <div className="bg-gray-50 p-3 rounded-lg space-y-3 transition-all duration-200">
              <select value={tempDrink.type} onChange={e => setTempDrink({...tempDrink, type: e.target.value as DrinkType})} className="w-full p-2 border rounded focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none transition-all">
                {(['refresco','cerveza','cerveza-preparada','tragos','agua','otro'] as DrinkType[]).map(t => (
                  <option key={t} value={t}>{t === 'cerveza-preparada' ? 'Cerveza preparada' : t === 'tragos' ? 'Tragos preparados' : t.charAt(0).toUpperCase() + t.slice(1)}</option>
                ))}
              </select>
              <input type="text" placeholder="Nombre (ej: Cuba libre)" value={tempDrink.name} onChange={e => setTempDrink({...tempDrink, name: e.target.value})} className="w-full p-2 border rounded focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none transition-all" />
              <div className="flex gap-2">
                {(['pequeña','mediana','grande'] as const).map(p => (
                  <button key={p} onClick={() => setTempDrink({...tempDrink, portion: p})} className={`flex-1 py-1 rounded text-sm transition-all duration-150 active:scale-[0.98] ${tempDrink.portion === p ? 'bg-purple-600 text-white' : 'bg-white border hover:bg-purple-50'}`}>{p}</button>
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={() => setEditingDrink(false)} className="flex-1 py-2 border rounded transition-all duration-150 active:scale-[0.98]">Cancelar</button>
                <button onClick={() => { if(tempDrink.name) { setDrinks(prev => [...prev, {...tempDrink}]); setEditingDrink(false); setTempDrink({type:'refresco', name:'', portion:'mediana'}); } }} className="flex-1 py-2 bg-purple-600 text-white rounded transition-all duration-150 active:scale-[0.98]">Agregar</button>
              </div>
            </div>
          )}
        </section>

        <section className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
          <button onClick={() => setShowMetrics(!showMetrics)} className="w-full flex items-center justify-between text-left">
            <h2 className="text-lg font-semibold">📏 Métricas de salud (opcional)</h2>
            <span className={`transform transition-transform duration-200 ${showMetrics ? 'rotate-180' : ''}`}>▼</span>
          </button>
          {showMetrics && (
            <div className="mt-4 space-y-3 transition-all duration-200">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Peso (kg)</label>
                  <input type="number" placeholder="ej: 78.5" value={metrics.weight} onChange={e => setMetrics({...metrics, weight: e.target.value})} className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Glucosa (mg/dL)</label>
                  <input type="number" placeholder="ej: 95" value={metrics.glucose} onChange={e => setMetrics({...metrics, glucose: e.target.value})} className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Presión Sistólica</label>
                  <input type="number" placeholder="ej: 120" value={metrics.bpSys} onChange={e => setMetrics({...metrics, bpSys: e.target.value})} className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Presión Diastólica</label>
                  <input type="number" placeholder="ej: 80" value={metrics.bpDia} onChange={e => setMetrics({...metrics, bpDia: e.target.value})} className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all" />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Nota opcional</label>
                <input type="text" placeholder="ej: en ayunas, después de caminar..." value={metrics.note} onChange={e => setMetrics({...metrics, note: e.target.value})} className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all" />
              </div>
            </div>
          )}
        </section>

        <section className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
          <h2 className="text-lg font-semibold mb-3">😊 Bienestar</h2>
          {([
            { key: 'energy', label: 'Energía', icon: '⚡' },
            { key: 'satiety', label: 'Saciedad', icon: '😊' },
            { key: 'sleep', label: 'Sueño', icon: '😴' }
          ] as const).map(item => (
            <div key={item.key} className="mb-4">
              <label className="flex items-center gap-2 font-medium mb-2"><span>{item.icon}</span><span>{item.label}</span></label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(n => (
                  <button key={n} onClick={() => setWellness({...wellness, [item.key]: n})} className={`flex-1 py-2 rounded text-lg transition-all duration-150 active:scale-[0.98] ${wellness[item.key] >= n ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>{n}</button>
                ))}
              </div>
            </div>
          ))}
        </section>

        <button onClick={handleSaveDay} disabled={isLoading} className={`w-full py-4 px-6 rounded-xl font-semibold text-lg shadow-md transition-all duration-150 active:scale-[0.98] ${isLoading ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'}`}>
          {isLoading ? 'Guardando día...' : 'Guardar día completo ✅'}
        </button>
      </main>
      <BottomNav />
    </div>
  );
}