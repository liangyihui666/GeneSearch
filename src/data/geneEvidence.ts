export type LookupMode = 'all' | 'gene' | 'drug' | 'cancer'

export interface EvidenceSource {
  organization: string
  title: string
  url: string
  publishedAt: string
}

export interface TherapyRecord {
  name: string
  aliases: string[]
  regulatoryStatus: '中国获批' | '附条件批准'
  useContext: string
}

export interface GeneEvidenceRecord {
  id: string
  symbol: string
  nameZh: string
  nameEn: string
  aliases: string[]
  alteration: string
  cancers: string[]
  evidenceLabel: string
  clinicalSummary: string
  conditions: string[]
  therapies: TherapyRecord[]
  testingNote: string
  caution: string
  source: EvidenceSource
  contentStatus: '国内官方来源已核对 · 医学文案待审'
}

export const contentVersion = 'Demo v0.1'
export const contentUpdatedAt = '2026-09-01'

export const evidenceRecords: GeneEvidenceRecord[] = [
  {
    id: 'egfr-l858r-nsclc',
    symbol: 'EGFR',
    nameZh: '表皮生长因子受体',
    nameEn: 'Epidermal Growth Factor Receptor',
    aliases: ['EGFR L858R', '21号外显子L858R', '19号外显子缺失', '泽瑞尼'],
    alteration: '19号外显子缺失 / 21号外显子 L858R',
    cancers: ['非小细胞肺癌', '肺腺癌'],
    evidenceLabel: 'NMPA 中国获批',
    clinicalSummary:
      '国家药监局公开信息显示，Zorifertinib（泽瑞尼）获批用于伴中枢神经系统转移、携带 EGFR 19del 或 L858R 的局部晚期或转移性非小细胞肺癌成人患者一线治疗。',
    conditions: [
      '成人局部晚期或转移性非小细胞肺癌',
      'EGFR 19号外显子缺失或21号外显子 L858R',
      '伴中枢神经系统转移',
      '一线治疗场景',
    ],
    therapies: [
      {
        name: 'Zorifertinib（泽瑞尼）',
        aliases: ['Zorifertinib', '泽瑞尼'],
        regulatoryStatus: '中国获批',
        useContext: '限定于来源所述人群与治疗场景',
      },
    ],
    testingNote:
      '需经规范检测确认 EGFR 19del 或 L858R；具体样本、平台和伴随诊断要求以最新版说明书为准。',
    caution:
      '本条仅复述国家药监局公开批准信息，不延伸为个体化用药建议；其他 EGFR 变异需单独判断。',
    source: {
      organization: '国家药品监督管理局（NMPA）',
      title: 'Zorifertinib Hydrochloride Tablets Approved for Marketing by China NMPA',
      url: 'https://english.nmpa.gov.cn/2025-02/19/c_1073663.htm',
      publishedAt: '2025-02-19',
    },
    contentStatus: '国内官方来源已核对 · 医学文案待审',
  },
  {
    id: 'ros1-nsclc',
    symbol: 'ROS1',
    nameZh: 'ROS 原癌基因 1',
    nameEn: 'ROS Proto-Oncogene 1, Receptor Tyrosine Kinase',
    aliases: ['ROS1阳性', 'ROS1融合', '奥凯乐', 'Repotrectinib'],
    alteration: 'ROS1 融合 / 阳性',
    cancers: ['非小细胞肺癌', '肺癌'],
    evidenceLabel: 'NMPA 附条件批准',
    clinicalSummary:
      '国家药监局公开信息显示，Repotrectinib（奥凯乐）附条件批准用于 ROS1 阳性的局部晚期或转移性非小细胞肺癌成人患者。',
    conditions: [
      '成人患者',
      'ROS1 阳性',
      '局部晚期或转移性非小细胞肺癌',
      '批准性质为附条件批准',
    ],
    therapies: [
      {
        name: 'Repotrectinib（奥凯乐）',
        aliases: ['Repotrectinib', '奥凯乐'],
        regulatoryStatus: '附条件批准',
        useContext: 'ROS1 阳性局部晚期或转移性 NSCLC',
      },
    ],
    testingNote:
      '需确认 ROS1 阳性状态；具体融合检测策略及样本要求以最新版说明书和实验室规范为准。',
    caution:
      '附条件批准不等同于无条件获批；页面必须保留批准性质和适用人群。',
    source: {
      organization: '国家药品监督管理局（NMPA）',
      title: 'Repotrectinib capsules approved with conditions for marketing by China NMPA',
      url: 'https://english.nmpa.gov.cn/2024-05/11/c_1050520.htm',
      publishedAt: '2024-05-11',
    },
    contentStatus: '国内官方来源已核对 · 医学文案待审',
  },
  {
    id: 'met-ex14-nsclc',
    symbol: 'MET',
    nameZh: '间充质上皮转化因子',
    nameEn: 'MET Proto-Oncogene, Receptor Tyrosine Kinase',
    aliases: ['MET exon 14', 'METex14', 'MET 14号外显子跳跃', '谷美替尼'],
    alteration: 'MET 14号外显子跳跃突变',
    cancers: ['非小细胞肺癌', '肺癌'],
    evidenceLabel: 'NMPA 附条件批准',
    clinicalSummary:
      '国家药监局公开信息显示，谷美替尼附条件批准用于携带 MET 14号外显子跳跃突变的局部晚期或转移性非小细胞肺癌。',
    conditions: [
      'MET 14号外显子跳跃突变',
      '局部晚期或转移性非小细胞肺癌',
      '批准性质为附条件批准',
    ],
    therapies: [
      {
        name: '谷美替尼',
        aliases: ['Gumarontinib', '谷美替尼'],
        regulatoryStatus: '附条件批准',
        useContext: 'METex14 局部晚期或转移性 NSCLC',
      },
    ],
    testingNote:
      '需确认 MET 14号外显子跳跃突变；不同检测平台对剪接变异的覆盖能力需由实验室确认。',
    caution:
      'MET 扩增、MET 蛋白过表达与 METex14 不是同一生物标志物，不能直接互换结论。',
    source: {
      organization: '国家药品监督管理局（NMPA）',
      title: 'Gumarontinib tablets approved with conditions for marketing',
      url: 'https://english.nmpa.gov.cn/2023-03/08/c_896502.htm',
      publishedAt: '2023-03-08',
    },
    contentStatus: '国内官方来源已核对 · 医学文案待审',
  },
  {
    id: 'her2-positive-breast-gastric',
    symbol: 'ERBB2',
    nameZh: '人表皮生长因子受体 2（HER2）',
    nameEn: 'Erb-B2 Receptor Tyrosine Kinase 2',
    aliases: ['HER2', 'ERBB2扩增', 'HER2过表达', '曲妥珠单抗', '赫赛汀'],
    alteration: 'HER2 阳性（扩增或过表达）',
    cancers: ['乳腺癌', '胃癌', '胃食管结合部癌'],
    evidenceLabel: 'NMPA 中国获批',
    clinicalSummary:
      '国家药监局公开资料列出了曲妥珠单抗在 HER2 阳性乳腺癌及 HER2 阳性转移性胃癌等场景的国内获批适应症。',
    conditions: [
      '需确认 HER2 阳性',
      '具体方案与治疗阶段随乳腺癌或胃癌场景而异',
      '联合方案与既往治疗要求以最新版说明书为准',
    ],
    therapies: [
      {
        name: '曲妥珠单抗（赫赛汀）',
        aliases: ['曲妥珠单抗', '赫赛汀', 'Trastuzumab'],
        regulatoryStatus: '中国获批',
        useContext: 'HER2 阳性乳腺癌及特定胃癌场景',
      },
    ],
    testingNote:
      'HER2 阳性的检测与判定标准依癌种而异；原型不把乳腺癌与胃癌阈值合并展示。',
    caution:
      'ERBB2 基因扩增、HER2 蛋白过表达及 HER2 突变属于不同检测对象，需结合癌种和说明书分别判断。',
    source: {
      organization: '国家药品监督管理局（NMPA）',
      title: '注射用曲妥珠单抗公开技术资料',
      url: 'https://www.nmpa.gov.cn/directory/web/nmpa/images/16LJ5NPDxrN19bptaWucn6zuA4MvG0qnB2bSyytTR6da4tbzUrdTyLnBkZg%3D%3D.pdf',
      publishedAt: '2020-08-14',
    },
    contentStatus: '国内官方来源已核对 · 医学文案待审',
  },
  {
    id: 'cldn18-2-gastric',
    symbol: 'CLDN18.2',
    nameZh: '紧密连接蛋白 18.2',
    nameEn: 'Claudin 18 Isoform 2',
    aliases: ['CLDN18', 'CLDN18.2阳性', '威络益', 'Zolbetuximab'],
    alteration: 'CLDN18.2 阳性、HER2 阴性',
    cancers: ['胃癌', '胃食管结合部腺癌'],
    evidenceLabel: 'NMPA 中国获批',
    clinicalSummary:
      '国家药监局公开信息显示，Zolbetuximab（威络益）联合含氟尿嘧啶和铂类化疗方案获批用于 CLDN18.2 阳性、HER2 阴性的局部晚期不可切除或转移性胃/胃食管结合部腺癌一线治疗。',
    conditions: [
      'CLDN18.2 阳性',
      'HER2 阴性',
      '局部晚期不可切除或转移性胃/胃食管结合部腺癌',
      '与含氟尿嘧啶和铂类化疗联合的一线治疗',
    ],
    therapies: [
      {
        name: 'Zolbetuximab（威络益）',
        aliases: ['Zolbetuximab', '威络益'],
        regulatoryStatus: '中国获批',
        useContext: 'CLDN18.2 阳性且 HER2 阴性胃/胃食管结合部腺癌一线联合治疗',
      },
    ],
    testingNote:
      '需同时确认 CLDN18.2 阳性与 HER2 阴性；具体检测平台、抗体和阈值以最新版说明书为准。',
    caution:
      '该结论不适用于 HER2 阳性人群，也不能脱离联合化疗条件单独解读。',
    source: {
      organization: '国家药品监督管理局（NMPA）',
      title: 'Zolbetuximab for Injection Approved for Marketing by China NMPA',
      url: 'https://english.nmpa.gov.cn/2025-06/11/c_1101500.htm',
      publishedAt: '2025-06-11',
    },
    contentStatus: '国内官方来源已核对 · 医学文案待审',
  },
]

const normalize = (value: string) =>
  value
    .toLocaleLowerCase('zh-CN')
    .replace(/[\s_·—–-]+/g, '')
    .replace(/[（）()]/g, '')

const recordText = (record: GeneEvidenceRecord, mode: LookupMode) => {
  const geneText = [record.symbol, record.nameZh, record.alteration, ...record.aliases]
  const drugText = record.therapies.flatMap((therapy) => [
    therapy.name,
    ...therapy.aliases,
  ])
  const cancerText = record.cancers

  if (mode === 'gene') return geneText
  if (mode === 'drug') return drugText
  if (mode === 'cancer') return cancerText
  return [...geneText, ...drugText, ...cancerText]
}

export function searchEvidence(
  query: string,
  mode: LookupMode = 'all',
): GeneEvidenceRecord[] {
  const term = normalize(query)
  if (!term) return evidenceRecords

  return evidenceRecords.filter((record) =>
    recordText(record, mode).some((value) => normalize(value).includes(term)),
  )
}

export function findEvidenceRecord(id: string) {
  return evidenceRecords.find((record) => record.id === id)
}
