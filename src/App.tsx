import { useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import {
  ArrowLeft, ArrowSquareOut, CaretDown, CaretRight, CheckCircle, Database,
  Dna, Flask, MagnifyingGlass, Pill, ShieldCheck, WarningCircle, X,
} from '@phosphor-icons/react'
import {
  contentUpdatedAt, contentVersion, evidenceRecords, findEvidenceRecord,
  getRecordAlterations, getRecordCancers, getRecordTherapies,
  getReferencedTherapyCount, searchEvidence, type BiomarkerEvidenceRecord,
  type LookupMode, type TherapyUse,
} from './data/geneEvidence'
import { getCoverageLabels, therapyById, type TherapyRecord } from './data/therapyCatalog'

const lookupModes: Array<{ id: LookupMode; label: string; helper: string }> = [
  { id: 'all', label: '综合', helper: '标志物、变异、药物或癌种' },
  { id: 'gene', label: '标志物找药', helper: '如 EGFR T790M' },
  { id: 'drug', label: '药物找标志物', helper: '如 谷美替尼' },
  { id: 'cancer', label: '癌种找标志物', helper: '如 胃癌' },
]
const quickSearches: Array<{ label: string; mode: LookupMode }> = [
  { label: 'EGFR T790M', mode: 'gene' },
  { label: '塞普替尼', mode: 'drug' },
  { label: '多发性骨髓瘤', mode: 'cancer' },
]
const therapyCount = getReferencedTherapyCount()

function CoverageBadges({ therapy, compact = false }: { therapy: TherapyRecord; compact?: boolean }) {
  const labels = getCoverageLabels(therapy)
  return (
    <span className={`coverage-badges${compact ? ' coverage-badges--compact' : ''}`}>
      {labels.length > 0
        ? labels.map((label) => <span className="coverage-badge" key={label}>{label}</span>)
        : <span className="coverage-badge coverage-badge--muted">目录未标记</span>}
    </span>
  )
}

function BrandHeader() {
  return (
    <header className="lookup-brand">
      <div className="lookup-brand__lockup">
        <img className="lookup-brand__orb" src="./assets/brand/oncorounds-orb.png" alt="" aria-hidden="true" />
        <div><p>ONCOROUNDS · 系列小工具</p><h1>基因速查</h1></div>
      </div>
      <span className="lookup-brand__count">{evidenceRecords.length} 个标志物 · {therapyCount} 个药物</span>
    </header>
  )
}

interface ResultCardProps {
  record: BiomarkerEvidenceRecord
  onOpen: () => void
  onTherapySearch: (therapy: string) => void
}

function ResultCard({ record, onOpen, onTherapySearch }: ResultCardProps) {
  const [expanded, setExpanded] = useState(false)
  const therapies = getRecordTherapies(record)
  const cancers = getRecordCancers(record)
  const alterations = getRecordAlterations(record)
  const visibleTherapies = expanded ? therapies : therapies.slice(0, 4)

  return (
    <article className="evidence-card" onClick={onOpen}>
      <div className="evidence-card__topline">
        <div className="gene-identity">
          <span className="gene-identity__symbol">{record.symbol}</span>
          <div>
            <h2>{record.nameZh}</h2>
            <p>{alterations.length === 1 ? alterations[0] : `${alterations.length} 类证据分组`}</p>
          </div>
        </div>
        <span className="evidence-pill"><ShieldCheck size={14} weight="fill" />{record.markerType}</span>
      </div>

      <div className="tag-row" aria-label="相关癌种">
        {cancers.map((cancer) => <span key={cancer}>{cancer}</span>)}
      </div>

      <div className="therapy-block" onClick={(event) => event.stopPropagation()}>
        <div className="therapy-block__heading">
          <span><Pill size={17} weight="duotone" />国内获批相关药物</span>
          <small>{therapies.length} 项</small>
        </div>
        <div className="therapy-list">
          {visibleTherapies.map((therapy) => (
            <button type="button" className="therapy-button" key={therapy.id}
              onClick={() => onTherapySearch(therapy.aliases[0] ?? therapy.name)}
              aria-label={`反查 ${therapy.name} 对应标志物`}>
              <span className="therapy-button__copy"><strong>{therapy.name}</strong><CoverageBadges therapy={therapy} compact /></span>
              <CaretRight size={14} weight="bold" />
            </button>
          ))}
        </div>
        {therapies.length > 4 && (
          <button type="button" className="therapy-list__toggle" aria-expanded={expanded}
            onClick={() => setExpanded((value) => !value)}>
            <span>{expanded ? '收起' : `展开全部 ${therapies.length} 项`}</span>
            <CaretDown size={15} weight="bold" />
          </button>
        )}
      </div>

      <button className="evidence-card__detail" type="button" data-record-id={record.id}
        onClick={(event) => { event.stopPropagation(); onOpen() }}
        aria-label={`查看 ${record.symbol} 临床结论与适用条件`}>
        <span><CheckCircle size={17} weight="fill" />查看临床结论与适用条件</span>
        <CaretRight size={17} weight="bold" />
      </button>
    </article>
  )
}

function TherapyDisclosure({ therapyUse }: { therapyUse: TherapyUse }) {
  const therapy = therapyById.get(therapyUse.therapyId)
  if (!therapy) return null
  return (
    <details className="therapy-disclosure">
      <summary>
        <span className="therapy-disclosure__summary-copy">
          <strong>{therapy.name}</strong>
          <small>{therapy.therapyType} · {therapyUse.relationType}</small>
          <CoverageBadges therapy={therapy} />
        </span>
        <span className="therapy-disclosure__status">{therapyUse.regulatoryStatus}</span>
        <CaretDown size={16} weight="bold" />
      </summary>
      <div className="therapy-disclosure__body">
        <dl className="therapy-facts">
          <div><dt>关系类型</dt><dd>{therapyUse.relationType}</dd></div>
          <div><dt>适用场景</dt><dd>{therapyUse.useContext}</dd></div>
          <div><dt>NMPA批准状态</dt><dd>{therapyUse.regulatoryStatus}</dd></div>
        </dl>
        <a className="approval-source" href={therapyUse.approvalSource.url} target="_blank" rel="noreferrer">
          <Database size={18} weight="duotone" />
          <span><small>NMPA 批准信息 · 核对 {therapyUse.approvalSource.checkedAt}</small><strong>{therapyUse.approvalSource.title}</strong></span>
          <ArrowSquareOut size={16} weight="bold" />
        </a>
        <div className="coverage-records" aria-label={`${therapy.name}目录信息`}>
          <h3>医保 / 商保目录信息</h3>
          {therapy.coverage.length > 0 ? therapy.coverage.map((coverage) => (
            <div className="coverage-record" key={`${coverage.catalog}-${coverage.pageNumber}`}>
              <div><span className="coverage-badge">{coverage.label}</span><strong>{coverage.catalog}</strong></div>
              <p>{coverage.restriction}</p>
              <small>
                {coverage.validFrom && coverage.validTo ? `目录有效期 ${coverage.validFrom} 至 ${coverage.validTo} · ` : ''}
                来源：{coverage.sourceTitle}，PDF 第 {coverage.pageNumber} 页
              </small>
            </div>
          )) : <p className="coverage-empty">未在本次三份2025目录材料中标记；这不影响上方独立展示的NMPA批准状态。</p>}
        </div>
      </div>
    </details>
  )
}

interface DetailScreenProps {
  record: BiomarkerEvidenceRecord
  onBack: () => void
  headingRef: RefObject<HTMLHeadingElement | null>
}

function DetailScreen({ record, onBack, headingRef }: DetailScreenProps) {
  const therapies = getRecordTherapies(record)
  const cancers = getRecordCancers(record)
  return (
    <main className="lookup-screen detail-screen">
      <div className="detail-nav">
        <button type="button" onClick={onBack} aria-label="返回搜索结果"><ArrowLeft size={19} weight="bold" /></button>
        <span>证据详情</span><i aria-hidden="true" />
      </div>

      <section className="detail-hero">
        <div className="detail-hero__icon" aria-hidden="true"><Dna size={28} weight="duotone" /></div>
        <p>{record.nameZh}</p>
        <h1 ref={headingRef} tabIndex={-1}>{record.symbol}</h1>
        <strong>{record.markerType} · {record.evidenceGroups.length} 类证据分组</strong>
        <span className="detail-hero__status"><ShieldCheck size={15} weight="fill" />国内批准信息已核对</span>
        <p className="detail-review-status">{record.contentStatus} · {contentVersion} · 更新 {contentUpdatedAt}</p>
      </section>

      <section className="detail-overview" aria-labelledby="detail-overview-title">
        <div className="detail-overview__heading">
          <div><span id="detail-overview-title">标志物信息总览</span><small>进入结论前先核对标志物类型与分组</small></div>
          <strong>{record.symbol}</strong>
        </div>
        <dl className="overview-list">
          <div><dt>中文名称</dt><dd>{record.nameZh}</dd></div>
          <div><dt>英文全称</dt><dd lang="en">{record.nameEn}</dd></div>
          <div><dt>标志物类型</dt><dd>{record.markerType}</dd></div>
          <div><dt>证据分组</dt><dd>{record.evidenceGroups.map((group) => group.alteration).join('；')}</dd></div>
          <div className="overview-list__stacked"><dt>相关癌种</dt><dd className="overview-tags">{cancers.map((cancer) => <span key={cancer}>{cancer}</span>)}</dd></div>
          <div className="overview-list__stacked"><dt>相关药物</dt><dd>{therapies.length} 个唯一药物，按下方分组查看关系与条件</dd></div>
        </dl>
      </section>

      <section className="evidence-groups" aria-label="临床结论与适用条件">
        {record.evidenceGroups.map((group, index) => (
          <article className="evidence-group" key={group.id}>
            <div className="evidence-group__index">{String(index + 1).padStart(2, '0')}</div>
            <header>
              <p>证据分组</p><h2>{group.alteration}</h2>
              <div className="overview-tags">{group.cancers.map((cancer) => <span key={cancer}>{cancer}</span>)}</div>
            </header>
            <section className="detail-section detail-section--conclusion">
              <div className="detail-section__title"><CheckCircle size={20} weight="fill" /><div><span>临床结论</span><small>CONCLUSION</small></div></div>
              <p className="detail-conclusion">{group.clinicalSummary}</p>
            </section>
            <section className="detail-section">
              <div className="detail-section__title"><Flask size={20} weight="duotone" /><div><span>适用条件</span><small>APPLICABLE CONDITIONS</small></div></div>
              <ul className="condition-list">{group.conditions.map((condition) => <li key={condition}><CheckCircle size={16} weight="fill" /><span>{condition}</span></li>)}</ul>
            </section>
            <section className="detail-section therapy-section">
              <div className="detail-section__title"><Pill size={20} weight="duotone" /><div><span>相关药物与目录状态</span><small>APPROVAL ≠ COVERAGE</small></div></div>
              <p className="therapy-section__hint">药品批准信息与医保/商保目录依据分开展示；目录支付条件不作为获批适应证。</p>
              <div className="therapy-disclosures">{group.therapyUses.map((therapyUse) => <TherapyDisclosure key={therapyUse.therapyId} therapyUse={therapyUse} />)}</div>
            </section>
          </article>
        ))}
      </section>

      <section className="detail-section detail-notes">
        <div><Flask size={18} weight="duotone" /><p><strong>检测提示</strong>{record.testingNote}</p></div>
        <div><WarningCircle size={18} weight="duotone" /><p><strong>解读边界</strong>{record.caution}</p></div>
      </section>
      <p className="medical-disclaimer">{contentVersion} · 内容更新 {contentUpdatedAt}。医学文案待审，不替代临床判断；实际使用请核对最新版说明书、NMPA批准信息及目录原文。</p>
    </main>
  )
}

export default function App() {
  const [mode, setMode] = useState<LookupMode>('all')
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const detailHeadingRef = useRef<HTMLHeadingElement>(null)
  const returnFocusIdRef = useRef<string | null>(null)
  const selectedRecord = selectedId ? findEvidenceRecord(selectedId) : undefined
  const results = useMemo(() => searchEvidence(query, mode), [query, mode])
  const currentMode = lookupModes.find((item) => item.id === mode) ?? lookupModes[0]

  useEffect(() => {
    window.scrollTo(0, 0)
    window.requestAnimationFrame(() => {
      if (selectedId) { detailHeadingRef.current?.focus(); return }
      if (returnFocusIdRef.current) document.querySelector<HTMLButtonElement>(`[data-record-id="${returnFocusIdRef.current}"]`)?.focus()
    })
  }, [selectedId])

  const applySearch = (value: string, nextMode: LookupMode) => {
    setMode(nextMode); setQuery(value); setSelectedId(null)
    window.setTimeout(() => searchRef.current?.focus(), 0)
  }

  if (selectedRecord) return (
    <div className="app-canvas lookup-canvas"><div className="aurora aurora-one" aria-hidden="true" /><div className="aurora aurora-two" aria-hidden="true" />
      <div className="app-frame lookup-frame"><DetailScreen record={selectedRecord} onBack={() => setSelectedId(null)} headingRef={detailHeadingRef} /></div>
    </div>
  )

  return (
    <div className="app-canvas lookup-canvas"><div className="aurora aurora-one" aria-hidden="true" /><div className="aurora aurora-two" aria-hidden="true" />
      <div className="app-frame lookup-frame"><main className="lookup-screen home-screen">
        <BrandHeader />
        <section className="lookup-intro">
          <p className="lookup-eyebrow"><Dna size={15} weight="duotone" /> 国内肿瘤证据速查</p>
          <h2>从一个关键词，找到<br /><span>可核对的临床线索</span></h2>
          <p>按标志物、变异、药物或癌种双向定位；医保/商保目录与NMPA批准信息分别核对。</p>
        </section>

        <section className="search-console" aria-label="基因速查搜索">
          <div className="mode-tabs" role="group" aria-label="搜索方向">{lookupModes.map((item) => (
            <button key={item.id} type="button" aria-pressed={mode === item.id} onClick={() => setMode(item.id)}>{item.label}</button>
          ))}</div>
          <label className="search-field"><MagnifyingGlass size={21} weight="bold" /><span className="sr-only">搜索{currentMode.helper}</span>
            <input ref={searchRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`搜索${currentMode.helper}`} autoComplete="off" />
            {query && <button type="button" onClick={() => setQuery('')} aria-label="清空搜索"><X size={16} weight="bold" /></button>}
          </label>
          <div className="quick-searches" aria-label="快捷搜索"><span>试试看</span>{quickSearches.map((item) => (
            <button type="button" key={item.label} onClick={() => applySearch(item.label, item.mode)}>{item.label}</button>
          ))}</div>
        </section>

        <section className="results-section" aria-live="polite">
          <div className="results-heading"><div><span>{query ? '搜索结果' : '国内证据样例'}</span><small>{query ? `“${query}”` : 'DEMO DATASET'}</small></div><strong>{results.length} 个标志物</strong></div>
          <div className="content-gate" role="status"><ShieldCheck size={17} weight="fill" /><span><strong>NMPA批准信息 + 2025医保/商保目录已核对</strong><small>{contentVersion} · 医学文案待审 · 更新 {contentUpdatedAt}</small></span></div>
          {results.length > 0 ? <div className="results-list">{results.map((record) => (
            <ResultCard key={record.id} record={record} onOpen={() => { returnFocusIdRef.current = record.id; setSelectedId(record.id) }} onTherapySearch={(therapy) => applySearch(therapy, 'drug')} />
          ))}</div> : <div className="empty-state"><div><MagnifyingGlass size={24} weight="duotone" /></div><h2>暂未找到匹配样例</h2><p>试试更短的标志物、变异、药物或癌种名称。</p><button type="button" onClick={() => { setQuery(''); setMode('all') }}>查看全部样例</button></div>}
        </section>
        <footer className="lookup-footer"><ShieldCheck size={17} weight="duotone" /><span>国内来源 · 批准与目录分开展示 · 医学文案待审</span></footer>
      </main></div>
    </div>
  )
}
