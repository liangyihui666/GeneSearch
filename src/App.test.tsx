import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'
import { evidenceRecords, getReferencedTherapyCount } from './data/geneEvidence'

describe('Gene lookup app', () => {
  it('renders product, version and full dataset counts', () => {
    const { container } = render(<App />)
    expect(screen.getByRole('heading', { name: '基因速查' })).toBeInTheDocument()
    expect(screen.getByText('ONCOROUNDS · 系列小工具')).toBeInTheDocument()
    expect(screen.getByText(`${evidenceRecords.length} 个标志物 · ${getReferencedTherapyCount()} 个药物`)).toBeInTheDocument()
    expect(screen.getByText(/Demo v0.2/)).toBeInTheDocument()
    expect(container.querySelector('.lookup-brand__orb')).toHaveAttribute('src', './assets/brand/oncorounds-orb.png')
  })

  it('finds all variation groups from a marker search', async () => {
    const user = userEvent.setup(); render(<App />)
    await user.click(screen.getByRole('button', { name: '标志物找药' }))
    await user.type(screen.getByRole('textbox', { name: /搜索/ }), 'EGFR T790M')
    expect(screen.getByRole('heading', { name: '表皮生长因子受体' })).toBeInTheDocument()
    expect(screen.getByText('3 类证据分组')).toBeInTheDocument()
  })

  it('expands all therapies inline without opening marker detail', async () => {
    const user = userEvent.setup(); render(<App />)
    const egfrCard = screen.getByRole('heading', { name: '表皮生长因子受体' }).closest('article')!
    expect(within(egfrCard).queryByText('甲磺酸贝福替尼')).not.toBeInTheDocument()
    const toggle = within(egfrCard).getByRole('button', { name: /展开全部/ })
    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    expect(within(egfrCard).getByText('甲磺酸贝福替尼')).toBeInTheDocument()
    expect(screen.queryByText('证据详情')).not.toBeInTheDocument()
  })

  it('supports reverse lookup from a domestic drug to its marker', async () => {
    const user = userEvent.setup(); render(<App />)
    await user.click(screen.getByRole('button', { name: '药物找标志物' }))
    await user.type(screen.getByRole('textbox', { name: /搜索/ }), '谷美替尼')
    expect(screen.getByText('MET')).toBeInTheDocument()
    expect(screen.getByText('2 类证据分组')).toBeInTheDocument()
  })

  it('keeps a drug click as reverse lookup instead of opening detail', async () => {
    const user = userEvent.setup(); render(<App />)
    await user.type(screen.getByRole('textbox', { name: /搜索/ }), '谷美替尼')
    await user.click(screen.getByRole('button', { name: '反查 谷美替尼 对应标志物' }))
    expect(screen.getByRole('heading', { name: '间充质上皮转化因子' })).toBeInTheDocument()
    expect(screen.queryByText('证据详情')).not.toBeInTheDocument()
  })

  it('opens grouped conclusions from every non-drug card area', async () => {
    const user = userEvent.setup(); render(<App />)
    await user.click(screen.getByRole('heading', { name: '表皮生长因子受体' }))
    expect(screen.getByText('证据详情')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'EGFR' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'EGFR T790M' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'EGFR 20号外显子插入突变' })).toBeInTheDocument()
    expect(screen.getAllByText('临床结论')).toHaveLength(3)
  })

  it('expands a therapy to show approval and coverage as separate facts', async () => {
    const user = userEvent.setup(); render(<App />)
    await user.click(screen.getByRole('heading', { name: '表皮生长因子受体' }))
    await user.click(screen.getByText('吉非替尼'))
    expect(screen.getAllByText('NMPA批准状态').length).toBeGreaterThan(0)
    expect(screen.getAllByText('医保 / 商保目录信息').length).toBeGreaterThan(0)
    expect(screen.getAllByText('2025 医保').length).toBeGreaterThan(0)
    expect(screen.getAllByText(/目录支付条件不作为获批适应证/).length).toBeGreaterThan(0)
  })

  it('shows accurate hematologic marker types', async () => {
    const user = userEvent.setup(); render(<App />)
    await user.type(screen.getByRole('textbox', { name: /搜索/ }), 'BCMA')
    expect(screen.getByRole('heading', { name: 'B细胞成熟抗原' })).toBeInTheDocument()
    expect(screen.getByText('细胞表面靶点')).toBeInTheDocument()
  })

  it('shows an empty state and can reset it', async () => {
    const user = userEvent.setup(); render(<App />)
    await user.type(screen.getByRole('textbox', { name: /搜索/ }), '不存在的记录')
    expect(screen.getByRole('heading', { name: '暂未找到匹配样例' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '查看全部样例' }))
    expect(screen.getByText(`${evidenceRecords.length} 个标志物`)).toBeInTheDocument()
  })

  it('does not present foreign regulator or guideline claims', () => {
    render(<App />)
    expect(screen.queryByText(/FDA|NCCN|ESMO/)).not.toBeInTheDocument()
  })
})
