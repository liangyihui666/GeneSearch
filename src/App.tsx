import { useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import {
  ArrowLeft,
  ArrowSquareOut,
  CaretRight,
  CheckCircle,
  Database,
  Dna,
  Flask,
  MagnifyingGlass,
  Pill,
  ShieldCheck,
  WarningCircle,
  X,
} from '@phosphor-icons/react'
import {
  contentUpdatedAt,
  contentVersion,
  evidenceRecords,
  findEvidenceRecord,
  searchEvidence,
  type GeneEvidenceRecord,
  type LookupMode,
} from './data/geneEvidence'

const lookupModes: Array<{
  id: LookupMode
  label: string
  helper: string
}> = [
  { id: 'all', label: '综合', helper: '基因、药物或癌种' },
  { id: 'gene', label: '基因找药', helper: '如 EGFR L858R' },
  { id: 'drug', label: '药物找靶点', helper: '如 谷美替尼' },
  { id: 'cancer', label: '癌种找标志物', helper: '如 胃癌' },
]

const quickSearches: Array<{ label: string; mode: LookupMode }> = [
  { label: 'EGFR L858R', mode: 'gene' },
  { label: '谷美替尼', mode: 'drug' },
  { label: '胃癌', mode: 'cancer' },
]

function BrandHeader() {
  return (
    <header className="lookup-brand">
      <div className="lookup-brand__lockup">
        <img
          className="lookup-brand__orb"
          src="./assets/brand/oncorounds-orb.png"
          alt=""
          aria-hidden="true"
        />
        <div>
          <p>ONCOROUNDS · 系列小工具</p>
          <h1>基因速查</h1>
        </div>
      </div>
      <span className="lookup-brand__count">{evidenceRecords.length} 条国内样例</span>
    </header>
  )
}

interface ResultCardProps {
  record: GeneEvidenceRecord
  onOpen: () => void
  onTherapySearch: (therapy: string) => void
}

function ResultCard({ record, onOpen, onTherapySearch }: ResultCardProps) {
  return (
    <article className="evidence-card">
      <div className="evidence-card__topline">
        <div className="gene-identity">
          <span className="gene-identity__symbol">{record.symbol}</span>
          <div>
            <h2>{record.nameZh}</h2>
            <p>{record.alteration}</p>
          </div>
        </div>
        <span className="evidence-pill">
          <ShieldCheck size={14} weight="fill" />
          {record.evidenceLabel.replace('NMPA ', '')}
        </span>
      </div>

      <div className="tag-row" aria-label="相关癌种">
        {record.cancers.map((cancer) => (
          <span key={cancer}>{cancer}</span>
        ))}
      </div>

      <div className="therapy-block">
        <div className="therapy-block__heading">
          <span>
            <Pill size={17} weight="duotone" />
            国内获批相关药物
          </span>
          <small>{record.therapies.length} 项</small>
        </div>
        <div className="therapy-list">
          {record.therapies.map((therapy) => (
            <button
              type="button"
              key={therapy.name}
              onClick={() => onTherapySearch(therapy.aliases[0] ?? therapy.name)}
              aria-label={`反查 ${therapy.name} 对应靶点`}
            >
              {therapy.name}
              <CaretRight size={14} weight="bold" />
            </button>
          ))}
        </div>
      </div>

      <button
        className="evidence-card__detail"
        type="button"
        data-record-id={record.id}
        onClick={onOpen}
      >
        <span>
          <CheckCircle size={17} weight="fill" />
          查看临床结论与适用条件
        </span>
        <CaretRight size={17} weight="bold" />
      </button>
    </article>
  )
}

interface DetailScreenProps {
  record: GeneEvidenceRecord
  onBack: () => void
  headingRef: RefObject<HTMLHeadingElement | null>
}

function DetailScreen({ record, onBack, headingRef }: DetailScreenProps) {
  return (
    <main className="lookup-screen detail-screen">
      <div className="detail-nav">
        <button type="button" onClick={onBack} aria-label="返回搜索结果">
          <ArrowLeft size={19} weight="bold" />
        </button>
        <span>证据详情</span>
        <i aria-hidden="true" />
      </div>

      <section className="detail-hero">
        <div className="detail-hero__icon" aria-hidden="true">
          <Dna size={28} weight="duotone" />
        </div>
        <p>{record.nameZh}</p>
        <h1 ref={headingRef} tabIndex={-1}>{record.symbol}</h1>
        <strong>{record.alteration}</strong>
        <span className="detail-hero__status">
          <ShieldCheck size={15} weight="fill" />
          {record.evidenceLabel}
        </span>
        <p className="detail-review-status">
          {record.contentStatus} · {contentVersion} · 更新 {contentUpdatedAt}
        </p>
      </section>

      <section className="detail-section detail-section--conclusion">
        <div className="detail-section__title">
          <CheckCircle size={20} weight="fill" />
          <div>
            <span>临床结论</span>
            <small>CONCLUSION</small>
          </div>
        </div>
        <p className="detail-conclusion">{record.clinicalSummary}</p>
      </section>

      <section className="detail-section">
        <div className="detail-section__title">
          <Flask size={20} weight="duotone" />
          <div>
            <span>适用条件</span>
            <small>APPLICABLE CONDITIONS</small>
          </div>
        </div>
        <ul className="condition-list">
          {record.conditions.map((condition) => (
            <li key={condition}>
              <CheckCircle size={16} weight="fill" />
              <span>{condition}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="detail-section">
        <div className="detail-section__title">
          <Pill size={20} weight="duotone" />
          <div>
            <span>国内获批药物</span>
            <small>CHINA-APPROVED THERAPY</small>
          </div>
        </div>
        {record.therapies.map((therapy) => (
          <div className="therapy-detail" key={therapy.name}>
            <div>
              <strong>{therapy.name}</strong>
              <span>{therapy.regulatoryStatus}</span>
            </div>
            <p>{therapy.useContext}</p>
          </div>
        ))}
      </section>

      <section className="detail-section detail-notes">
        <div>
          <Flask size={18} weight="duotone" />
          <p><strong>检测提示</strong>{record.testingNote}</p>
        </div>
        <div>
          <WarningCircle size={18} weight="duotone" />
          <p><strong>解读边界</strong>{record.caution}</p>
        </div>
      </section>

      <a
        className="source-link"
        href={record.source.url}
        target="_blank"
        rel="noreferrer"
      >
        <Database size={21} weight="duotone" />
        <span>
          <small>国内官方来源 · {record.source.publishedAt}</small>
          <strong>{record.source.organization}</strong>
          <em>{record.source.title}</em>
        </span>
        <ArrowSquareOut size={18} weight="bold" />
      </a>

      <p className="medical-disclaimer">
        {contentVersion} · 内容更新 {contentUpdatedAt}。医学文案待审，不替代临床判断；实际使用请核对最新版说明书及监管信息。
      </p>
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
      if (selectedId) {
        detailHeadingRef.current?.focus()
        return
      }

      if (returnFocusIdRef.current) {
        document
          .querySelector<HTMLButtonElement>(
            `[data-record-id="${returnFocusIdRef.current}"]`,
          )
          ?.focus()
      }
    })
  }, [selectedId])

  const applySearch = (value: string, nextMode: LookupMode) => {
    setMode(nextMode)
    setQuery(value)
    setSelectedId(null)
    window.setTimeout(() => searchRef.current?.focus(), 0)
  }

  if (selectedRecord) {
    return (
      <div className="app-canvas lookup-canvas">
        <div className="aurora aurora-one" aria-hidden="true" />
        <div className="aurora aurora-two" aria-hidden="true" />
        <div className="app-frame lookup-frame">
          <DetailScreen
            record={selectedRecord}
            onBack={() => setSelectedId(null)}
            headingRef={detailHeadingRef}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="app-canvas lookup-canvas">
      <div className="aurora aurora-one" aria-hidden="true" />
      <div className="aurora aurora-two" aria-hidden="true" />
      <div className="app-frame lookup-frame">
        <main className="lookup-screen home-screen">
          <BrandHeader />

          <section className="lookup-intro">
            <p className="lookup-eyebrow"><Dna size={15} weight="duotone" /> 国内肿瘤证据速查</p>
            <h2>从一个关键词，找到<br /><span>可核对的临床线索</span></h2>
            <p>按基因、药物或癌种双向定位；当前仅展示国内官方来源样例。</p>
          </section>

          <section className="search-console" aria-label="基因速查搜索">
            <div className="mode-tabs" role="group" aria-label="搜索方向">
              {lookupModes.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={mode === item.id}
                  onClick={() => setMode(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <label className="search-field">
              <MagnifyingGlass size={21} weight="bold" />
              <span className="sr-only">搜索{currentMode.helper}</span>
              <input
                ref={searchRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={`搜索${currentMode.helper}`}
                autoComplete="off"
              />
              {query && (
                <button type="button" onClick={() => setQuery('')} aria-label="清空搜索">
                  <X size={16} weight="bold" />
                </button>
              )}
            </label>
            <div className="quick-searches" aria-label="快捷搜索">
              <span>试试看</span>
              {quickSearches.map((item) => (
                <button
                  type="button"
                  key={item.label}
                  onClick={() => applySearch(item.label, item.mode)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </section>

          <section className="results-section" aria-live="polite">
            <div className="results-heading">
              <div>
                <span>{query ? '搜索结果' : '国内证据样例'}</span>
                <small>{query ? `“${query}”` : 'DEMO DATASET'}</small>
              </div>
              <strong>{results.length} 条</strong>
            </div>
            <div className="content-gate" role="status">
              <ShieldCheck size={17} weight="fill" />
              <span>
                <strong>官方来源已核对 · 医学文案待审</strong>
                <small>{contentVersion} · 内容更新 {contentUpdatedAt}</small>
              </span>
            </div>

            {results.length > 0 ? (
              <div className="results-list">
                {results.map((record) => (
                  <ResultCard
                    key={record.id}
                    record={record}
                    onOpen={() => {
                      returnFocusIdRef.current = record.id
                      setSelectedId(record.id)
                    }}
                    onTherapySearch={(therapy) => applySearch(therapy, 'drug')}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div><MagnifyingGlass size={24} weight="duotone" /></div>
                <h2>暂未找到匹配样例</h2>
                <p>试试更短的基因、药物或癌种名称。</p>
                <button type="button" onClick={() => { setQuery(''); setMode('all') }}>
                  查看全部样例
                </button>
              </div>
            )}
          </section>

          <footer className="lookup-footer">
            <ShieldCheck size={17} weight="duotone" />
            <span>仅收录国内来源 · 示例数据待医学审核</span>
          </footer>
        </main>
      </div>
    </div>
  )
}
