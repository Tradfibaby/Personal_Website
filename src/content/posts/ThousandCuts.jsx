import './ThousandCuts.css'

const StatBlock = ({ filename, label, value, children }) => (
  <div className="tso-stat">
    <div className="tso-stat-header">
      <span>{filename}</span>
    </div>
    <div className="tso-stat-body">
      <div className="tso-stat-label">{label}</div>
      <div className="tso-stat-value">{value}</div>
      <div className="tso-stat-context">{children}</div>
    </div>
  </div>
)

const QuoteCard = ({ tag, meta, children }) => (
  <div className="tso-quote-card">
    <div className="tso-qc-meta">
      <span className="tso-tag">{tag}</span>
      <span>{meta}</span>
    </div>
    <div className="tso-qc-body">{children}</div>
  </div>
)

const Stage = ({ children }) => (
  <div className="tso-stage">{children}</div>
)

const Pullquote = ({ children }) => (
  <p className="tso-pullquote">{children}</p>
)

const Divider = () => (
  <div className="tso-divider">— · —</div>
)

export default function ThousandCuts() {
  return (
    <div className="tso-root">
      <div className="tso-article">

        <p className="tso-deck">
          Each cut, on its own, looks like a tidier process. In aggregate, it looks
          like something the United States economy has not seen outside a recession
          or a pandemic in a generation.
        </p>

        {/* I */}
        <Stage>i. the first cut</Stage>

        <p>The first cut is always reasonable.</p>

        <p>
          A team of fourteen becomes a team of thirteen. The work does not disappear.
          It gets redistributed: a script, a dashboard, a colleague who absorbs the
          residual. Nobody is overworked. The dashboard is sharper than the deck.
          The team's budget comes in three percent under plan. The manager gets a
          small bonus.
        </p>

        <p>
          This story has been told over a million times in the last twelve months.
          That is not a figure of speech.
        </p>

        <StatBlock
          filename="announced_us_job_cuts.csv · 2025"
          label="total · full year"
          value="1,206,374"
        >
          Up 58% on 2024. Seventh-highest annual total in the dataset's thirty-six-year
          history. Q4 alone was 259,948 - the worst fourth quarter since 2008. AI was
          named directly in 54,836 of these.{' '}
          <a
            href="https://www.challengergray.com/blog/2025-year-end-challenger-report-highest-q4-layoffs-since-2008-lowest-ytd-hiring-since-2010/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Source: Challenger, Gray &amp; Christmas
          </a>.
        </StatBlock>

        <p>
          The other six years on this list, ignoring 2020, are 2001, 2002, 2003,
          2008, and 2009. Recession years.
        </p>

        <p>
          This is what an optimisation looks like at scale. Each instance, up close,
          looks like a tidier process. In aggregate, it looks like something the
          United States economy has not seen outside a recession or a pandemic in a
          generation.
        </p>

        <Divider />

        {/* II */}
        <Stage>ii. the arithmetic</Stage>

        <p>Some numbers worth sitting with.</p>

        <p>
          There are roughly 150 million white-collar jobs across the OECD economies.
          In the US,{' '}
          <a
            href="https://www.bloomberg.com/news/articles/2025-09-16/top-10-of-earners-drive-a-growing-share-of-us-consumer-spending"
            target="_blank"
            rel="noopener noreferrer"
          >
            the top 10% of earners - households making $250,000 or more - now account
            for 49.2% of all consumer spending
          </a>
          , per Moody's Analytics. That is the highest share in the data series, which
          goes back to 1989, and up from roughly 36% three decades ago. The Minneapolis
          Fed has{' '}
          <a
            href="https://www.minneapolisfed.org/article/2026/have-us-consumers-gone-k-shaped-a-review-of-the-data"
            target="_blank"
            rel="noopener noreferrer"
          >
            pushed back on the methodology
          </a>{' '}
          and produced more conservative estimates, but every plausible reading of
          the data tells the same directional story: a small slice of high earners
          drives a wildly disproportionate share of demand. This is not how the
          economy is usually described, because it is not how anyone wants to
          describe it, but the arithmetic does not care.
        </p>

        <p>
          Now layer in a productivity tool that compresses the headcount required
          to do white-collar work, with a cost of inference that has fallen by an
          order of magnitude every twelve months for four consecutive years. Apply
          it differentially. Watch.
        </p>

        <p>
          <a
            href="https://www.hiringlab.org/2025/11/06/job-postings-erode-as-government-shutdown-continues/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Indeed Hiring Lab's data
          </a>
          , the cleanest occupational read available in close-to-real time, showed
          total US job postings at their lowest level since 2021 by October 2025,
          with year-on-year declines in nearly every sector tracked. Postings in
          California and Washington - the two most tech-heavy state economies -
          sat 17% and 24% below pre-pandemic norms.{' '}
          <a
            href="https://www.ciodive.com/news/indeed-AI-jobs-report/806111/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Data and analytics postings were down 13% year-on-year, IT systems and
            solutions down 9%
          </a>
          . Tech, media, and professional services, per Indeed's economists,{' '}
          <a
            href="https://www.indeed.com/news/releases/hiringlab-2026-jobs-hiring-trends-report"
            target="_blank"
            rel="noopener noreferrer"
          >
            remained "significantly weaker" than pre-pandemic norms
          </a>{' '}
          whilst healthcare alone accounted for nearly three-quarters of net job
          growth in 2025. The composition is the story. The headline unemployment
          rate, which sat at 4.4% in December 2025 and 4.3% by March 2026, is what
          made the front page.
        </p>

        <Pullquote>
          The headline was a weighted average. The weighted average smoothed both
          signals into nothing.
        </Pullquote>

        <Divider />

        {/* III */}
        <Stage>iii. maria</Stage>

        <p>Maria is fictional. The mechanism she sits inside is not.</p>

        <p>
          She made $190,000 a year as a senior product manager at a public software
          company. She paid $4,400 a month for a one-bedroom in San Francisco. She
          spent about $14,000 a year at restaurants. She paid a personal trainer
          $3,600 a year and a therapist $7,000 a year. She took two international
          trips. She bought clothes from a brand whose marketing budget paid an
          agency whose creative director made $230,000 a year.
        </p>

        <p>
          When her job was absorbed into a model, in the third round of cuts in
          the spring of 2027, her income dropped to $52,000 driving rideshare. The
          trainer lost her. The therapist lost her. The restaurants lost her. The
          brand lost her, and the agency lost the brand's retainer, and three months
          later the creative director was the one driving rideshare.
        </p>

        <p>
          The dollar she used to spend at the trainer's studio did not vanish into
          the void. It went somewhere. In her former employer's case, it went to
          the bottom line, then to the share price, then to the equity compensation
          of the people who had not been let go. By the time it cleared the loop
          and came back to the consumer economy, in the form of a marketing budget
          or an executive bonus, it was a fraction of what it had been before -
          because the fraction is the <em>point</em> of the optimisation.
        </p>

        <p>
          The dollar that was a salary becomes a margin point. The margin point
          becomes a price-to-earnings multiple. The multiple becomes a stock price.
          The stock price becomes a paper fortune for a few thousand people who,
          however lavishly they live, cannot eat at restaurants 380 times more than
          Maria did. They cannot get 380 trainers. They cannot wear 380 outfits.
          The propensity to consume of a $190,000 salary is something close to 95%.
          The propensity to consume of a $190,000 increment to a billionaire's net
          worth is, give or take, zero.
        </p>

        <p>
          This is not a critique of capital allocation. It is an accounting identity.
          When you remove a salary and add a margin point, you are not just
          transferring wealth. You are translating it from a high-velocity form
          into a low-velocity one.
        </p>

        <Divider />

        {/* IV */}
        <Stage>iv. velocity</Stage>

        <p>Velocity is the word that does not get used enough in this debate.</p>

        <p>
          <a
            href="https://tradingeconomics.com/united-states/gdp-growth"
            target="_blank"
            rel="noopener noreferrer"
          >
            Real GDP grew 2.1% in 2025
          </a>{' '}
          and rose at a 2.0% annual rate in Q1 2026, after a Q4 2025 reading of
          just 0.5%. Hiring has stayed flat through this - the labour market that
          Indeed economists describe as "frozen", with low hires and low fires
          sitting on top of a steadily declining job-postings base. Most strikingly:
        </p>

        <StatBlock
          filename="us_labour_share_of_income.dat · q3_2025"
          label="nonfarm business sector"
          value="53.8%"
        >
          Lowest reading since BLS began measuring in 1947, when it stood at 70%.
          In 1990, after a decade of deindustrialisation, it was still 67.3%.{' '}
          <a
            href="https://prospect.org/2026/01/19/american-workers-labor-bureau-labor-statistics-gdp-redistribution-wealth/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Source: BLS via The American Prospect
          </a>.
        </StatBlock>

        <p>
          These facts do not contradict each other. They describe the same economy
          from different angles. The economy is producing more output with less
          labour, that output is accruing to capital, and the capital is recirculating
          through the consumer economy at a fraction of the rate the labour income
          would have. The dashboard is sharper than the deck. The deck used to feed
          nineteen restaurants.
        </p>

        <p>
          A senior banker at one of the major lenders said it more cleanly than we
          ever could, in a private dinner in February:
        </p>

        <QuoteCard tag="off the record" meta="mid-feb 2026">
          The velocity of money is collapsing, and nobody at our shop has a model
          for it.
        </QuoteCard>

        <Divider />

        {/* V */}
        <Stage>v. the logic of the firm</Stage>

        <p>The corporate logic is airtight at the level of the firm.</p>

        <p>
          A chief financial officer at a mid-cap software company looks at her cost
          base. Forty percent of operating expense is people. Of that, perhaps a
          quarter is in functions that could, by mid-2026, be substantially automated
          by current tools - engineering, customer support, copywriting, design,
          analytics. Reducing those functions by a third saves around 3.3% of revenue.
          At a 25-times-earnings multiple, that 3.3% of revenue is worth 80-100% of
          the company's current market capitalisation in present-value terms.
        </p>

        <p>
          She is not insane. She is not greedy. She is doing the job the board hired
          her to do, against benchmarks the board reads in the trade press every
          Monday morning. Her competitors' CFOs are doing the same calculation. So
          is her CFO peer at the largest customer of her firm, the one whose renewal
          is up in Q3.
        </p>

        <p>
          The competitor with the most aggressive cost programme will outperform on
          margin, see its multiple expand, raise cheaper capital, and either acquire
          the laggards or take their share. The CFO who refuses to play this game
          will be replaced by one who will. There is no individual rationality
          available that does not lead, on aggregate, to the same outcome.
        </p>

        <Pullquote>
          The standard frame is "should companies use AI to reduce headcount?" The
          question has the same structure as "should fish swim?" The water is not
          optional.
        </Pullquote>

        <Divider />

        {/* VI */}
        <Stage>vi. what is new</Stage>

        <p>
          What is genuinely new, and what we want to be careful about, is not the
          existence of automation. The economy has absorbed waves of automation for
          two centuries. The cotton mill displaced the hand-loom weaver. The tractor
          displaced the farmhand. The ATM displaced the bank teller. Each transition
          was painful for the displaced cohort and beneficial in aggregate, because
          the displaced cohort eventually found work in adjacent sectors that the
          technology, by raising productivity, had made more affordable.
        </p>

        <p>
          The transition mechanism had two ingredients. First, the new technology
          displaced <em>some</em> tasks, not most. Second, the displaced cohort had
          access to adjacent occupations that the technology was not also automating
          in parallel.
        </p>

        <p>
          The current wave is unusual in both respects. A general-purpose intelligence
          does not displace one occupation. It displaces a vector of cognitive tasks
          that runs through nearly every white-collar role at once. The product
          manager and the lawyer and the analyst and the consultant and the copywriter
          and the designer are not in different boats. They are in the same boat,
          watching the same water rise.
        </p>

        <p>
          There may yet be adjacent sectors. The historical track record favours
          that outcome. New industries we cannot picture from here may yet emerge
          to absorb the displaced cohort, and we will look back on this essay the
          way we now look back on the Luddites - with a certain affectionate
          condescension. We hope so. We are not certain.
        </p>

        <p>
          What we are certain of is the shape of the next eighteen months. The cuts
          will continue. The aggregate consumption hit will continue to compound.
          The political response will, eventually, intervene, but the political
          response moves on a multi-year cadence and the technology is moving on a
          quarterly one.
        </p>

        <Divider />

        {/* VII */}
        <Stage>vii. the glass building</Stage>

        <p>
          It is late afternoon. Somewhere in a glass building in Midtown, a CFO is
          signing off on a Q2 cost programme. The slide projects $42 million in
          annualised savings against $4 million in severance. The chart shows the
          savings flowing to operating margin, then to free cash flow, then to share
          buybacks. The buybacks support the share price, which supports the equity
          compensation, which supports the executives who voted for the programme.
        </p>

        <p>
          Down the road, in another glass building, another CFO is opening a deck
          that says revenues came in 4% under plan. The driver is{' '}
          <em>softness in discretionary spending categories</em>. The recommendation,
          in the appendix, is a Q3 cost programme.
        </p>

        <p>
          Neither of them knows about the other. Neither of them needs to. The
          system does not require their consent. It only requires that, in each
          room, when the chart is shown, they make the decision that any reasonable
          person would make.
        </p>

        <Pullquote>
          A thousand reasonable people, in a thousand reasonable rooms, with a
          thousand sharper dashboards, can do something that none of them would have
          chosen and none of them can undo.
        </Pullquote>

        <p>This is what optimisation looks like, with the arithmetic showing.</p>

        {/* Sources */}
        <section className="tso-sources">
          <h2 className="tso-h2">sources</h2>
          <table className="tso-sources-table">
            <thead>
              <tr>
                <th style={{ width: '60%' }}>claim</th>
                <th>source</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1.21M announced job cuts in 2025; +58% YoY; 7th-highest annual total since 1989; Q4 worst since 2008; AI cited in 54,836</td>
                <td><a href="https://www.challengergray.com/blog/2025-year-end-challenger-report-highest-q4-layoffs-since-2008-lowest-ytd-hiring-since-2010/" target="_blank" rel="noopener noreferrer">Challenger, Gray &amp; Christmas (jan 2026)</a></td>
              </tr>
              <tr>
                <td>Top 10% = 49.2% of consumer spending, highest in series back to 1989</td>
                <td><a href="https://www.bloomberg.com/news/articles/2025-09-16/top-10-of-earners-drive-a-growing-share-of-us-consumer-spending" target="_blank" rel="noopener noreferrer">Moody's Analytics / Bloomberg</a></td>
              </tr>
              <tr>
                <td>Methodological caveat on Moody's K-shape estimate</td>
                <td><a href="https://www.minneapolisfed.org/article/2026/have-us-consumers-gone-k-shaped-a-review-of-the-data" target="_blank" rel="noopener noreferrer">Minneapolis Fed (mar 2026)</a></td>
              </tr>
              <tr>
                <td>Total US job postings at lowest since 2021; CA / WA -17% / -24% vs pre-pandemic</td>
                <td><a href="https://www.hiringlab.org/2025/11/06/job-postings-erode-as-government-shutdown-continues/" target="_blank" rel="noopener noreferrer">Indeed Hiring Lab (nov 2025)</a></td>
              </tr>
              <tr>
                <td>Data &amp; analytics postings -13% YoY; IT systems -9%</td>
                <td><a href="https://www.ciodive.com/news/indeed-AI-jobs-report/806111/" target="_blank" rel="noopener noreferrer">CIO Dive citing Indeed (nov 2025)</a></td>
              </tr>
              <tr>
                <td>White-collar sectors significantly weaker; healthcare ~75% of net job growth in 2025</td>
                <td><a href="https://www.indeed.com/news/releases/hiringlab-2026-jobs-hiring-trends-report" target="_blank" rel="noopener noreferrer">Indeed 2026 US Jobs &amp; Hiring Trends Report</a></td>
              </tr>
              <tr>
                <td>Unemployment 4.4% dec 2025, 4.3% mar 2026</td>
                <td><a href="https://www.bls.gov/news.release/empsit.nr0.htm" target="_blank" rel="noopener noreferrer">BLS Employment Situation</a></td>
              </tr>
              <tr>
                <td>Real GDP +2.1% in 2025; +2.0% annualised in Q1 2026; Q4 2025 was 0.5%</td>
                <td><a href="https://tradingeconomics.com/united-states/gdp-growth" target="_blank" rel="noopener noreferrer">BEA via Trading Economics</a></td>
              </tr>
              <tr>
                <td>Labour share = 53.8% in Q3 2025, lowest since 1947</td>
                <td><a href="https://prospect.org/2026/01/19/american-workers-labor-bureau-labor-statistics-gdp-redistribution-wealth/" target="_blank" rel="noopener noreferrer">BLS via The American Prospect</a></td>
              </tr>
            </tbody>
          </table>
        </section>

      </div>
    </div>
  )
}
