import { therapyById, type TherapyRecord } from './therapyCatalog'

export type LookupMode = 'all' | 'gene' | 'drug' | 'cancer'
export type MarkerType = '基因变异' | '融合基因' | '蛋白表达' | '基因组特征' | '细胞表面靶点' | '组合标志物'
export type RelationType = '直接靶向' | '标志物筛选用药' | '联合方案'

export interface EvidenceSource {
  organization: '国家药品监督管理局（NMPA）'
  title: string
  url: string
  publishedAt?: string
  checkedAt: string
}
export interface TherapyUse {
  therapyId: string
  relationType: RelationType
  regulatoryStatus: '中国获批' | '附条件批准'
  useContext: string
  approvalSource: EvidenceSource
}
export interface EvidenceGroup {
  id: string
  alteration: string
  cancers: string[]
  clinicalSummary: string
  conditions: string[]
  therapyUses: TherapyUse[]
}
export interface BiomarkerEvidenceRecord {
  id: string
  symbol: string
  nameZh: string
  nameEn: string
  aliases: string[]
  markerType: MarkerType
  evidenceGroups: EvidenceGroup[]
  testingNote: string
  caution: string
  contentStatus: '国内官方来源已核对 · 医学文案待审'
}
export interface ResolvedTherapyUse { therapy: TherapyRecord; use: TherapyUse }

export const contentVersion = 'Demo v0.2'
export const contentUpdatedAt = '2026-09-01'
const contentStatus = '国内官方来源已核对 · 医学文案待审' as const

const nmpaPortal = (therapyName: string): EvidenceSource => ({
  organization: '国家药品监督管理局（NMPA）',
  title: `国家药监局药品信息查询：${therapyName}`,
  url: 'https://www.nmpa.gov.cn/zwfwqjd/index.html',
  checkedAt: contentUpdatedAt,
})
const nmpaNews = (title: string, url: string, publishedAt: string): EvidenceSource => ({
  organization: '国家药品监督管理局（NMPA）', title, url, publishedAt, checkedAt: contentUpdatedAt,
})
const sourceByTherapy: Partial<Record<string, EvidenceSource>> = {
  zorifertinib: nmpaNews('Zorifertinib Hydrochloride Tablets Approved for Marketing by China NMPA', 'https://english.nmpa.gov.cn/2025-02/19/c_1073663.htm', '2025-02-19'),
  repotrectinib: nmpaNews('Repotrectinib capsules approved with conditions for marketing by China NMPA', 'https://english.nmpa.gov.cn/2024-05/11/c_1050520.htm', '2024-05-11'),
  gumarontinib: nmpaNews('Gumarontinib tablets approved with conditions for marketing', 'https://english.nmpa.gov.cn/2023-03/08/c_896502.htm', '2023-03-08'),
  zolbetuximab: nmpaNews('Zolbetuximab for Injection Approved for Marketing by China NMPA', 'https://english.nmpa.gov.cn/2025-06/11/c_1101500.htm', '2025-06-11'),
  iruplinalkib: nmpaNews('Iruplinalkib approved for marketing', 'https://english.nmpa.gov.cn/2023-06/28/c_940312.htm', '2023-06-28'),
  sunvozertinib: nmpaNews('Sunvozertinib approved for marketing', 'https://english.nmpa.gov.cn/2023-08/23/c_963944.htm', '2023-08-23'),
  garsorasib: nmpaNews('Garsorasib approved for marketing', 'https://english.nmpa.gov.cn/2025-02/19/c_1073662.htm', '2025-02-19'),
  fulzerasib: nmpaNews('Fulzerasib approved for marketing', 'https://english.nmpa.gov.cn/2025-02/19/c_1073549.htm', '2025-02-19'),
  envonalkib: nmpaNews('Envonalkib approved for marketing', 'https://english.nmpa.gov.cn/2025-02/19/c_1073545.htm', '2025-02-19'),
  rezivertinib: nmpaNews('Rezivertinib approved for marketing', 'https://english.nmpa.gov.cn/2024-05/20/c_1050522.htm', '2024-05-20'),
  vebreltinib: nmpaNews('Vebreltinib approved for marketing', 'https://english.nmpa.gov.cn/2023-11/16/c_963975.htm', '2023-11-16'),
  'cilta-cel': nmpaNews('Ciltacabtagene autoleucel approved for marketing', 'https://english.nmpa.gov.cn/2025-02/19/c_1073591.htm', '2025-02-19'),
}
const use = (therapyId: string, relationType: RelationType, useContext: string, regulatoryStatus: TherapyUse['regulatoryStatus'] = '中国获批'): TherapyUse => {
  const therapy = therapyById.get(therapyId)
  if (!therapy) throw new Error(`Unknown therapy id: ${therapyId}`)
  return { therapyId, relationType, regulatoryStatus, useContext, approvalSource: sourceByTherapy[therapyId] ?? nmpaPortal(therapy.name) }
}

export const evidenceRecords: BiomarkerEvidenceRecord[] = [
  {
    id: 'egfr', symbol: 'EGFR', nameZh: '表皮生长因子受体', nameEn: 'Epidermal Growth Factor Receptor', aliases: ['EGFR突变', '19del', 'L858R', '21号外显子 L858R', 'T790M', '20号外显子插入'], markerType: '基因变异',
    evidenceGroups: [
      { id: 'egfr-sensitive', alteration: 'EGFR 敏感突变（19del / L858R）', cancers: ['非小细胞肺癌', '肺腺癌'], clinicalSummary: 'EGFR 19号外显子缺失或L858R可作为国内已批准EGFR-TKI治疗的筛选标志物；具体线次、分期及联合方案须按药品说明书判断。', conditions: ['规范检测确认EGFR 19del或L858R', '非小细胞肺癌相关获批场景', '按具体药品说明书核对治疗线次和联合条件'], therapyUses: [use('gefitinib', '直接靶向', 'EGFR敏感突变NSCLC治疗'), use('afatinib', '直接靶向', 'EGFR敏感突变NSCLC治疗'), use('erlotinib', '直接靶向', 'EGFR敏感突变NSCLC治疗'), use('dacomitinib', '直接靶向', 'EGFR 19del或L858R晚期NSCLC一线治疗'), use('osimertinib', '直接靶向', 'EGFR敏感突变相关一线、辅助或联合治疗场景'), use('icotinib', '直接靶向', 'EGFR敏感突变NSCLC治疗'), use('almonertinib', '直接靶向', 'EGFR敏感突变NSCLC治疗'), use('furmonertinib', '直接靶向', 'EGFR敏感突变NSCLC治疗'), use('limertinib', '直接靶向', 'EGFR敏感突变NSCLC治疗'), use('zorifertinib', '直接靶向', 'EGFR 19del或L858R且伴中枢神经系统转移的一线治疗')] },
      { id: 'egfr-t790m', alteration: 'EGFR T790M', cancers: ['非小细胞肺癌'], clinicalSummary: 'EGFR T790M可提示部分三代EGFR-TKI的国内获批用药场景，通常需结合既往EGFR-TKI治疗史与说明书限定。', conditions: ['规范检测确认T790M', '结合既往EGFR-TKI治疗史', '核对各药品说明书中的治疗线次'], therapyUses: [use('osimertinib', '直接靶向', 'EGFR T790M阳性NSCLC'), use('almonertinib', '直接靶向', 'EGFR T790M阳性NSCLC'), use('furmonertinib', '直接靶向', 'EGFR T790M阳性NSCLC'), use('befotertinib', '直接靶向', 'EGFR T790M阳性NSCLC'), use('rezivertinib', '直接靶向', 'EGFR T790M阳性NSCLC'), use('rilertinib', '直接靶向', 'EGFR T790M阳性NSCLC'), use('limertinib', '直接靶向', 'EGFR T790M阳性NSCLC')] },
      { id: 'egfr-exon20ins', alteration: 'EGFR 20号外显子插入突变', cancers: ['非小细胞肺癌'], clinicalSummary: 'EGFR 20号外显子插入突变与经典敏感突变不同，国内已有针对该分子亚型的获批治疗。', conditions: ['确认EGFR 20号外显子插入突变', '不可直接套用经典敏感突变结论', '按说明书核对既往治疗要求'], therapyUses: [use('sunvozertinib', '直接靶向', 'EGFR 20号外显子插入突变晚期NSCLC', '附条件批准')] },
    ], testingNote: '不同EGFR变异对应不同治疗路径；报告需明确外显子与具体变异。', caution: '不能把EGFR/ALK阴性仅作为排除条件的药物反向表达为EGFR阳性用药。', contentStatus,
  },
  {
    id: 'alk', symbol: 'ALK', nameZh: '间变性淋巴瘤激酶', nameEn: 'Anaplastic Lymphoma Kinase', aliases: ['ALK融合', 'ALK重排'], markerType: '融合基因',
    evidenceGroups: [{ id: 'alk-fusion', alteration: 'ALK 融合 / 重排阳性', cancers: ['非小细胞肺癌'], clinicalSummary: 'ALK融合或重排是国内多种ALK抑制剂的核心用药筛选标志物。', conditions: ['经规范检测确认ALK阳性', '非小细胞肺癌获批场景', '按既往治疗和中枢神经系统状态选择具体方案'], therapyUses: [use('ceritinib', '直接靶向', 'ALK阳性晚期NSCLC'), use('crizotinib', '直接靶向', 'ALK阳性晚期NSCLC'), use('alectinib', '直接靶向', 'ALK阳性NSCLC辅助或晚期治疗'), use('brigatinib', '直接靶向', 'ALK阳性晚期NSCLC'), use('lorlatinib', '直接靶向', 'ALK阳性晚期NSCLC'), use('ensartinib', '直接靶向', 'ALK阳性晚期NSCLC'), use('iruplinalkib', '直接靶向', 'ALK阳性晚期NSCLC'), use('envonalkib', '直接靶向', 'ALK阳性晚期NSCLC')] }], testingNote: '可依据说明书与实验室规范选择IHC、FISH或核酸检测。', caution: 'ALK阴性排除条件不构成ALK阳性用药关系。', contentStatus,
  },
  {
    id: 'ros1', symbol: 'ROS1', nameZh: 'ROS原癌基因1', nameEn: 'ROS Proto-Oncogene 1, Receptor Tyrosine Kinase', aliases: ['ROS1融合', 'ROS1阳性'], markerType: '融合基因',
    evidenceGroups: [{ id: 'ros1-fusion', alteration: 'ROS1 融合 / 阳性', cancers: ['非小细胞肺癌'], clinicalSummary: 'ROS1阳性是多种国内获批ROS1抑制剂的筛选条件，需结合既往ROS1-TKI治疗史。', conditions: ['规范检测确认ROS1阳性', '局部晚期或转移性NSCLC', '按药品说明书核对既往治疗要求'], therapyUses: [use('crizotinib', '直接靶向', 'ROS1阳性NSCLC'), use('entrectinib', '直接靶向', 'ROS1阳性NSCLC'), use('repotrectinib', '直接靶向', 'ROS1阳性NSCLC', '附条件批准'), use('unecritinib', '直接靶向', 'ROS1阳性NSCLC'), use('taletrectinib', '直接靶向', 'ROS1阳性NSCLC')] }], testingNote: '融合检测方法与阳性判定须满足说明书和实验室规范。', caution: '不同ROS1抑制剂的既往用药限制不可合并。', contentStatus,
  },
  {
    id: 'met', symbol: 'MET', nameZh: '间充质上皮转化因子', nameEn: 'MET Proto-Oncogene, Receptor Tyrosine Kinase', aliases: ['METex14', 'MET 14号外显子跳跃', 'MET扩增'], markerType: '基因变异',
    evidenceGroups: [
      { id: 'met-ex14', alteration: 'MET 14号外显子跳跃突变', cancers: ['非小细胞肺癌'], clinicalSummary: 'METex14是多种国内获批MET抑制剂的直接筛选标志物。', conditions: ['确认MET 14号外显子跳跃突变', '局部晚期或转移性NSCLC', '核对治疗线次'], therapyUses: [use('savolitinib', '直接靶向', 'METex14晚期NSCLC'), use('gumarontinib', '直接靶向', 'METex14晚期NSCLC', '附条件批准'), use('capmatinib', '直接靶向', 'METex14晚期NSCLC'), use('tepotinib', '直接靶向', 'METex14晚期NSCLC'), use('vebreltinib', '直接靶向', 'METex14晚期NSCLC')] },
      { id: 'met-other', alteration: 'MET 扩增 / PTPRZ1-MET融合', cancers: ['非小细胞肺癌', '高级别脑胶质瘤'], clinicalSummary: 'MET扩增与PTPRZ1-MET融合是独立于METex14的标志物，只有在具体药品获批范围内才可用于筛选。', conditions: ['确认具体MET改变类型', '癌种与治疗场景符合说明书', '不与MET蛋白过表达互换'], therapyUses: [use('vebreltinib', '直接靶向', '说明书列明的MET扩增或PTPRZ1-MET融合场景')] },
    ], testingNote: '报告需区分METex14、扩增、融合与蛋白过表达。', caution: '不同MET标志物不可互换结论。', contentStatus,
  },
  {
    id: 'braf', symbol: 'BRAF', nameZh: 'B-Raf原癌基因', nameEn: 'B-Raf Proto-Oncogene, Serine/Threonine Kinase', aliases: ['BRAF V600E', 'BRAF V600'], markerType: '基因变异',
    evidenceGroups: [{ id: 'braf-v600', alteration: 'BRAF V600突变', cancers: ['黑色素瘤', '非小细胞肺癌', '甲状腺癌'], clinicalSummary: 'BRAF V600突变可筛选BRAF抑制剂或BRAF/MEK联合方案，适用癌种和线次必须分别核对。', conditions: ['确认BRAF V600具体变异', '癌种符合说明书', '联合方案需同时满足两种药品要求'], therapyUses: [use('vemurafenib', '直接靶向', 'BRAF V600突变黑色素瘤'), use('dabrafenib', '联合方案', '与曲美替尼联合用于说明书列明的BRAF V600突变肿瘤'), use('trametinib', '联合方案', '与达拉非尼联合用于说明书列明的BRAF V600突变肿瘤')] }], testingNote: '需报告具体氨基酸改变，不宜仅写“BRAF阳性”。', caution: 'V600以外变异不可直接套用该结论。', contentStatus,
  },
  {
    id: 'ntrk', symbol: 'NTRK1/2/3', nameZh: '神经营养性酪氨酸受体激酶', nameEn: 'Neurotrophic Receptor Tyrosine Kinase 1/2/3', aliases: ['NTRK融合', 'TRK融合'], markerType: '融合基因',
    evidenceGroups: [{ id: 'ntrk-fusion', alteration: 'NTRK 基因融合', cancers: ['实体瘤'], clinicalSummary: 'NTRK融合是泛实体瘤TRK抑制剂治疗的筛选标志物，需确认融合具有功能意义且符合说明书条件。', conditions: ['确认NTRK1/2/3融合', '局部晚期或转移性实体瘤', '无满意替代治疗或符合具体说明书条件'], therapyUses: [use('entrectinib', '直接靶向', 'NTRK融合实体瘤'), use('larotrectinib', '直接靶向', 'NTRK融合实体瘤')] }], testingNote: '需确认具体融合伴侣和检测可靠性。', caution: 'NTRK表达升高不等同于NTRK融合。', contentStatus,
  },
  {
    id: 'ret', symbol: 'RET', nameZh: 'RET原癌基因', nameEn: 'Ret Proto-Oncogene', aliases: ['RET融合', 'RET突变'], markerType: '基因变异',
    evidenceGroups: [
      { id: 'ret-fusion', alteration: 'RET 融合', cancers: ['非小细胞肺癌', '甲状腺癌'], clinicalSummary: 'RET融合可筛选国内获批选择性RET抑制剂。', conditions: ['确认RET融合', '癌种符合说明书', '核对既往治疗要求'], therapyUses: [use('pralsetinib', '直接靶向', 'RET融合NSCLC或说明书列明的甲状腺癌'), use('selpercatinib', '直接靶向', 'RET融合NSCLC或说明书列明的甲状腺癌')] },
      { id: 'ret-mutation', alteration: 'RET 突变', cancers: ['甲状腺髓样癌'], clinicalSummary: 'RET突变与RET融合是不同分子事件；甲状腺髓样癌需按具体突变和说明书范围筛选。', conditions: ['确认RET突变', '甲状腺髓样癌获批场景', '不以RET融合结论替代'], therapyUses: [use('selpercatinib', '直接靶向', 'RET突变甲状腺髓样癌说明书场景')] },
    ], testingNote: '报告需区分融合与点突变。', caution: '两类RET改变的癌种和用药条件不同。', contentStatus,
  },
  {
    id: 'kras', symbol: 'KRAS', nameZh: 'Kirsten大鼠肉瘤病毒癌基因', nameEn: 'KRAS Proto-Oncogene, GTPase', aliases: ['KRAS G12C', 'G12C'], markerType: '基因变异',
    evidenceGroups: [{ id: 'kras-g12c', alteration: 'KRAS G12C突变', cancers: ['非小细胞肺癌'], clinicalSummary: 'KRAS G12C是国内多种KRAS G12C抑制剂的直接筛选标志物。', conditions: ['确认KRAS G12C', '局部晚期或转移性NSCLC', '通常需核对既往系统治疗要求'], therapyUses: [use('fulzerasib', '直接靶向', '经治KRAS G12C突变晚期NSCLC'), use('glecirasib', '直接靶向', '经治KRAS G12C突变晚期NSCLC'), use('garsorasib', '直接靶向', '经治KRAS G12C突变晚期NSCLC')] }], testingNote: '需报告具体KRAS密码子与氨基酸改变。', caution: '其他KRAS变异不可直接套用G12C结论。', contentStatus,
  },
  {
    id: 'erbb2', symbol: 'ERBB2 / HER2', nameZh: '人表皮生长因子受体2', nameEn: 'Erb-B2 Receptor Tyrosine Kinase 2', aliases: ['HER2', 'ERBB2扩增', 'HER2过表达', 'HER2低表达', 'ERBB2突变'], markerType: '蛋白表达',
    evidenceGroups: [
      { id: 'her2-positive', alteration: 'HER2 阳性（扩增 / 过表达）', cancers: ['乳腺癌', '胃癌', '胃食管结合部癌', '尿路上皮癌', '胆道癌'], clinicalSummary: 'HER2阳性可筛选抗HER2抗体、小分子抑制剂和抗体偶联药物；判定标准与方案随癌种而异。', conditions: ['按癌种标准确认HER2阳性', '核对治疗阶段与既往治疗', '联合方案按说明书执行'], therapyUses: [use('trastuzumab', '直接靶向', 'HER2阳性乳腺癌或胃癌场景'), use('pertuzumab', '联合方案', '与曲妥珠单抗等联合用于HER2阳性乳腺癌'), use('neratinib', '直接靶向', 'HER2阳性早期乳腺癌强化辅助治疗'), use('pyrotinib', '直接靶向', 'HER2阳性乳腺癌'), use('t-dm1', '直接靶向', 'HER2阳性乳腺癌'), use('t-dxd', '直接靶向', 'HER2阳性乳腺癌'), use('disitamab-vedotin', '直接靶向', 'HER2过表达胃癌或尿路上皮癌'), use('zanidatamab', '直接靶向', 'HER2高表达胆道癌')] },
      { id: 'her2-low', alteration: 'HER2 低表达', cancers: ['乳腺癌'], clinicalSummary: 'HER2低表达与传统HER2阳性不同，部分抗体偶联药物在特定晚期乳腺癌场景获批。', conditions: ['按乳腺癌标准确认HER2低表达', '既往治疗符合说明书', '不与HER2阳性结论合并'], therapyUses: [use('t-dxd', '直接靶向', '说明书列明的HER2低表达晚期乳腺癌')] },
      { id: 'erbb2-mutation', alteration: 'ERBB2 / HER2 激活突变', cancers: ['非小细胞肺癌'], clinicalSummary: 'ERBB2激活突变是独立于蛋白表达的基因变异标志物。', conditions: ['确认ERBB2激活突变', '晚期NSCLC', '核对既往系统治疗要求'], therapyUses: [use('sac-tmt', '直接靶向', 'ERBB2激活突变晚期NSCLC')] },
    ], testingNote: 'IHC、ISH与NGS检测对象不同，应按癌种和说明书选择。', caution: '扩增、表达、低表达和突变不可互换。', contentStatus,
  },
  {
    id: 'brca', symbol: 'BRCA1/2', nameZh: '乳腺癌易感基因1/2', nameEn: 'BRCA1/2 DNA Repair Associated', aliases: ['BRCA突变', 'gBRCA', 'sBRCA'], markerType: '基因变异',
    evidenceGroups: [{ id: 'brca-pathogenic', alteration: 'BRCA1/2 致病性或疑似致病性突变', cancers: ['卵巢癌', '乳腺癌', '前列腺癌', '胰腺癌'], clinicalSummary: 'BRCA1/2突变可作为部分PARP抑制剂治疗的筛选条件，但胚系/体系、癌种、铂敏感状态和治疗线次必须分别核对。', conditions: ['确认BRCA1/2变异分类', '明确胚系或体系来源', '癌种和既往治疗符合说明书'], therapyUses: [use('olaparib', '标志物筛选用药', 'BRCA相关卵巢癌、乳腺癌或前列腺癌等场景'), use('niraparib', '标志物筛选用药', 'BRCA相关或铂敏感卵巢癌维持治疗'), use('pamiparib', '标志物筛选用药', '胚系BRCA突变复发性晚期卵巢癌'), use('fluzoparib', '标志物筛选用药', 'BRCA相关卵巢癌或乳腺癌场景')] }], testingNote: '需区分胚系与体系结果并完成遗传咨询相关流程。', caution: 'VUS不应自动视为用药阳性。', contentStatus,
  },
  {
    id: 'pi3k-akt-pten', symbol: 'PIK3CA / AKT1 / PTEN', nameZh: 'PI3K-AKT通路标志物组合', nameEn: 'PIK3CA, AKT1 and PTEN Alterations', aliases: ['PIK3CA突变', 'AKT1突变', 'PTEN缺失', 'HR阳性HER2阴性'], markerType: '组合标志物',
    evidenceGroups: [
      { id: 'pik3ca', alteration: 'PIK3CA 突变且HR阳性 / HER2阴性', cancers: ['乳腺癌'], clinicalSummary: 'PIK3CA突变需与HR阳性、HER2阴性及临床进展条件组合判断。', conditions: ['确认PIK3CA突变', 'HR阳性且HER2阴性', '晚期或转移性乳腺癌且符合既往治疗条件'], therapyUses: [use('inavolisib', '联合方案', 'PIK3CA突变、HR阳性/HER2阴性乳腺癌联合治疗')] },
      { id: 'akt-pathway', alteration: 'PIK3CA / AKT1 / PTEN 改变且HR阳性 / HER2阴性', cancers: ['乳腺癌'], clinicalSummary: 'PIK3CA、AKT1或PTEN改变是AKT通路抑制联合方案的筛选组合之一。', conditions: ['确认至少一种通路改变', 'HR阳性且HER2阴性', '符合说明书中的既往治疗条件'], therapyUses: [use('capivasertib', '联合方案', '与内分泌治疗联合用于通路改变的HR阳性/HER2阴性晚期乳腺癌')] },
    ], testingNote: '需同时核对分子改变、HR与HER2状态。', caution: '单一标志物不能脱离组合条件解读。', contentStatus,
  },
  {
    id: 'ras-wt', symbol: 'RAS / BRAF WT', nameZh: 'RAS与BRAF野生型组合', nameEn: 'RAS and BRAF Wild-Type Status', aliases: ['RAS野生型', 'KRAS野生型', 'NRAS野生型', 'BRAF野生型'], markerType: '组合标志物',
    evidenceGroups: [{ id: 'ras-braf-wt', alteration: 'RAS / BRAF 野生型', cancers: ['结直肠癌'], clinicalSummary: 'RAS野生型（部分场景还需BRAF野生型）是抗EGFR单抗用于转移性结直肠癌的重要用药资格条件。', conditions: ['确认KRAS/NRAS野生型', '部分说明书场景同时要求BRAF野生型', '转移性结直肠癌且符合治疗线次'], therapyUses: [use('cetuximab', '标志物筛选用药', 'RAS野生型转移性结直肠癌'), use('cetuximab-beta', '标志物筛选用药', 'RAS/BRAF野生型转移性结直肠癌'), use('cetuximab-n01', '标志物筛选用药', 'RAS野生型转移性结直肠癌')] }], testingNote: '应覆盖KRAS和NRAS相关外显子并按说明书确认检测范围。', caution: '野生型是用药资格条件，不表示药物直接靶向RAS或BRAF。', contentStatus,
  },
  {
    id: 'nras', symbol: 'NRAS', nameZh: '神经母细胞瘤RAS病毒癌基因', nameEn: 'NRAS Proto-Oncogene, GTPase', aliases: ['NRAS突变'], markerType: '基因变异',
    evidenceGroups: [{ id: 'nras-melanoma', alteration: 'NRAS 突变', cancers: ['黑色素瘤'], clinicalSummary: 'NRAS突变可用于筛选国内获批的特定MEK抑制剂治疗场景。', conditions: ['确认NRAS突变', '晚期黑色素瘤', '既往抗PD-1/PD-L1治疗失败'], therapyUses: [use('tunlametinib', '标志物筛选用药', '经抗PD-1/PD-L1治疗失败的NRAS突变晚期黑色素瘤')] }], testingNote: '需报告具体NRAS变异。', caution: '该药物属于通路抑制，不应表达为直接靶向NRAS。', contentStatus,
  },
  {
    id: 'idh1', symbol: 'IDH1', nameZh: '异柠檬酸脱氢酶1', nameEn: 'Isocitrate Dehydrogenase (NADP+) 1', aliases: ['IDH1突变'], markerType: '基因变异',
    evidenceGroups: [{ id: 'idh1-aml', alteration: 'IDH1 突变', cancers: ['急性髓系白血病'], clinicalSummary: 'IDH1突变可筛选国内获批IDH1抑制剂的复发或难治性AML治疗场景。', conditions: ['确认IDH1突变', '成人复发或难治性AML', '符合说明书治疗条件'], therapyUses: [use('ivosidenib', '直接靶向', 'IDH1突变复发或难治性AML')] }], testingNote: '需使用验证过的方法确认IDH1突变。', caution: 'IDH2突变不可套用本条结论。', contentStatus,
  },
  {
    id: 'ezh2', symbol: 'EZH2', nameZh: '果蝇Zeste基因增强子同源物2', nameEn: 'Enhancer of Zeste 2 Polycomb Repressive Complex 2 Subunit', aliases: ['EZH2突变'], markerType: '基因变异',
    evidenceGroups: [{ id: 'ezh2-fl', alteration: 'EZH2 突变', cancers: ['滤泡性淋巴瘤'], clinicalSummary: 'EZH2突变可作为特定复发或难治性滤泡性淋巴瘤治疗的分子筛选条件。', conditions: ['确认EZH2突变', '复发或难治性滤泡性淋巴瘤', '既往系统治疗符合说明书'], therapyUses: [use('tazemetostat', '直接靶向', 'EZH2突变型复发或难治性滤泡性淋巴瘤')] }], testingNote: '需使用验证过的分子检测确认EZH2突变。', caution: '商保目录状态不等同于获批信息，批准依据单独核对。', contentStatus,
  },
  {
    id: 'cd19', symbol: 'CD19', nameZh: 'B细胞表面抗原CD19', nameEn: 'CD19 Molecule', aliases: ['CD19阳性', 'B细胞表面靶点'], markerType: '细胞表面靶点',
    evidenceGroups: [{ id: 'cd19-positive', alteration: 'CD19 阳性 / B细胞来源', cancers: ['大B细胞淋巴瘤', 'B细胞急性淋巴细胞白血病'], clinicalSummary: 'CD19是多种CAR-T细胞治疗的细胞表面靶点；适用疾病、既往治疗及患者条件随产品而异。', conditions: ['确认疾病来源与CD19相关性', '复发或难治性血液肿瘤', '符合具体细胞治疗产品说明书'], therapyUses: [use('axi-cel', '直接靶向', 'CD19相关复发或难治性大B细胞淋巴瘤'), use('relma-cel', '直接靶向', 'CD19相关复发或难治性淋巴瘤'), use('fucaso-cel', '直接靶向', '复发或难治性B细胞急性淋巴细胞白血病')] }], testingNote: '细胞治疗前需按产品要求完成疾病与靶点评估。', caution: 'CD19是细胞表面靶点，不应称为基因突变。', contentStatus,
  },
  {
    id: 'bcma', symbol: 'BCMA', nameZh: 'B细胞成熟抗原', nameEn: 'B-Cell Maturation Antigen', aliases: ['TNFRSF17', 'BCMA阳性'], markerType: '细胞表面靶点',
    evidenceGroups: [{ id: 'bcma-myeloma', alteration: 'BCMA 表达 / 浆细胞来源', cancers: ['多发性骨髓瘤'], clinicalSummary: 'BCMA是多种CAR-T细胞治疗用于复发或难治性多发性骨髓瘤的细胞表面靶点。', conditions: ['复发或难治性多发性骨髓瘤', '既往治疗线次符合产品说明书', '完成细胞治疗适用性评估'], therapyUses: [use('equi-cel', '直接靶向', 'BCMA相关复发或难治性多发性骨髓瘤'), use('zevor-cel', '直接靶向', 'BCMA相关复发或难治性多发性骨髓瘤'), use('cilta-cel', '直接靶向', 'BCMA相关多线经治复发或难治性多发性骨髓瘤')] }], testingNote: '按具体产品说明书与中心流程评估，不以单一基因检测替代。', caution: 'BCMA是细胞表面靶点，不应称为基因突变。', contentStatus,
  },
  {
    id: 'pd-l1', symbol: 'PD-L1', nameZh: '程序性死亡配体1', nameEn: 'Programmed Death-Ligand 1', aliases: ['CD274', 'TPS', 'CPS', 'PDL1'], markerType: '蛋白表达',
    evidenceGroups: [{ id: 'pdl1-expression', alteration: 'PD-L1 表达达到说明书阈值', cancers: ['非小细胞肺癌', '食管癌', '头颈鳞癌'], clinicalSummary: 'PD-L1表达在部分癌种和方案中是免疫治疗筛选条件，阈值、评分体系和治疗线次必须按具体说明书判断。', conditions: ['使用获验证方法检测PD-L1', '达到具体药品和癌种要求的TPS或CPS阈值', '治疗场景符合说明书'], therapyUses: [use('pembrolizumab', '标志物筛选用药', 'PD-L1达到说明书阈值的特定肿瘤治疗场景')] }], testingNote: 'TPS与CPS不可互换，阈值依药品和癌种而异。', caution: 'PD-L1阴性或未检测并非所有免疫方案的统一排除条件。', contentStatus,
  },
  {
    id: 'msi-dmmr', symbol: 'MSI-H / dMMR', nameZh: '微卫星高度不稳定 / 错配修复缺陷', nameEn: 'Microsatellite Instability-High / Mismatch Repair Deficiency', aliases: ['MSI-H', 'dMMR', '微卫星高度不稳定', '错配修复缺陷'], markerType: '基因组特征',
    evidenceGroups: [{ id: 'msih-dmmr', alteration: 'MSI-H 或 dMMR', cancers: ['实体瘤', '结直肠癌'], clinicalSummary: 'MSI-H/dMMR可作为部分免疫治疗的泛癌种或特定癌种筛选标志物，需结合说明书规定的检测方法和既往治疗。', conditions: ['确认MSI-H或dMMR', '癌种和疾病阶段符合说明书', '核对既往治疗要求'], therapyUses: [use('pembrolizumab', '标志物筛选用药', 'MSI-H/dMMR相关说明书场景'), use('nivolumab', '标志物筛选用药', 'MSI-H/dMMR结直肠癌等说明书场景'), use('serplulimab', '标志物筛选用药', 'MSI-H实体瘤说明书场景')] }], testingNote: 'PCR、NGS与IHC分别对应不同检测路径，应按规范判定。', caution: '医保或商保支付范围不可替代药品说明书。', contentStatus,
  },
  {
    id: 'cldn18-2', symbol: 'CLDN18.2', nameZh: '紧密连接蛋白18.2', nameEn: 'Claudin 18 Isoform 2', aliases: ['CLDN18', 'CLDN18.2阳性', 'HER2阴性'], markerType: '蛋白表达',
    evidenceGroups: [{ id: 'cldn182-positive', alteration: 'CLDN18.2 阳性且HER2阴性', cancers: ['胃癌', '胃食管结合部腺癌'], clinicalSummary: 'CLDN18.2阳性与HER2阴性构成完整的联合筛选条件，可用于判断特定一线联合方案。', conditions: ['确认CLDN18.2阳性', '同时确认HER2阴性', '局部晚期不可切除或转移性胃/胃食管结合部腺癌', '与含氟尿嘧啶和铂类化疗联合'], therapyUses: [use('zolbetuximab', '联合方案', 'CLDN18.2阳性、HER2阴性胃或胃食管结合部腺癌一线联合治疗')] }], testingNote: '检测抗体、评分和阈值以最新版说明书为准。', caution: '不得省略HER2阴性和联合化疗条件。', contentStatus,
  },
]

export const getRecordTherapyUses = (record: BiomarkerEvidenceRecord): ResolvedTherapyUse[] => {
  const resolved = new Map<string, ResolvedTherapyUse>()
  for (const group of record.evidenceGroups) for (const therapyUse of group.therapyUses) {
    const therapy = therapyById.get(therapyUse.therapyId)
    if (therapy && !resolved.has(therapy.id)) resolved.set(therapy.id, { therapy, use: therapyUse })
  }
  return [...resolved.values()]
}
export const getRecordTherapies = (record: BiomarkerEvidenceRecord) => getRecordTherapyUses(record).map(({ therapy }) => therapy)
export const getRecordCancers = (record: BiomarkerEvidenceRecord) => [...new Set(record.evidenceGroups.flatMap((group) => group.cancers))]
export const getRecordAlterations = (record: BiomarkerEvidenceRecord) => record.evidenceGroups.map((group) => group.alteration)
export const getReferencedTherapyCount = (records = evidenceRecords) => new Set(records.flatMap((record) => getRecordTherapies(record).map((therapy) => therapy.id))).size

const normalize = (value: string) => value.toLocaleLowerCase('zh-CN').replace(/[\s_·—–/()-]+/g, '').replace(/[（）]/g, '')
const recordText = (record: BiomarkerEvidenceRecord, mode: LookupMode) => {
  const markerText = [record.symbol, record.nameZh, record.nameEn, record.markerType, ...record.aliases, ...getRecordAlterations(record)]
  const drugText = getRecordTherapies(record).flatMap((therapy) => [therapy.name, ...therapy.aliases])
  const cancerText = getRecordCancers(record)
  if (mode === 'gene') return markerText
  if (mode === 'drug') return drugText
  if (mode === 'cancer') return cancerText
  return [...markerText, ...drugText, ...cancerText]
}
export function searchEvidence(query: string, mode: LookupMode = 'all'): BiomarkerEvidenceRecord[] {
  const term = normalize(query)
  if (!term) return evidenceRecords
  return evidenceRecords.filter((record) => recordText(record, mode).some((value) => normalize(value).includes(term)))
}
export function findEvidenceRecord(id: string) { return evidenceRecords.find((record) => record.id === id) }
