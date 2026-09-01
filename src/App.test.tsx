import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

describe('Gene lookup app', () => {
  it('renders the OncoRounds product and domestic dataset boundary', () => {
    const { container } = render(<App />)
    expect(screen.getByRole('heading', { name: '基因速查' })).toBeInTheDocument()
    expect(screen.getByText('ONCOROUNDS · 系列小工具')).toBeInTheDocument()
    expect(screen.getByText('仅收录国内来源 · 示例数据待医学审核')).toBeInTheDocument()
    expect(container.querySelector('.lookup-brand__orb')).toHaveAttribute(
      'src',
      './assets/brand/oncorounds-orb.png',
    )
  })

  it('finds a therapy from a gene search', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: '基因找药' }))
    await user.type(screen.getByRole('textbox', { name: /搜索/ }), 'EGFR L858R')
    expect(screen.getByRole('heading', { name: '表皮生长因子受体' })).toBeInTheDocument()
    expect(screen.getByText('Zorifertinib（泽瑞尼）')).toBeInTheDocument()
  })

  it('supports reverse lookup from a domestic drug to its biomarker', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: '药物找靶点' }))
    await user.type(screen.getByRole('textbox', { name: /搜索/ }), '谷美替尼')
    expect(screen.getByText('MET')).toBeInTheDocument()
    expect(screen.getByText('MET 14号外显子跳跃突变')).toBeInTheDocument()
  })

  it('finds multiple biomarkers by cancer type', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: '癌种找标志物' }))
    await user.type(screen.getByRole('textbox', { name: /搜索/ }), '胃癌')
    expect(screen.getByText('ERBB2')).toBeInTheDocument()
    expect(screen.getByText('CLDN18.2')).toBeInTheDocument()
    expect(screen.getByText('2 条')).toBeInTheDocument()
  })

  it('opens the evidence detail and preserves its domestic official source', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('heading', { name: '表皮生长因子受体' }))
    expect(screen.getByRole('heading', { name: 'EGFR' })).toBeInTheDocument()
    expect(screen.getByText('基因信息总览')).toBeInTheDocument()
    expect(screen.getByText('Epidermal Growth Factor Receptor')).toBeInTheDocument()
    expect(screen.getByText('变异与用药提示')).toBeInTheDocument()
    expect(screen.getByText('临床结论')).toBeInTheDocument()
    expect(screen.getByText('国家药品监督管理局（NMPA）')).toBeInTheDocument()
    expect(screen.getByText(/官方来源已核对 · 医学文案待审/)).toBeInTheDocument()
    expect(screen.getByText(/不替代临床判断/)).toBeInTheDocument()
  })

  it('keeps related-drug clicks as reverse lookup instead of opening detail', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: '反查 谷美替尼 对应靶点' }))
    expect(screen.getByRole('heading', { name: '间充质上皮转化因子' })).toBeInTheDocument()
    expect(screen.queryByText('证据详情')).not.toBeInTheDocument()
    expect(screen.getByText('1 条')).toBeInTheDocument()
  })

  it('shows an empty state and can reset it', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByRole('textbox', { name: /搜索/ }), '不存在的记录')
    expect(screen.getByRole('heading', { name: '暂未找到匹配样例' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '查看全部样例' }))
    expect(screen.getByText('5 条')).toBeInTheDocument()
  })

  it('does not present foreign regulator or guideline claims', () => {
    render(<App />)
    expect(screen.queryByText(/FDA|NCCN|ESMO/)).not.toBeInTheDocument()
  })
})
