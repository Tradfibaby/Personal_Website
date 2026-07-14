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

/* Every loop is a crop of the demo recording, so each one carries a still for
   visitors who have asked their system for less motion. */
export const ritenDesk = [
  {
    title: 'reverse a position',
    copy: 'the screen dims, the sheet rises, and the trade is restated before you commit: long to short, same size, at market, with the new liquidation price.',
    video: '/portfolio/riten/reverse.mp4',
    still: '/portfolio/riten/still-reverse.png',
    width: 530,
    height: 690,
  },
  {
    title: 'close the whole book',
    copy: 'five positions market-closed one after another, fills stacking as they land. the position count ticks down behind them.',
    video: '/portfolio/riten/order-fills.mp4',
    still: '/portfolio/riten/still-positions.png',
    width: 500,
    height: 330,
  },
  {
    title: 'read every level of depth',
    copy: 'tick size steps from 0.001 to 0.01 and the ladder rebuilds itself around the spread. both sides, always visible.',
    video: '/portfolio/riten/orderbook-depth.mp4',
    still: '/portfolio/riten/still-orderbook.png',
    width: 350,
    height: 520,
  },
  {
    title: 'size the trade',
    copy: 'the slider drags to 14% of buying power, size follows, and the limit price snaps to mid. margin, liquidation and fees all recalculate together.',
    video: '/portfolio/riten/size-ticket.mp4',
    still: '/portfolio/riten/still-ticket.png',
    width: 420,
    height: 480,
  },
  {
    title: 'the chart, across timeframes',
    copy: 'live, 1h, 4h, 12h, 1d. the candles redraw, volume follows, and OHLC restates above them.',
    video: '/portfolio/riten/chart-timeframes.mp4',
    still: '/portfolio/riten/still-chart.png',
    width: 844,
    height: 480,
    span: true,   // squeezed into half a column the candles stop being readable
  },
]

/* The macro widgets come from a 640x296 screen recording of an app that no longer
   runs, so they are pinned to native pixels. Scaling any of them up turns them to mush. */
export const ritenMacro = [
  {
    title: 'institutional interest',
    copy: 'etf net flow, btc against eth, scrubbed by the day. +$72.377b since inception.',
    video: '/portfolio/riten/dash-etf.mp4',
    still: '/portfolio/riten/dash-etf.png',
    width: 400,
    height: 142,
  },
  {
    title: 'the degen read',
    copy: 'fear and greed at 9, extreme fear. the altcoin index at 45. is the room scared, and is this a bitcoin tape?',
    still: '/portfolio/riten/dash-sentiment.png',
    width: 208,
    height: 144,
  },
  {
    title: 'dry powder',
    copy: 'stablecoin market cap, scrubbed back through the week. money entering the system, or leaving it.',
    video: '/portfolio/riten/dash-stablecoin.mp4',
    still: '/portfolio/riten/dash-stablecoin.png',
    width: 170,
    height: 130,
  },
  {
    title: 'the macro factor',
    copy: 'december fomc, broken into a cut, a hold and a hike, priced by the day.',
    video: '/portfolio/riten/dash-fed.mp4',
    still: '/portfolio/riten/dash-fed.png',
    width: 272,
    height: 136,
  },
]
