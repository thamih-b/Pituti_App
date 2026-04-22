import { useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MOCK_PETS, SPECIES_EMOJI, VACCINES_BY_PET, getVaccStatus } from '../hooks/usePets'
import type { VaccineRecord, PetWithAlerts } from '../hooks/usePets'
import { showToast } from '../components/AppLayout'
import Modal from '../components/Modal'
import Input from '../components/Input'
import VaccRing from '../components/VaccRing'
import AddCareModal from '../components/AddCareModal'
import AddMedicationModal from '../components/AddMedicationModal'
import RegisterSymptomModal from '../components/RegisterSymptomModal'
import { SymptomDetailModal, EditSymptomModal } from '../components/SymptomModals'
import NewNoteModal from '../components/NewNoteModal'
import EditPetModal from '../components/EditPetModal'
import EditCareModal from '../components/EditCareModal'
import PetChipEditOverlay from '../components/PetChipEditOverlay'
import { PfBtn, PfFooter } from '../components/FooterButtons'
import InviteSentOverlay from '../components/InviteSentOverlay'
import type { AddCareData } from '../components/AddCareModal'
import type { AddMedData } from '../components/AddMedicationModal'
import type { CareEditData } from '../components/EditCareModal'
import type { SymptomData } from '../components/RegisterSymptomModal'
import { useSymptoms, usePetSymptoms } from '../context/SymptomsContext'
import type { SymptomEntry } from '../context/SymptomsContext'


type ChipField = 'species' | 'birthDate' | 'weight' | 'caregivers'

function Toggle({ on, onChange }: { on:boolean; onChange:(v:boolean)=>void }) {
  return (
    <button className="toggle-pill" style={{ background:on?'var(--primary)':'var(--border)' }} onClick={()=>onChange(!on)}>
      <span className="toggle-pill-thumb" style={{ left:on?22:2 }}/>
    </button>
  )
}

/* ── REGISTER VACCINE MODAL (exported) ── */
export function RegisterVaccineModal({ petName, isOpen, onClose, vaccines, onRegister }: {
  petName:string; isOpen:boolean; onClose:()=>void
  vaccines:VaccineRecord[]
  onRegister:(v:{name:string;date:string;nextDate:string;vet:string;notes:string})=>void
}) {
  const today=new Date().toISOString().split('T')[0]
  const [form,setForm]=useState({selected:'',date:today,nextDate:'',vet:'',notes:''})
  const [errors,setErrors]=useState<Record<string,string>>({})
  const [success,setSuccess]=useState(false)
  const set=(k:keyof typeof form,v:string)=>{setForm(f=>({...f,[k]:v}));setErrors(e=>({...e,[k]:''})) }
  const validate=()=>{const e:Record<string,string>={};if(!form.selected)e.selected='Selecciona una vacuna';if(!form.date)e.date='Fecha obligatoria';if(!form.nextDate)e.next='Próxima dosis obligatoria';else if(new Date(form.nextDate)<=new Date(form.date))e.next='Debe ser posterior';return e}
  const handleSave=()=>{const e=validate();if(Object.keys(e).length){setErrors(e);return};setSuccess(true);setTimeout(()=>{onRegister({name:form.selected,date:form.date,nextDate:form.nextDate,vet:form.vet,notes:form.notes});showToast(`💉 "${form.selected}" registrada`);setSuccess(false);setForm({selected:'',date:today,nextDate:'',vet:'',notes:''});setErrors({});onClose()},1000)}
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Registrar vacuna" subtitle={`Aplicación en ${petName}`}
      icon="💉" accentBg="var(--blue-hl)" accentFg="var(--blue)"
      footer={!success
        ?<PfFooter><PfBtn variant="cancel" onClick={onClose}>Cancelar</PfBtn><PfBtn variant="register" onClick={handleSave}>Registrar aplicación</PfBtn></PfFooter>
        :<></>}>
      {success
        ?<div className="modal-success"><div className="modal-success-icon">✓</div><div className="modal-success-title">¡Registrado!</div><div className="modal-success-sub">Vacuna añadida al historial de {petName}</div></div>
        :<>
          <div className="modal-section">Vacuna</div>
          <div className="form-group"><label className="form-label">Seleccionar *</label>
            <select className={['form-input',errors.selected?'form-input--err':''].join(' ')} value={form.selected} onChange={e=>set('selected',e.target.value)}>
              <option value="">Elige…</option>{vaccines.map(v=><option key={v.name} value={v.name}>{v.name}</option>)}
            </select>{errors.selected&&<span className="form-hint-err">{errors.selected}</span>}
          </div>
          <div className="modal-section">Fechas</div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Aplicación *</label>
              <input type="date" className={['form-input',errors.date?'form-input--err':''].join(' ')} value={form.date} onChange={e=>set('date',e.target.value)}/>{errors.date&&<span className="form-hint-err">{errors.date}</span>}
            </div>
            <div className="form-group"><label className="form-label">Próxima *</label>
              <input type="date" className={['form-input',errors.next?'form-input--err':''].join(' ')} value={form.nextDate} onChange={e=>set('nextDate',e.target.value)}/>{errors.next&&<span className="form-hint-err">{errors.next}</span>}
            </div>
          </div>
          <div className="modal-section">Info adicional</div>
          <div className="form-group"><label className="form-label">Veterinario (opcional)</label>
            <div className="field-icon-wrap"><span className="field-icon">🩺</span><input className="form-input" placeholder="Dra. García" value={form.vet} onChange={e=>set('vet',e.target.value)}/></div>
          </div>
          <div className="form-group"><label className="form-label">Notas (opcional)</label>
            <textarea className="form-input" rows={2} value={form.notes} onChange={e=>set('notes',e.target.value)} style={{resize:'vertical',minHeight:60,fontFamily:'inherit'}}/>
          </div>
        </>}
    </Modal>
  )
}

/* ── SHARE MODAL ── */
function ShareModal({ petName, isOpen, onClose }: { petName:string; isOpen:boolean; onClose:()=>void }) {
  const [email,   setEmail]   = useState('')
  const [role,    setRole]    = useState('caregiver')
  const [emailErr,setEmailErr]= useState('')
  const [caregivers,setCaregivers]=useState([
    { id:'tl', initials:'TL', name:'Thamires Lopes', role:'Propietaria · acceso completo', bg:'var(--pal-lilac)', color:'var(--nav-bg)', badge:'Tú',  removable:false },
    { id:'am', initials:'AM', name:'Ana Martínez',   role:'Cuidadora · puede registrar',  bg:'var(--blue-hl)',  color:'var(--blue)',   badge:null, removable:true  },
  ])
  const [inviteSent, setInviteSent] = useState(false)
  const [sentEmail,  setSentEmail]  = useState('')

  const ACCESS=[
    { val:'readonly',icon:'👁',label:'Solo lectura',sub:'Ver registros' },
    { val:'caregiver',icon:'✏️',label:'Cuidador',sub:'Registrar cuidados y vacunas' },
    { val:'full',icon:'⚙️',label:'Acceso completo',sub:'Editar perfil y todos los datos' },
  ]
  const handleInvite=()=>{
    if(!email.trim()||!/\S+@\S+\.\S+/.test(email)){setEmailErr('Introduce un email válido');return}
    const initials=email.split('@')[0].slice(0,2).toUpperCase()
    const roleLabel=ACCESS.find(a=>a.val===role)?.label??role
    setCaregivers(p=>[...p,{id:Date.now().toString(),initials,name:email,role:roleLabel,bg:'var(--gold-hl)',color:'var(--gold)',badge:null,removable:true}])
    setSentEmail(email); setEmail(''); setEmailErr(''); setInviteSent(true)
  }
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Compartir cuidados" subtitle={`Invita a cuidadores de ${petName}`}
        icon="👥" accentBg="var(--blue-hl)" accentFg="var(--blue)" size="md"
        footer={<PfFooter><PfBtn variant="add" onClick={handleInvite}>Enviar invitación</PfBtn></PfFooter>}>
        <div className="modal-section">Cuidadores activos <span className="badge badge-gray">{caregivers.length}</span></div>
        <div style={{ display:'flex',flexDirection:'column',gap:'.5rem',marginBottom:'.5rem' }}>
          {caregivers.map(u=>(
            <div key={u.id} className="caregiver-row">
              <div className="caregiver-row-avatar" style={{ background:u.bg,color:u.color }}>{u.initials}</div>
              <div style={{ flex:1 }}><div className="caregiver-row-name">{u.name}</div><div className="caregiver-row-role">{u.role}</div></div>
              {u.badge?<span className="badge badge-green">{u.badge}</span>
                :<PfBtn variant="delete" size="sm" onClick={()=>{setCaregivers(p=>p.filter(c=>c.id!==u.id));showToast('Cuidador eliminado')}}>Eliminar</PfBtn>}
            </div>
          ))}
        </div>
        <div className="modal-section">Invitar nuevo cuidador</div>
        <div className="form-group" style={{ marginBottom:'1rem' }}>
          <label className="form-label">Email *</label>
          <div className="field-icon-wrap" style={{ width:'100%' }}>
            <span className="field-icon">✉</span>
            <input className={['form-input',emailErr?'form-input--err':''].join(' ')} type="email" placeholder="nombre@email.com"
              value={email} onChange={e=>{setEmail(e.target.value);setEmailErr('')}} style={{ width:'100%' }}/>
          </div>
          {emailErr&&<span className="form-hint-err">{emailErr}</span>}
        </div>
        <div className="form-group" style={{ marginBottom:0 }}>
          <label className="form-label">Nivel de acceso</label>
          <div className="access-options">
            {ACCESS.map(a=>(
              <div key={a.val} className={['access-option',role===a.val?'selected':''].join(' ')} onClick={()=>setRole(a.val)}>
                <div className="access-option-icon">{a.icon}</div>
                <div style={{ flex:1 }}><div className="access-option-label">{a.label}</div><div className="access-option-sub">{a.sub}</div></div>
                <div className="access-radio"/>
              </div>
            ))}
          </div>
        </div>
      </Modal>
      {inviteSent && <InviteSentOverlay email={sentEmail} onClose={()=>setInviteSent(false)}/>}
    </>
  )
}

/* ── TAB CARES (compact) ── */
function TabCares({ petId, petName }: { petId:string; petName:string }) {
  const [items,setItems]=useState([
    { id:'feed',emoji:'🍽️',title:'Alimentación',sub:'2× al día · 80g',total:2,done:1,bg:'linear-gradient(135deg,#FFF3DC,#FFE0A0)',doneState:false },
    { id:'water',emoji:'💧',title:'Agua fresca',sub:'1× al día',total:1,done:1,bg:'linear-gradient(135deg,#E0F4FF,#B8E0FF)',doneState:true },
    { id:'brush',emoji:'✂️',title:'Cepillado',sub:'3× por semana',total:3,done:2,bg:'linear-gradient(135deg,#F0E8FF,#DDD0FF)',doneState:false },
    { id:'arena',emoji:'🧹',title:'Caja de arena',sub:'Diaria',total:1,done:1,bg:'linear-gradient(135deg,#FFF0E0,#FFD8B0)',doneState:true },
  ])
  const [editItem,setEditItem]=useState<CareEditData|null>(null)
  const [editOpen,setEditOpen]=useState(false)
  const [addOpen,setAddOpen]=useState(false)
  const toggle=(id:string)=>{setItems(p=>p.map(i=>i.id!==id?i:{...i,doneState:!i.doneState,done:!i.doneState?i.total:Math.max(0,i.done-1)}));showToast('✓ Cuidado registrado')}
  const handleSaveEdit=(updated:CareEditData)=>setItems(p=>p.map(i=>i.id!==updated.id?i:{...i,emoji:updated.emoji,title:updated.title,total:updated.total,sub:`${updated.total}× ${updated.period==='day'?'al día':'por semana'}${updated.quantity?' · '+updated.quantity:''}`}))
  const handleAddCare=(d:AddCareData)=>{const bgs=['linear-gradient(135deg,#FFF3DC,#FFE0A0)','linear-gradient(135deg,#E0F4FF,#B8E0FF)','linear-gradient(135deg,#E8FFE8,#B8F0B8)'];setItems(p=>[...p,{id:`c-${Date.now()}`,emoji:d.emoji,title:d.title,sub:`${d.total}× día${d.quantity?' · '+d.quantity:''}`,total:d.total,done:0,bg:bgs[p.length%bgs.length],doneState:false}]);showToast(`${d.emoji} ${d.title} añadido`)}
  return (
    <>
      <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'1.125rem' }}>
        <div><div style={{ fontWeight:800,fontSize:'1rem',color:'var(--text)' }}>Cuidados de hoy</div><div style={{ fontSize:'.8125rem',color:'var(--text-muted)',marginTop:'.1rem' }}>{items.filter(i=>i.doneState).length} de {items.length} completados</div></div>
        <button className="btn btn-primary btn-sm" onClick={()=>setAddOpen(true)}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
          Añadir
        </button>
      </div>
      <div className="care-grid">
        {items.map(item=>(
          <div key={item.id} className={['care-card',item.doneState?'done':''].join(' ')}>
            <div className="care-header"><div className="care-emoji" style={{ background:item.bg }}>{item.emoji}</div><div><div className="care-title">{item.title}</div><div className="care-sub">{item.sub}</div></div></div>
            <div className="care-progress"><div className="care-dots">{Array.from({length:Math.min(item.total,7)}).map((_,j)=><div key={j} className={`care-dot ${j<item.done?'done':''}`}/>)}</div><span>{item.doneState?<span style={{ color:'var(--success)' }}>Hecho ✓</span>:`${item.done}/${item.total}`}</span></div>
            <div className="care-actions">
              <button className={`care-btn-do ${item.doneState?'done-btn':''}`} onClick={()=>toggle(item.id)}>✓ {item.doneState?'Hecho':'Registrar'}</button>
              <button className="care-btn-cfg" title="Editar" onClick={()=>{setEditItem({id:item.id,emoji:item.emoji,title:item.title,total:item.total,period:'day',quantity:'',notify:true,bg:item.bg});setEditOpen(true)}}>✏️</button>
            </div>
          </div>
        ))}
      </div>
      <EditCareModal isOpen={editOpen} onClose={()=>setEditOpen(false)} care={editItem} onSave={handleSaveEdit} onDelete={id=>setItems(p=>p.filter(i=>i.id!==id))}/>
      <AddCareModal isOpen={addOpen} onClose={()=>setAddOpen(false)} onAdd={handleAddCare} defaultPetId={petId}/>
    </>
  )
}

/* ── TAB VACCINES (compact) ── */
function TabVaccines({ petId, petName }: { petId:string; petName:string }) {
  const [registerOpen,setRegisterOpen]=useState(false);const [extraVacc,setExtraVacc]=useState<VaccineRecord[]>([])
  const base=VACCINES_BY_PET[petId]??[];const vaccines=[...base,...extraVacc];const withStatus=vaccines.map(v=>({...v,cls:getVaccStatus(v.nextDate) as 'ok'|'soon'|'late'}))
  const okCount=withStatus.filter(v=>v.cls==='ok').length;const alDia=withStatus.filter(v=>v.cls==='ok'||v.cls==='soon').length;const pending=withStatus.filter(v=>v.cls==='soon'||v.cls==='late').length;const total=vaccines.length
  const cov=total>0?Math.round(okCount/total*100):100;const alPct=total>0?Math.round(alDia/total*100):100;const penPct=total>0?Math.round(pending/total*100):0
  const handleRegister=({name,date,nextDate}:{name:string;date:string;nextDate:string;vet:string;notes:string})=>{
    const lbl=new Date(date+'T12:00:00').toLocaleDateString('es-ES',{day:'2-digit',month:'short',year:'numeric'});const cls=getVaccStatus(nextDate)
    setExtraVacc(prev=>[...prev,{name,applied:lbl,nextDate,badge:cls==='ok'?'AL DÍA':cls==='soon'?'POR VENCER':'VENCIDA',badgeCls:cls==='ok'?'badge-green':cls==='soon'?'badge-yellow':'badge-red'}])
  }
  return (
    <>
      <div className="grid-2">
        <div className="card">
          <div className="card-title">Vacunas <button className="btn btn-primary btn-sm" onClick={()=>setRegisterOpen(true)}>💉 Registrar</button></div>
          {withStatus.length===0?<div style={{ textAlign:'center',padding:'2rem',color:'var(--text-muted)',fontSize:'.875rem' }}>Sin vacunas</div>:withStatus.map(v=>(
            <div key={v.name+v.nextDate} className="vaccine-row" style={{ display:'flex',alignItems:'center',gap:'.875rem',padding:'.75rem 0',borderBottom:'1.5px solid var(--divider)' }}>
              <div className="vaccine-icon" style={{ background:v.cls==='ok'?'var(--success-hl)':v.cls==='soon'?'var(--gold-hl)':'var(--err-hl)', color:v.cls==='ok'?'var(--success)':v.cls==='soon'?'var(--gold)':'var(--err)' }}>💉</div>
              <div style={{ flex:1 }}><div className="vaccine-name">{v.name}</div><div className="vaccine-date">Aplicada {v.applied}</div></div>
              <div style={{ textAlign:'right' }}>
                <div className={`vaccine-next ${v.cls}`}>{v.cls==='late'?`Vencida · ${new Date(v.nextDate+'T12:00:00').toLocaleDateString('es-ES')}`:`Próxima ${new Date(v.nextDate+'T12:00:00').toLocaleDateString('es-ES')}`}</div>
                <span className={`badge ${v.badgeCls}`} style={{ fontSize:'.6rem' }}>{v.badge}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="card">
          <div className="card-title">Cobertura</div>
          <div style={{ display:'flex',justifyContent:'center',margin:'1rem 0 1.5rem' }}><VaccRing coverage={cov} size={96} strokeWidth={8}/></div>
          {[{label:'Cobertura vacunal',pct:cov,color:''},{label:'Vacunas al día',pct:alPct,color:'success'},{label:'Pendientes/vencidas',pct:penPct,color:penPct>0?'warn':'success'}].map(b=>(
            <div key={b.label} style={{ marginBottom:'.875rem' }}>
              <div style={{ display:'flex',justifyContent:'space-between',fontSize:'.8125rem',marginBottom:'.375rem' }}><span style={{ color:'var(--text-muted)' }}>{b.label}</span><span style={{ fontWeight:700 }}>{b.pct}%</span></div>
              <div className="progress-wrap"><div className={`progress-bar ${b.color}`} style={{ width:`${b.pct}%` }}/></div>
            </div>
          ))}
        </div>
      </div>
      <RegisterVaccineModal petName={petName} isOpen={registerOpen} onClose={()=>setRegisterOpen(false)} vaccines={vaccines} onRegister={handleRegister}/>
    </>
  )
}

/* ══ PET DETAIL PAGE ══ */
const TABS = ['🐾 Cuidados','Vacunas','Medicamentos','Síntomas','Notas','Historial']

export default function PetDetailPage() {
  const { petId }  = useParams<{ petId:string }>()
  const navigate   = useNavigate()
  const [activeTab,setActiveTab]         = useState(0)
  const [shareOpen,setShareOpen]         = useState(false)
  const [editOpen,setEditOpen]           = useState(false)
  const [addMedOpen,setAddMedOpen]       = useState(false)
  const [addNoteOpen,setAddNoteOpen]     = useState(false)
  const [addSymptomOpen,setAddSymptomOpen]=useState(false)
  const [chipField,setChipField]         = useState<ChipField|null>(null)
  const [petData,setPetData]             = useState<PetWithAlerts>(MOCK_PETS.find(p=>p.id===petId)??MOCK_PETS[0])
  const [photoUrl,setPhotoUrl]           = useState<string|null>(()=>{ try{return localStorage.getItem('pet-photo-'+(petId??MOCK_PETS[0].id))}catch{return null} })

  // Synced symptoms
  const { addSymptom, saveSymptom, resolve, unresolve } = useSymptoms()
  const { active: activeSymptoms, resolved: resolvedSymptoms } = usePetSymptoms(petData.id)
  const [detailSym,setDetailSym]         = useState<SymptomEntry|null>(null)
  const [editSym,setEditSym]             = useState<SymptomEntry|null>(null)
  const [editSymOpen,setEditSymOpen]     = useState(false)

  const photoRef = useRef<HTMLInputElement>(null)
  const [localMeds,setLocalMeds]=useState([{ id:'m1',icon:'💊',bg:'var(--warn-hl)',color:'var(--warn)',title:'Antiparasitario — Bravecto',sub:'1 comprimido cada 3 meses · Próxima: 10 jul 2026',badge:'Activo',badgeCls:'badge-green' }])
  const [localNotes,setLocalNotes]=useState([{ id:'note-1',icon:'📋',bg:'var(--primary-hl)',color:'var(--primary)',title:'Control anual — Dra. Martínez',sub:`${petData.name} en buen estado. Peso estable. Revisar vacuna antirrábica.`,date:'10 ene 2026' }])

  const handlePhotoChange=(e:React.ChangeEvent<HTMLInputElement>)=>{const file=e.target.files?.[0];if(!file)return;const reader=new FileReader();reader.onload=ev=>{const r=ev.target?.result as string;if(r){setPhotoUrl(r);try{localStorage.setItem('pet-photo-'+petData.id,r)}catch{};showToast('📸 Foto actualizada')}};reader.readAsDataURL(file)}

  const handleChipSave=(updated:Partial<PetWithAlerts>)=>{setPetData(prev=>({...prev,...updated}));setChipField(null)}

  const SEV_COLOR: Record<string,string> = { leve:'var(--gold)', moderado:'var(--warn)', grave:'var(--err)', emergencia:'var(--err)' }
  const SEV_BG:    Record<string,string> = { leve:'var(--gold-hl)', moderado:'var(--warn-hl)', grave:'var(--err-hl)', emergencia:'var(--err-hl)' }
  const CAT_ICON:  Record<string,string> = { digestivo:'🤢', respiratorio:'🫁', piel:'🩹', comportamiento:'🧠', movimiento:'🦶', ocular:'👁', otro:'❓' }

  return (
    <div>
      <button className="btn btn-ghost btn-sm" style={{ marginBottom:'1rem' }} onClick={()=>navigate('/pets')}>← Mis mascotas</button>

      {/* Pet hero */}
      <div className="pet-profile-hero">
        <div className="pet-photo-wrap">
          <div className="pet-photo-circle">
            {photoUrl?<img src={photoUrl} alt={petData.name}/>:<span>{SPECIES_EMOJI[petData.species]??'🐾'}</span>}
          </div>
          <button className="pet-photo-btn" onClick={()=>photoRef.current?.click()} title="Cambiar foto">📷</button>
          <input ref={photoRef} type="file" accept="image/*" style={{ display:'none' }} onChange={handlePhotoChange}/>
        </div>
        <div style={{ flex:1 }}>
          <div style={{ display:'flex',alignItems:'center',gap:'.5rem' }}>
            <h1 style={{ fontFamily:'var(--font-display)',fontSize:'1.5rem',fontWeight:400 }}>{petData.name}</h1>
            <span style={{ fontSize:'1.1rem' }}>{SPECIES_EMOJI[petData.species]}</span>
            <span className="badge badge-green" style={{ marginLeft:'.25rem' }}>Saludable</span>
          </div>
          <p style={{ fontSize:'.875rem',color:'var(--text-muted)',marginTop:'.2rem' }}>{petData.breed??'Raza desconocida'} · 4 años</p>
          <div style={{ display:'flex',gap:'.375rem',flexWrap:'wrap',marginTop:'.5rem' }}>
            {petData.alerts.map((a,i)=><span key={i} className={`badge ${a.type==='err'?'badge-red':'badge-yellow'}`}>{a.type==='warn'?'⚠️':'🔴'} {a.text.slice(0,28)}…</span>)}
            <span className="badge badge-blue">💊 Med. activo</span>
          </div>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={()=>setEditOpen(true)}>✏ Editar</button>
      </div>

      {/* Clickable stat chips — each opens edit overlay */}
      <div className="stat-row">
        {([
          { label:'Especie',    field:'species'   as ChipField, value:petData.species==='cat'?'Gato 🐱':petData.species==='dog'?'Perro 🐶':'Ave 🦜' },
          { label:'Nacimiento', field:'birthDate' as ChipField, value:petData.birthDate?new Date(petData.birthDate+'T12:00:00').toLocaleDateString('es-ES'):'—' },
          { label:'Peso',       field:'weight'    as ChipField, value:petData.species==='cat'?'4.2 kg':petData.species==='dog'?'12.4 kg':'32 g' },
          { label:'Cuidadores', field:'caregivers' as ChipField, value:null },
        ] as const).map(s=>(
          <div key={s.label}
            className="stat-chip clickable"
            onClick={()=>setChipField(s.field)}
            title={`Editar ${s.label}`}
          >
            <span className="stat-chip-edit-hint">✏</span>
            <div className="stat-chip-label">{s.label}</div>
            {s.value
              ?<div className="stat-chip-value" style={{ fontSize:'1rem' }}>{s.value}</div>
              :<div style={{ display:'flex',gap:4,marginTop:4 }}>
                <div className="caregiver-avatar" style={{ width:28,height:28,fontSize:'.625rem' }}>TL</div>
                {petData.id==='pet-1'&&<div className="caregiver-avatar" style={{ width:28,height:28,fontSize:'.625rem',background:'var(--blue-hl)',color:'var(--blue)' }}>AM</div>}
              </div>}
          </div>
        ))}
      </div>

      {/* Caregivers bar */}
      <div style={{ display:'flex',alignItems:'center',gap:'.625rem',marginBottom:'1.125rem',padding:'.75rem 1rem',background:'var(--surface)',border:'1.5px solid var(--border)',borderRadius:'var(--r-xl)',boxShadow:'var(--sh-sm)' }}>
        <span style={{ fontSize:'.8125rem',fontWeight:700,color:'var(--text-muted)',flex:1 }}>Cuidadores compartidos</span>
        <div className="caregiver-avatars">
          <div className="caregiver-avatar" style={{ width:30,height:30,fontSize:'.625rem' }}>TL</div>
          {petData.id==='pet-1'&&<div className="caregiver-avatar" style={{ width:30,height:30,fontSize:'.625rem',background:'var(--blue-hl)',color:'var(--blue)' }}>AM</div>}
        </div>
        <button className="btn btn-secondary btn-sm" onClick={()=>setShareOpen(true)}>👥 Compartir</button>
      </div>

      <div className="tabs">{TABS.map((t,i)=><div key={t} className={`tab ${activeTab===i?'active':''}`} onClick={()=>setActiveTab(i)}>{t}</div>)}</div>

      {activeTab===0 && <TabCares petId={petData.id} petName={petData.name}/>}
      {activeTab===1 && <TabVaccines petId={petData.id} petName={petData.name}/>}
      {activeTab===2 && (
        <div className="card">
          <div className="card-title">Medicamentos activos
            <button className="btn btn-primary btn-sm" onClick={()=>setAddMedOpen(true)}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>Añadir
            </button>
          </div>
          {localMeds.map(m=><div key={m.id} className="list-item"><div className="list-item-icon" style={{ background:m.bg,color:m.color }}>{m.icon}</div><div className="list-item-info"><div className="list-item-title">{m.title}</div><div className="list-item-sub">{m.sub}</div></div><div className="list-item-right"><span className={`badge ${m.badgeCls}`}>{m.badge}</span></div></div>)}
        </div>
      )}

      {activeTab===3 && (
        <div>
          <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'1rem' }}>
            <div style={{ fontWeight:800,fontSize:'1rem',color:'var(--text)' }}>Síntomas de {petData.name}</div>
            <button className="btn btn-primary btn-sm" onClick={()=>setAddSymptomOpen(true)}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>Registrar
            </button>
          </div>
          {activeSymptoms.length===0&&resolvedSymptoms.length===0
            ?
            
            <PfFooter>
  <PfBtn variant="save" onClick={()=>setAddSymptomOpen(true)}>Registrar síntoma</PfBtn>
</PfFooter>
            :<div className="grid-2">
              <div className="card">
                <div className="card-title">Activos {activeSymptoms.length>0&&<span className="badge badge-red">{activeSymptoms.length}</span>}</div>
                {activeSymptoms.length===0?<div style={{ textAlign:'center',padding:'1.5rem',color:'var(--text-muted)',fontSize:'.875rem' }}>Sin síntomas activos ✓</div>:activeSymptoms.map(s=>(
                  <div key={s.id} className="list-item symptom-row-clickable" onClick={()=>setDetailSym(s)}>
                    <div className="list-item-icon" style={{ background:SEV_BG[s.severity]||'var(--err-hl)',color:SEV_COLOR[s.severity]||'var(--err)' }}>{CAT_ICON[s.category]??'🌡️'}</div>
                    <div className="list-item-info"><div className="list-item-title">{s.description.slice(0,40)}{s.description.length>40?'…':''}</div><div className="list-item-sub">{s.category} · {new Date(s.date+'T12:00:00').toLocaleDateString('es-ES')}</div></div>
                    <span className="badge badge-yellow" style={{ flexShrink:0 }}>Activo</span>
                  </div>
                ))}
              </div>
              <div className="card">
                <div className="card-title">Resueltos</div>
                {resolvedSymptoms.length===0?<div style={{ textAlign:'center',padding:'1.5rem',color:'var(--text-muted)',fontSize:'.875rem' }}>Sin síntomas resueltos</div>:resolvedSymptoms.map(s=>(
                  <div key={s.id} className="list-item symptom-row-clickable" style={{ opacity:.7 }} onClick={()=>setDetailSym(s)}>
                    <div className="list-item-icon" style={{ background:'var(--surface-offset)',color:'var(--text-faint)' }}>{CAT_ICON[s.category]??'🌡️'}</div>
                    <div className="list-item-info"><div className="list-item-title">{s.description.slice(0,40)}{s.description.length>40?'…':''}</div><div className="list-item-sub">{s.category} · Resuelto</div></div>
                    <span className="badge badge-gray" style={{ flexShrink:0 }}>Resuelto</span>
                  </div>
                ))}
              </div>
            </div>
          }
        </div>
      )}

      {activeTab===4 && (
        <div className="card">
          <div className="card-title">Notas <button className="btn btn-primary btn-sm" onClick={()=>setAddNoteOpen(true)}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>Nueva</button></div>
          {localNotes.map(n=><div key={n.id} className="list-item"><div className="list-item-icon" style={{ background:'var(--primary-hl)',color:'var(--primary)' }}>{n.icon}</div><div className="list-item-info"><div className="list-item-title">{n.title}</div><div className="list-item-sub">{n.sub}</div></div><span style={{ fontSize:'.75rem',color:'var(--text-faint)',flexShrink:0 }}>{n.date}</span></div>)}
        </div>
      )}

      {activeTab===5 && (
        <div className="card"><div className="card-title">Historial completo</div>
          <div className="timeline">
            {[{cls:'vaccine',icon:'💉',title:'Vacuna antirrábica aplicada',meta:'Dra. García · VetSalud',time:'Hoy'},{cls:'med',icon:'💊',title:'Bravecto',meta:'1 comprimido',time:'Hace 3d'},{cls:'note',icon:'📋',title:'Control anual',meta:'Peso 4.2 kg',time:'10 ene'}].map(e=>(
              <div key={e.title} className="timeline-item"><div className={`tl-icon ${e.cls}`}>{e.icon}</div><div style={{ flex:1 }}><div className="tl-title">{e.title}</div><div className="tl-meta">{e.meta}</div></div><div className="tl-time">{e.time}</div></div>
            ))}
          </div>
        </div>
      )}

      {/* All modals */}
      <ShareModal petName={petData.name} isOpen={shareOpen} onClose={()=>setShareOpen(false)}/>
      <EditPetModal isOpen={editOpen} onClose={()=>setEditOpen(false)} onSave={setPetData} pet={petData}/>
      <AddMedicationModal isOpen={addMedOpen} onClose={()=>setAddMedOpen(false)} onAdd={(d:AddMedData)=>{setLocalMeds(p=>[...p,{id:`m${Date.now()}`,icon:'💊',bg:'var(--warn-hl)',color:'var(--warn)',title:`${d.name}`,sub:`${d.dose} · ${d.frequency}`,badge:'Activo',badgeCls:'badge-green'}]);setAddMedOpen(false)}} defaultPetId={petData.id}/>
      <NewNoteModal isOpen={addNoteOpen} onClose={()=>setAddNoteOpen(false)} onAdd={(d)=>{setLocalNotes(p=>[{id:`n${Date.now()}`,icon:'📋',bg:'var(--primary-hl)',color:'var(--primary)',title:`${d.type} — ${d.vet||'Sin vet'}`,sub:d.content.slice(0,80),date:new Date(d.date+'T12:00:00').toLocaleDateString('es-ES')},...p]);setAddNoteOpen(false);showToast('📋 Nota guardada')}} defaultPetId={petData.id}/>

      <RegisterSymptomModal isOpen={addSymptomOpen} onClose={()=>setAddSymptomOpen(false)}
        onAdd={(d:SymptomData)=>{addSymptom({...d,resolved:false});setAddSymptomOpen(false);showToast('🌡️ Síntoma registrado')}}
        defaultPetId={petData.id}/>

      <SymptomDetailModal symptom={detailSym} onClose={()=>setDetailSym(null)}
        onEdit={s=>{setDetailSym(null);setEditSym(s);setEditSymOpen(true)}}
        onResolve={id=>{resolve(id);setDetailSym(null);showToast('✓ Síntoma resuelto')}}
        onUnresolve={id=>{unresolve(id);setDetailSym(null);showToast('↩ Síntoma reabierto')}}/>

      <EditSymptomModal isOpen={editSymOpen} onClose={()=>setEditSymOpen(false)} symptom={editSym}
        onSave={updated=>{saveSymptom(updated);setEditSymOpen(false);showToast('🌡️ Síntoma actualizado')}}/>

      {/* Chip edit overlay */}
      <PetChipEditOverlay pet={petData} field={chipField} onClose={()=>setChipField(null)} onSave={handleChipSave}/>
    </div>
  )
}
