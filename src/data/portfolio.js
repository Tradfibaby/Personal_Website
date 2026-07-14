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
    box: { x: 137, y: 178, w: 858, h: 376 },
    label: { x: 565, y: -52 },
    loops: [
      { video: '/portfolio/riten/chart-timeframes.mp4', still: '/portfolio/riten/still-chart.png', w: 966, h: 426, caption: 'switching timeframes' },
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
      { video: '/portfolio/riten/orderbook-depth.mp4', still: '/portfolio/riten/still-orderbook.png', w: 326, h: 520, caption: 're-aggregating the ladder' },
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
      { video: '/portfolio/riten/size-ticket.mp4', still: '/portfolio/riten/still-ticket.png', w: 326, h: 506, caption: 'sizing to 14% of buying power' },
    ],
  },
  {
    n: '04',
    title: 'the positions',
    lede: 'six open, every column live',
    copy: 'size, position value, entry and mark price, pnl with roe, liquidation price, margin and funding, on every one of the six. reverse one and the whole trade is restated before you commit. close all, and the six unwind at market together, each fill printing back as it lands, down to an empty table.',
    box: { x: 137, y: 562, w: 1138, h: 216 },
    label: { x: 706, y: 1022 },
    below: true,
    // one clip rather than three looping out of phase against each other
    stacked: true,
    loops: [
      {
        video: '/portfolio/riten/positions-story.mp4',
        still: '/portfolio/riten/still-positions-story.png',
        w: 1200,
        h: 540,
        wide: true,
        caption: 'the table live on six positions, then close all: the six unwind at market and every fill prints back, down to an empty table',
      },
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
    title: 'who got carried out',
    copy: 'total liquidations, longs against shorts, over 1h to 24h.',
    still: '/portfolio/riten/dash-liquidations.png',
    width: 172,
    height: 130,
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
