export const portfolio = [
  {
    slug: 'own',
    name: 'own.fun',
    tagline: 'onchain culture, simplified',
    hero: 'ownfun',
    mainVideo: '/portfolio/ownfun-promo.mp4',
    mainPoster: '/portfolio/ownfun-promo-poster.jpg',
    mainAspect: '16 / 9',
    scrubVideo: '/portfolio/ownfun-promo-scrub.mp4',
    scrubDuration: 30.56,
    chapters: [
      { start: 0 },
      { start: 4.1 },
      { start: 7.9 },
      { start: 10.9 },
      { start: 13.1 },
      { start: 17.9 },
      { start: 23.9 },
    ],
  },
  {
    slug: 'riten',
    name: 'riten zone',
    tagline: 'a trading terminal in your pocket',
    hero: 'riten',
    mainVideo: '/portfolio/riten-demo-black.mp4',
    mainPoster: '/portfolio/riten-demo-black-poster.jpg',
    mainAspect: '1440 / 738',
  },
]

/* The four regions of the one screen. The exploded diagram calls these out on the
   device itself, so the coordinates below are in the hero video's own pixel space
   (1720 x 840) - move a crop, move the callout with it. */
export const ritenParts = [
  {
    n: '01',
    title: 'the chart',
    lede: 'live, 1h, 4h, 12h, 1d',
    copy: 'switch the timeframe and the candles redraw, volume follows, and the open, high, low and close restate above them. mark, oracle, 24h change, open interest and funding sit in the strip above, so the instrument never has to be looked up.',
    box: { x: 137, y: 150, w: 858, h: 404 },
    label: { x: 565, y: -52 },
    loops: [
      { video: '/portfolio/riten/chart-timeframes.mp4', still: '/portfolio/riten/still-chart.png', w: 844, h: 480, caption: 'switching timeframes' },
    ],
  },
  {
    n: '02',
    title: 'the book',
    lede: 'every level of depth',
    copy: 'both ladders and the spread, always on screen. tick size steps from 0.001 to 0.01 and the book re-aggregates around the mid, so you can zoom out to find the wall and back in to work the spread.',
    box: { x: 997, y: 100, w: 278, h: 455 },
    label: { x: 1135, y: -52 },
    loops: [
      { video: '/portfolio/riten/orderbook-depth.mp4', still: '/portfolio/riten/still-orderbook.png', w: 350, h: 520, caption: 're-aggregating the ladder' },
    ],
  },
  {
    n: '03',
    title: 'the ticket',
    lede: 'the whole order, one column',
    copy: 'cross margin, leverage, market or limit, reduce-only, take profit and stop loss. drag the size and margin, liquidation price and fees all recalculate together. nothing is a screen away.',
    box: { x: 1278, y: 100, w: 282, h: 600 },   // down past Place Order, to the liq/margin/fees summary
    label: { x: 1450, y: -124 },
    loops: [
      { video: '/portfolio/riten/size-ticket.mp4', still: '/portfolio/riten/still-ticket.png', w: 420, h: 480, caption: 'sizing to 14% of buying power' },
    ],
  },
  {
    n: '04',
    title: 'the positions',
    lede: 'and what you can do to them',
    copy: 'five open, with pnl, roe, liquidation price and margin on each. reverse one and the trade is restated before you commit. close them all and the fills stack up as they land.',
    box: { x: 137, y: 558, w: 1138, h: 188 },
    label: { x: 706, y: 1022 },
    below: true,
    loops: [
      { video: '/portfolio/riten/reverse.mp4', still: '/portfolio/riten/still-reverse.png', w: 530, h: 690, caption: 'reversing in one step' },
      { video: '/portfolio/riten/order-fills.mp4', still: '/portfolio/riten/still-positions.png', w: 500, h: 330, caption: 'market-closing the book' },
    ],
  },
]

/* The macro widgets come from a 640x296 recording of an app that no longer runs, so
   they are pinned to native pixels. Scaling any of them up turns them to mush. */
export const ritenMacro = [
  {
    title: 'institutional interest',
    copy: 'etf net flow, btc against eth, scrubbed by the day.',
    video: '/portfolio/riten/dash-etf.mp4',
    still: '/portfolio/riten/dash-etf.png',
    width: 400,
    height: 142,
  },
  {
    title: 'the degen read',
    copy: 'fear and greed at 9. the altcoin index at 45.',
    still: '/portfolio/riten/dash-sentiment.png',
    width: 208,
    height: 144,
  },
  {
    title: 'dry powder',
    copy: 'stablecoin market cap, scrubbed back through the week.',
    video: '/portfolio/riten/dash-stablecoin.mp4',
    still: '/portfolio/riten/dash-stablecoin.png',
    width: 170,
    height: 130,
  },
  {
    title: 'the macro factor',
    copy: 'december fomc, priced as a cut, a hold or a hike.',
    video: '/portfolio/riten/dash-fed.mp4',
    still: '/portfolio/riten/dash-fed.png',
    width: 272,
    height: 136,
  },
]
