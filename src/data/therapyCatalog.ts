export type TherapyType = '小分子抑制剂' | '单克隆抗体' | '抗体偶联药物' | '双特异性抗体' | '细胞治疗'
export type CoverageCatalog = '国家医保药品目录（2025年）' | '2025年国家医保药品目录新增名单' | '商业健康保险创新药品目录（2025年）'

export interface CoverageRecord {
  catalog: CoverageCatalog
  label: '2025 医保' | '2025 医保新增' | '2025 商保'
  restriction: string
  validFrom?: string
  validTo?: string
  sourceTitle: string
  pageNumber: number
}

export interface TherapyRecord {
  id: string
  name: string
  aliases: string[]
  therapyType: TherapyType
  coverage: CoverageRecord[]
}

const nationalCatalog = (
  pageNumber: number,
  restriction: string,
  added = false,
): CoverageRecord[] => [
  {
    catalog: '国家医保药品目录（2025年）',
    label: '2025 医保',
    restriction,
    validFrom: added ? '2026-01-01' : '2025-01-01',
    validTo: added ? '2027-12-31' : '2026-12-31',
    sourceTitle: '国家基本医疗保险、生育保险和工伤保险药品目录（2025年）',
    pageNumber,
  },
  ...(added
    ? [{
        catalog: '2025年国家医保药品目录新增名单' as const,
        label: '2025 医保新增' as const,
        restriction: '列入2025年国家医保药品目录新增名单；具体支付条件以正式目录为准。',
        sourceTitle: '2025年国家医保药品目录新增名单',
        pageNumber: 1,
      }]
    : []),
]

const commercialCatalog = (
  pageNumber: number,
  restriction: string,
): CoverageRecord[] => [{
  catalog: '商业健康保险创新药品目录（2025年）',
  label: '2025 商保',
  restriction,
  validFrom: '2026-01-01',
  validTo: '2027-12-31',
  sourceTitle: '商业健康保险创新药品目录（2025年）',
  pageNumber,
}]

const therapy = (
  id: string,
  name: string,
  therapyType: TherapyType,
  aliases: string[],
  coverage: CoverageRecord[],
): TherapyRecord => ({ id, name, therapyType, aliases, coverage })

export const therapyRecords: TherapyRecord[] = [
  therapy('gefitinib', '吉非替尼', '小分子抑制剂', ['Gefitinib'], nationalCatalog(52, '按目录内EGFR相关适应证及支付条件执行。')),
  therapy('afatinib', '阿法替尼', '小分子抑制剂', ['Afatinib'], nationalCatalog(52, '按目录内EGFR相关适应证及支付条件执行。')),
  therapy('erlotinib', '厄洛替尼', '小分子抑制剂', ['Erlotinib'], nationalCatalog(52, '按目录内EGFR相关适应证及支付条件执行。')),
  therapy('dacomitinib', '达可替尼', '小分子抑制剂', ['Dacomitinib'], nationalCatalog(52, '限EGFR 19del或L858R局部晚期或转移性NSCLC一线治疗。')),
  therapy('osimertinib', '甲磺酸奥希替尼', '小分子抑制剂', ['奥希替尼', 'Osimertinib'], nationalCatalog(52, '涵盖EGFR敏感突变、T790M及目录列明的辅助或联合治疗场景。')),
  therapy('icotinib', '盐酸埃克替尼', '小分子抑制剂', ['埃克替尼', 'Icotinib'], nationalCatalog(144, '限目录列明的EGFR敏感突变NSCLC治疗场景。')),
  therapy('almonertinib', '甲磺酸阿美替尼', '小分子抑制剂', ['阿美替尼', 'Almonertinib'], nationalCatalog(145, '涵盖EGFR敏感突变、T790M及目录列明的辅助治疗场景。')),
  therapy('furmonertinib', '甲磺酸伏美替尼', '小分子抑制剂', ['伏美替尼', 'Furmonertinib'], nationalCatalog(151, '涵盖EGFR敏感突变与T790M相关目录支付场景。')),
  therapy('befotertinib', '甲磺酸贝福替尼', '小分子抑制剂', ['贝福替尼', 'Befotertinib'], nationalCatalog(151, '限目录列明的EGFR敏感突变或T790M NSCLC治疗场景。')),
  therapy('rezivertinib', '甲磺酸瑞厄替尼', '小分子抑制剂', ['瑞厄替尼', 'Rezivertinib'], nationalCatalog(152, '限目录列明的EGFR敏感突变或T790M NSCLC治疗场景。')),
  therapy('rilertinib', '甲磺酸瑞齐替尼', '小分子抑制剂', ['瑞齐替尼', 'Rilertinib'], nationalCatalog(152, '限EGFR T790M阳性局部晚期或转移性NSCLC成人患者。')),
  therapy('sunvozertinib', '舒沃替尼', '小分子抑制剂', ['舒沃哲', 'Sunvozertinib'], nationalCatalog(153, '限EGFR 20号外显子插入突变相关目录支付场景。')),
  therapy('limertinib', '利厄替尼', '小分子抑制剂', ['Limertinib'], nationalCatalog(154, '涵盖EGFR敏感突变与T790M相关目录支付场景。', true)),
  therapy('zorifertinib', '盐酸佐利替尼', '小分子抑制剂', ['泽瑞尼', 'Zorifertinib'], nationalCatalog(154, '限EGFR 19del或L858R并伴中枢神经系统转移的相关场景。', true)),

  therapy('ceritinib', '塞瑞替尼', '小分子抑制剂', ['Ceritinib'], nationalCatalog(52, '限ALK阳性局部晚期或转移性NSCLC。')),
  therapy('crizotinib', '克唑替尼', '小分子抑制剂', ['Crizotinib'], nationalCatalog(52, '限ALK阳性或ROS1阳性晚期NSCLC相关场景。')),
  therapy('alectinib', '盐酸阿来替尼', '小分子抑制剂', ['阿来替尼', 'Alectinib'], nationalCatalog(145, '限ALK阳性NSCLC目录列明的辅助或晚期治疗场景。')),
  therapy('brigatinib', '布格替尼', '小分子抑制剂', ['Brigatinib'], nationalCatalog(146, '限ALK阳性局部晚期或转移性NSCLC。')),
  therapy('lorlatinib', '洛拉替尼', '小分子抑制剂', ['Lorlatinib'], nationalCatalog(146, '限ALK阳性局部晚期或转移性NSCLC。')),
  therapy('ensartinib', '盐酸恩沙替尼', '小分子抑制剂', ['恩沙替尼', 'Ensartinib'], nationalCatalog(150, '限ALK阳性局部晚期或转移性NSCLC。')),
  therapy('iruplinalkib', '伊鲁阿克', '小分子抑制剂', ['启欣可', 'Iruplinalkib'], nationalCatalog(152, '限ALK阳性局部晚期或转移性NSCLC相关场景。')),
  therapy('envonalkib', '枸橼酸依奉阿克', '小分子抑制剂', ['安洛晴', 'Envonalkib'], nationalCatalog(153, '限未接受过ALK抑制剂治疗的ALK阳性晚期NSCLC。')),

  therapy('entrectinib', '恩曲替尼', '小分子抑制剂', ['Entrectinib'], nationalCatalog(149, '限NTRK融合实体瘤或ROS1阳性晚期NSCLC目录场景。')),
  therapy('repotrectinib', '瑞普替尼', '小分子抑制剂', ['奥凯乐', 'Repotrectinib'], nationalCatalog(152, '限ROS1阳性局部晚期或转移性NSCLC。')),
  therapy('unecritinib', '富马酸安奈克替尼', '小分子抑制剂', ['安奈克替尼', 'Unecritinib'], nationalCatalog(153, '限ROS1阳性局部晚期或转移性NSCLC。')),
  therapy('taletrectinib', '己二酸他雷替尼', '小分子抑制剂', ['他雷替尼', 'Taletrectinib'], nationalCatalog(154, '限ROS1阳性局部晚期或转移性NSCLC。', true)),

  therapy('savolitinib', '赛沃替尼', '小分子抑制剂', ['Savolitinib'], nationalCatalog(151, '限MET 14号外显子跳跃突变晚期NSCLC。')),
  therapy('gumarontinib', '谷美替尼', '小分子抑制剂', ['Gumarontinib'], nationalCatalog(151, '限MET 14号外显子跳跃突变晚期NSCLC。')),
  therapy('capmatinib', '盐酸卡马替尼', '小分子抑制剂', ['卡马替尼', 'Capmatinib'], nationalCatalog(152, '限MET 14号外显子跳跃突变晚期NSCLC。')),
  therapy('tepotinib', '盐酸特泊替尼', '小分子抑制剂', ['特泊替尼', 'Tepotinib'], nationalCatalog(152, '限MET 14号外显子跳跃突变晚期NSCLC。')),
  therapy('vebreltinib', '伯瑞替尼', '小分子抑制剂', ['Vebreltinib'], nationalCatalog(153, '涵盖METex14、MET扩增及目录列明的PTPRZ1-MET融合场景。')),

  therapy('vemurafenib', '维莫非尼', '小分子抑制剂', ['Vemurafenib'], nationalCatalog(145, '限BRAF V600突变阳性不可切除或转移性黑色素瘤。')),
  therapy('dabrafenib', '甲磺酸达拉非尼', '小分子抑制剂', ['达拉非尼', 'Dabrafenib'], nationalCatalog(145, '与曲美替尼联合用于目录列明的BRAF V600突变场景。')),
  therapy('trametinib', '曲美替尼', '小分子抑制剂', ['Trametinib'], nationalCatalog(146, '与达拉非尼联合用于目录列明的BRAF V600突变场景。')),
  therapy('larotrectinib', '硫酸拉罗替尼', '小分子抑制剂', ['拉罗替尼', 'Larotrectinib'], nationalCatalog(153, '限NTRK融合且无满意替代治疗的实体瘤目录场景。')),
  therapy('pralsetinib', '普拉替尼', '小分子抑制剂', ['Pralsetinib'], nationalCatalog(154, '限RET融合NSCLC或目录列明的RET相关甲状腺癌。', true)),
  therapy('selpercatinib', '塞普替尼', '小分子抑制剂', ['Selpercatinib'], nationalCatalog(154, '限RET融合NSCLC或目录列明的RET相关甲状腺癌。', true)),
  therapy('fulzerasib', '氟泽雷塞', '小分子抑制剂', ['达伯特', 'Fulzerasib'], nationalCatalog(154, '限经至少一种系统治疗的KRAS G12C突变晚期NSCLC。')),
  therapy('glecirasib', '枸橼酸戈来雷塞', '小分子抑制剂', ['戈来雷塞', 'Glecirasib'], nationalCatalog(154, '限经至少一种系统治疗的KRAS G12C突变晚期NSCLC。', true)),
  therapy('garsorasib', '格索雷塞', '小分子抑制剂', ['安方宁', 'Garsorasib'], nationalCatalog(155, '限经至少一种系统治疗的KRAS G12C突变晚期NSCLC。', true)),

  therapy('trastuzumab', '曲妥珠单抗', '单克隆抗体', ['赫赛汀', 'Trastuzumab'], nationalCatalog(156, '限目录列明的HER2阳性乳腺癌及相关场景。')),
  therapy('pertuzumab', '帕妥珠单抗', '单克隆抗体', ['Pertuzumab'], nationalCatalog(54, '限HER2阳性乳腺癌目录列明的新辅助或辅助治疗。')),
  therapy('neratinib', '马来酸奈拉替尼', '小分子抑制剂', ['奈拉替尼', 'Neratinib'], nationalCatalog(53, '限HER2阳性早期乳腺癌强化辅助治疗。')),
  therapy('pyrotinib', '马来酸吡咯替尼', '小分子抑制剂', ['吡咯替尼', 'Pyrotinib'], nationalCatalog(150, '限HER2阳性乳腺癌目录列明的治疗场景。')),
  therapy('t-dm1', '注射用恩美曲妥珠单抗', '抗体偶联药物', ['恩美曲妥珠单抗', 'T-DM1'], nationalCatalog(156, '限HER2阳性乳腺癌目录列明的辅助或晚期治疗。')),
  therapy('t-dxd', '注射用德曲妥珠单抗', '抗体偶联药物', ['德曲妥珠单抗', 'T-DXd'], nationalCatalog(157, '限目录列明的HER2阳性或HER2低表达乳腺癌场景。')),
  therapy('sac-tmt', '注射用瑞康曲妥珠单抗', '抗体偶联药物', ['瑞康曲妥珠单抗'], nationalCatalog(157, '限HER2/ERBB2激活突变晚期NSCLC。')),
  therapy('disitamab-vedotin', '注射用维迪西妥单抗', '抗体偶联药物', ['维迪西妥单抗', 'Disitamab vedotin'], nationalCatalog(165, '限目录列明的HER2过表达胃癌或尿路上皮癌。')),
  therapy('zanidatamab', '注射用泽尼达妥单抗', '双特异性抗体', ['百赫安', 'Zanidatamab'], commercialCatalog(2, '限既往接受过全身治疗的HER2高表达不可切除局部晚期或转移性胆道癌。')),

  therapy('olaparib', '奥拉帕利', '小分子抑制剂', ['Olaparib'], nationalCatalog(55, '限目录列明的BRCA突变卵巢癌、前列腺癌或乳腺癌场景。')),
  therapy('niraparib', '甲苯磺酸尼拉帕利', '小分子抑制剂', ['尼拉帕利', 'Niraparib'], nationalCatalog(164, '限目录列明的BRCA相关或铂敏感卵巢癌维持治疗。')),
  therapy('pamiparib', '帕米帕利', '小分子抑制剂', ['Pamiparib'], nationalCatalog(164, '限胚系BRCA突变复发性晚期卵巢癌相关场景。', true)),
  therapy('fluzoparib', '氟唑帕利', '小分子抑制剂', ['Fluzoparib'], nationalCatalog(165, '限目录列明的BRCA突变卵巢癌或乳腺癌场景。')),
  therapy('inavolisib', '伊那利塞', '小分子抑制剂', ['Inavolisib'], nationalCatalog(149, '限PIK3CA突变且HR阳性/HER2阴性晚期乳腺癌相关场景。', true)),
  therapy('capivasertib', '卡匹色替', '小分子抑制剂', ['Capivasertib'], nationalCatalog(155, '限PIK3CA/AKT1/PTEN改变且HR阳性/HER2阴性晚期乳腺癌。', true)),
  therapy('cetuximab', '西妥昔单抗', '单克隆抗体', ['Cetuximab'], nationalCatalog(157, '限RAS野生型转移性结直肠癌等目录场景。')),
  therapy('cetuximab-beta', '西妥昔单抗β', '单克隆抗体', ['Cetuximab beta'], nationalCatalog(157, '限RAS/BRAF野生型转移性结直肠癌。')),
  therapy('cetuximab-n01', '西妥昔单抗N01', '单克隆抗体', ['Cetuximab N01'], nationalCatalog(157, '限RAS野生型转移性结直肠癌。', true)),
  therapy('tunlametinib', '妥拉美替尼', '小分子抑制剂', ['Tunlametinib'], nationalCatalog(153, '限抗PD-1/PD-L1治疗失败的NRAS突变晚期黑色素瘤。')),
  therapy('ivosidenib', '艾伏尼布', '小分子抑制剂', ['Ivosidenib'], nationalCatalog(164, '限IDH1突变复发或难治性AML成人患者。', true)),
  therapy('tazemetostat', '氢溴酸他泽司他', '小分子抑制剂', ['他泽司他', 'Tazemetostat'], commercialCatalog(4, '限至少接受过两种系统治疗后的EZH2突变型复发或难治性滤泡性淋巴瘤。')),

  therapy('axi-cel', '阿基仑赛注射液', '细胞治疗', ['奕凯达', 'Axicabtagene ciloleucel'], commercialCatalog(3, '限目录列明的CD19阳性复发或难治性大B细胞淋巴瘤。')),
  therapy('relma-cel', '瑞基奥仑赛注射液', '细胞治疗', ['倍诺达', 'Relmacabtagene autoleucel'], commercialCatalog(4, '限目录列明的CD19阳性复发或难治性淋巴瘤。')),
  therapy('fucaso-cel', '纳基奥仑赛注射液', '细胞治疗', ['源瑞达'], commercialCatalog(3, '限成人复发或难治性B细胞急性淋巴细胞白血病。')),
  therapy('equi-cel', '伊基奥仑赛注射液', '细胞治疗', ['福可苏'], commercialCatalog(4, '限复发或难治性多发性骨髓瘤目录场景。')),
  therapy('zevor-cel', '泽沃基奥仑赛注射液', '细胞治疗', ['赛恺泽'], commercialCatalog(4, '限复发或难治性多发性骨髓瘤目录场景。')),
  therapy('cilta-cel', '西达基奥仑赛注射液', '细胞治疗', ['卡卫荻', 'Ciltacabtagene autoleucel'], commercialCatalog(4, '限既往多线治疗后进展的复发或难治性多发性骨髓瘤。')),

  therapy('pembrolizumab', '帕博利珠单抗', '单克隆抗体', ['Pembrolizumab'], nationalCatalog(158, '按目录内PD-L1或MSI-H/dMMR相关支付条件执行。')),
  therapy('nivolumab', '纳武利尤单抗', '单克隆抗体', ['Nivolumab'], commercialCatalog(3, '按商保目录列明的MSI-H/dMMR结直肠癌等适应证执行。')),
  therapy('serplulimab', '斯鲁利单抗', '单克隆抗体', ['Serplulimab'], nationalCatalog(159, '按目录内MSI-H实体瘤等支付条件执行。')),
  therapy('zolbetuximab', '注射用佐妥昔单抗', '单克隆抗体', ['威络益', 'Zolbetuximab'], []),
]

export const therapyById = new Map(therapyRecords.map((item) => [item.id, item]))

export const getCoverageLabels = (record: TherapyRecord) =>
  [...new Set(record.coverage.map((item) => item.label))]
