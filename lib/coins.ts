export type GuideCoin = {
  id: string;
  name: string;
  metalPurity: string;
  typicalWeight: string;
  mintage: string;
  keyDates: string;
  collectibility: string;
};

export const GUIDE_COINS: GuideCoin[] = [
  {
    id: "sovereign",
    name: "Gold Sovereign",
    metalPurity: "British Gold 22k / 91.67%",
    typicalWeight: "7.98g (7.32g fine)",
    mintage: "Struck most years since 1817; branch mints add scarcity",
    keyDates: "1917-P, 1920-S, 1922-S, 1937 proof",
    collectibility:
      "Workhorse gold coin with both bullion and date/mint premiums. Young Head Victorian and scarce colonial mints sit well above melt.",
  },
  {
    id: "half-sovereign",
    name: "Half Sovereign",
    metalPurity: "British Gold 22k / 91.67%",
    typicalWeight: "3.99g",
    mintage: "Lower than full sovereigns in many Victorian years",
    keyDates: "1871 shield, 1923-SA, 2012 proof issues",
    collectibility:
      "Popular starter gold piece. Shield-back Victorians and selected South African dates command collector bids.",
  },
  {
    id: "gold-britannia",
    name: "Gold Britannia (1oz)",
    metalPurity: "British Gold 999.9 (modern) / 22k (1987–2012)",
    typicalWeight: "31.10g fine (modern)",
    mintage: "Bullion mintages vary yearly; proofs far lower",
    keyDates: "1987 first year, 2016 change to 999.9, low-mintage proofs",
    collectibility:
      "UK legal-tender bullion with VAT advantages for investors. Proof and early 22k types are the collector angle.",
  },
  {
    id: "silver-britannia",
    name: "Silver Britannia (1oz)",
    metalPurity: "British Silver 958 (early) / 999 (from 2013)",
    typicalWeight: "31.10g",
    mintage: "High bullion output; proofs and privy marks scarcer",
    keyDates: "1997, 2014 Lunar Horse privy, annual proofs",
    collectibility:
      "Accessible bullion with a loyal UK following. Orient privy and early 958 issues bring modest premiums.",
  },
  {
    id: "krugerrand",
    name: "Krugerrand (1oz)",
    metalPurity: "South Africa Gold 22k / 91.67%",
    typicalWeight: "33.93g (31.10g fine)",
    mintage: "High bullion output since 1967",
    keyDates: "1967, 1992, 2017 (50th Anniversary)",
    collectibility:
      "The original modern gold bullion coin. Primarily trades at spot plus a small premium.",
  },
  {
    id: "maple-gold",
    name: "Canadian Gold Maple Leaf (1oz)",
    metalPurity: "Canada Gold 99.99% (99.9% pre-1982)",
    typicalWeight: "31.10g fine",
    mintage: "High bullion output since 1979",
    keyDates: "1979, 1982 (first .9999 issue)",
    collectibility:
      "Global standard for high-purity gold bullion. Minor premiums for early dates and special privy marks.",
  },
  {
    id: "maple-silver",
    name: "Canadian Silver Maple Leaf (1oz)",
    metalPurity: "Canada Silver 99.99%",
    typicalWeight: "31.10g fine",
    mintage: "High bullion output since 1988",
    keyDates: "1996, 1997",
    collectibility:
      "Highly liquid silver bullion. Early low-mintage years carry slight collector premiums.",
  },
  {
    id: "libertad",
    name: "Mexican Silver Libertad (1oz)",
    metalPurity: "Mexico Silver 99.9%",
    typicalWeight: "31.10g fine",
    mintage: "Consistently lower than US/Canadian counterparts",
    keyDates: "1998, 1999, 2007",
    collectibility:
      "Carries high collector premiums over spot due to low annual mintages and strong global demand.",
  },
  {
    id: "philharmonic-silver",
    name: "Austrian Philharmonic (1oz)",
    metalPurity: "Austria Silver 99.9%",
    typicalWeight: "31.10g fine",
    mintage: "High bullion output since 2008",
    keyDates: "2008 (first year)",
    collectibility:
      "Europe’s leading silver bullion coin. Trades closely to spot with minimal numismatic upside.",
  },
  {
    id: "french-20f",
    name: "20 Francs (Rooster/Marianne)",
    metalPurity: "French Gold 90%",
    typicalWeight: "6.45g (5.80g fine)",
    mintage: "Millions struck (1898–1914)",
    keyDates: "1904, 1905",
    collectibility:
      "Classic European fractional gold. Trades primarily on metal content with very modest historical premiums.",
  },
  {
    id: "pre47-shilling",
    name: "Pre-1947 Shilling",
    metalPurity: "British Silver 50% (1920–1946); 92.5% (pre-1920)",
    typicalWeight: "5.66g",
    mintage: "Very large, especially George V / VI",
    keyDates: "1850, 1861, 1905 English/Scottish types",
    collectibility:
      "Melt floor is 50% silver for 1920–46. Victorian and 1905 dates are the numismatic exceptions.",
  },
  {
    id: "pre47-sixpence",
    name: "Pre-1947 Sixpence",
    metalPurity: "British Silver 50% (1920–1946); 92.5% (pre-1920)",
    typicalWeight: "2.83g",
    mintage: "Very large across Victoria, Edward VII, George V/VI",
    keyDates: "1893 (Jubilee), 1905",
    collectibility:
      "Common scrap silver staple. Pre-1920 and Victorian issues carry distinct numismatic value over melt.",
  },
  {
    id: "pre47-halfcrown",
    name: "Pre-1947 Half Crown",
    metalPurity: "British Silver 50% (1920–1946); 92.5% (pre-1920)",
    typicalWeight: "14.14g",
    mintage: "High in George V, thinner in some Victorian years",
    keyDates: "1905, 1925, 1930",
    collectibility:
      "Heavier pre-47 silver — a favourite scrap lot coin. 1905 remains a true key date.",
  },
  {
    id: "pre47-florin",
    name: "Pre-1947 Florin (2 Shillings)",
    metalPurity: "British Silver 50% (1920–1946); 92.5% (pre-1920)",
    typicalWeight: "11.31g",
    mintage: "Introduced 1849; gothic and jubilee types collected as types",
    keyDates: "1849 ‘Godless’, 1891, 1905",
    collectibility:
      "The 1849 Godless florin is a type-set prize. Later dates mostly track silver unless high grade.",
  },
  {
    id: "gothic-crown",
    name: "Gothic Crown (1847)",
    metalPurity: "British Silver 92.5% sterling",
    typicalWeight: "28.28g",
    mintage: "Proof-only; about 8,000",
    keyDates: "1847 UNDECIMO / inscribed edge",
    collectibility:
      "William Wyon masterpiece. Even impaired examples sit far above sterling melt.",
  },
  {
    id: "kew-50p",
    name: "Kew Gardens 50p (2009)",
    metalPurity: "British Cupro-nickel — none (circulating)",
    typicalWeight: "8.00g",
    mintage: "210,000 — lowest circulating 50p",
    keyDates: "2009 circulating; 2009 silver/gold proofs",
    collectibility:
      "Modern UK key date. Hunt circulated examples; proofs and gold issues are a separate market.",
  },
  {
    id: "1933-penny",
    name: "1933 Penny",
    metalPurity: "British Bronze — none",
    typicalWeight: "9.45g",
    mintage: "A handful of official / pattern pieces",
    keyDates: "1933 only",
    collectibility:
      "Legendary British rarity. Any genuine claim requires museum-grade authentication.",
  },
  {
    id: "morgan",
    name: "Morgan Silver Dollar",
    metalPurity: "United States Silver 90%",
    typicalWeight: "26.73g",
    mintage: "1878–1904, 1921; CC and S mints drive premiums",
    keyDates: "1893-S, 1889-CC, 1895 proof, 1893-O, 1884-S",
    collectibility:
      "Cornerstone US series. Common dates hug 90% silver; Carson City and 1893-S are serious money.",
  },
  {
    id: "peace",
    name: "Peace Silver Dollar",
    metalPurity: "United States Silver 90%",
    typicalWeight: "26.73g",
    mintage: "1921–1928, 1934–1935",
    keyDates: "1921 high relief, 1928, 1934-S",
    collectibility:
      "Art-deco counterpart to the Morgan. 1921 high relief is a type essential; 1928 is the mintage key.",
  },
  {
    id: "silver-eagle",
    name: "American Silver Eagle",
    metalPurity: "United States Silver 99.9%",
    typicalWeight: "31.10g (1oz fine)",
    mintage: "Annual bullion since 1986; 1996 lowest bullion",
    keyDates: "1986 first year, 1996, 2019-S enhanced reverse proof",
    collectibility:
      "Global bullion benchmark. Burnished, proof, and 1996 dates carry collector premiums over spot.",
  },
  {
    id: "gold-eagle",
    name: "American Gold Eagle (1oz)",
    metalPurity: "United States Gold 22k / 91.67%",
    typicalWeight: "33.93g (1oz fine)",
    mintage: "Bullion plus proof/burnished programmes",
    keyDates: "1986 first year, 1999 unsophisticated counterfeit wave (authenticate), low-mintage proofs",
    collectibility:
      "Most recognised US gold bullion coin. Proof and early dates add numismatic spread over melt.",
  },
  {
    id: "walking-liberty",
    name: "Walking Liberty Half Dollar",
    metalPurity: "United States Silver 90%",
    typicalWeight: "12.50g",
    mintage: "1916–1947",
    keyDates: "1921, 1921-D, 1921-S, 1938-D",
    collectibility:
      "Weinman’s design later inspired the Silver Eagle. Common 1940s dates are melt-plus; 1921s are keys.",
  },
  {
    id: "franklin-half",
    name: "Franklin Half Dollar",
    metalPurity: "United States Silver 90%",
    typicalWeight: "12.50g",
    mintage: "1948–1963",
    keyDates: "1949-D, 1952-S, 1955",
    collectibility:
      'A short, popular series. Valued mostly for silver content, but "Full Bell Lines" (FBL) strikes demand high premiums.',
  },
  {
    id: "mercury-dime",
    name: "Mercury Dime",
    metalPurity: "United States Silver 90%",
    typicalWeight: "2.50g",
    mintage: "1916–1945",
    keyDates: "1916-D, 1921, 1921-D, 1942/41 overdate",
    collectibility:
      "Iconic US silver fractional coin. The 1916-D is a major key date; most others trade strictly as 90% junk silver.",
  },
  {
    id: "washington-quarter",
    name: "Washington Quarter (Pre-1965)",
    metalPurity: "United States Silver 90%",
    typicalWeight: "6.25g",
    mintage: "1932–1964",
    keyDates: "1932-D, 1932-S",
    collectibility:
      "The core of US junk silver hoards. Only the 1932 mint marks and pristine uncirculated examples carry significant premiums.",
  },
  {
    id: "saint-gaudens",
    name: "Saint-Gaudens Double Eagle ($20)",
    metalPurity: "United States Gold 90%",
    typicalWeight: "33.44g",
    mintage: "1907–1933",
    keyDates: "1907 high relief, 1920-S, 1921, 1933 (national treasure / illegal to most holders)",
    collectibility:
      "America’s most beautiful gold coin. Common Saints trade as gold; 1933 is essentially uncollectible.",
  },
  {
    id: "pre47-threepence",
    name: "Pre-1947 Threepence",
    metalPurity: "British Silver 50% (1920–46) / 92.5% (Pre-1920)",
    typicalWeight: "1.41g",
    mintage: "Millions",
    keyDates: "1927 Proof, 1945",
    collectibility:
      "Tiny fractional silver. Pre-1920s and early Victorians carry modest premiums.",
  },
  {
    id: "pre47-crown",
    name: "Pre-1947 Crown",
    metalPurity: "British Silver 50% (1920–46) / 92.5% (Pre-1920)",
    typicalWeight: "28.28g",
    mintage: "Varies",
    keyDates: "1927–1936 Wreath Crowns",
    collectibility:
      "Heavy silver standard. Wreath crowns carry massive numismatic premiums.",
  },
  {
    id: "double-florin",
    name: "Double Florin (4 Shillings)",
    metalPurity: "British Silver 92.5%",
    typicalWeight: "22.62g",
    mintage: "1887–1890 only",
    keyDates: "1887 Arabic 1",
    collectibility:
      "Short-lived Victorian oddity. High collector interest across all dates.",
  },
  {
    id: "gold-guinea",
    name: "Gold Guinea",
    metalPurity: "British Gold 22k / 91.67%",
    typicalWeight: "8.35g",
    mintage: "1663–1814",
    keyDates: "1714, Spade Guineas (1787–1799)",
    collectibility:
      "Predecessor to the Sovereign. Trades heavily on numismatic value and condition.",
  },
  {
    id: "queens-beasts-2oz",
    name: "Queen's Beasts (2oz)",
    metalPurity: "British Silver 99.99%",
    typicalWeight: "62.20g",
    mintage: "2016–2021",
    keyDates: "2016 Lion, 2017 Griffin",
    collectibility:
      "Heavy 2oz bullion format. Complete sets command significant premiums over melt.",
  },
  {
    id: "queens-beasts-1oz-gold",
    name: "Queen's Beasts (1oz)",
    metalPurity: "British Gold 99.99%",
    typicalWeight: "31.10g fine",
    mintage: "2016–2021",
    keyDates: "2016 Lion",
    collectibility:
      "24k gold alternative to the Britannia with strong series-collector demand.",
  },
  {
    id: "tudor-beasts-2oz",
    name: "Tudor Beasts (2oz)",
    metalPurity: "British Silver 99.99%",
    typicalWeight: "62.20g",
    mintage: "2022–Present",
    keyDates: "2022 Lion of England",
    collectibility: "Successor to Queen's Beasts. High liquidity and moderate premium.",
  },
  {
    id: "uk-lunar-1oz",
    name: "UK Lunar Series (1oz)",
    metalPurity: "British Silver 99.9%",
    typicalWeight: "31.10g fine",
    mintage: "2014–2025",
    keyDates: "2014 Year of the Horse",
    collectibility:
      "UK take on the Lunar calendar. First years in the cycle command the highest premiums.",
  },
  {
    id: "maundy-money",
    name: "Maundy Money (4, 3, 2, 1d)",
    metalPurity: "British Silver 92.5%",
    typicalWeight: "Varies (Sets)",
    mintage: "Very Low (Distributed by Monarch)",
    keyDates: "Complete original year sets",
    collectibility:
      "Highly collectible royal tradition pieces. Almost always sold as intact sets far above melt.",
  },
  {
    id: "barber-dime",
    name: "Barber Dime",
    metalPurity: "United States Silver 90%",
    typicalWeight: "2.50g",
    mintage: "1892–1916",
    keyDates: "1894-S, 1895-O",
    collectibility:
      "Classic US junk silver. Heavily worn, but key dates in good condition are highly prized.",
  },
  {
    id: "barber-quarter",
    name: "Barber Quarter",
    metalPurity: "United States Silver 90%",
    typicalWeight: "6.25g",
    mintage: "1892–1916",
    keyDates: "1896-S, 1901-S, 1913-S",
    collectibility:
      "Better condition pieces trade as numismatics; culls go strictly into 90% melt bags.",
  },
  {
    id: "barber-half",
    name: "Barber Half Dollar",
    metalPurity: "United States Silver 90%",
    typicalWeight: "12.50g",
    mintage: "1892–1915",
    keyDates: "1892-O, 1914",
    collectibility:
      "Heavy 90% fractional. Most circulated copies track silver spot closely.",
  },
  {
    id: "seated-liberty-dollar",
    name: "Seated Liberty Dollar",
    metalPurity: "United States Silver 90%",
    typicalWeight: "26.73g",
    mintage: "1840–1873",
    keyDates: "1851, 1852, 1870-S",
    collectibility:
      "Scarce compared to Morgans. Almost always trades as a numismatic item, not bullion.",
  },
  {
    id: "seated-liberty-half",
    name: "Seated Liberty Half",
    metalPurity: "United States Silver 90%",
    typicalWeight: "12.44g",
    mintage: "1839–1891",
    keyDates: "1878-S, 1879–1890",
    collectibility:
      "Extensive mid-19th century series. Better grades hold strong collector premiums.",
  },
  {
    id: "kennedy-half-1964",
    name: "Kennedy Half (1964)",
    metalPurity: "United States Silver 90%",
    typicalWeight: "12.50g",
    mintage: "400M+",
    keyDates: "1964 Heavily accented hair",
    collectibility:
      "Single-year 90% issue for circulation. Extremely common in melt bags.",
  },
  {
    id: "kennedy-half-40",
    name: "Kennedy Half (40%)",
    metalPurity: "United States Silver 40%",
    typicalWeight: "11.50g",
    mintage: "1965–1970",
    keyDates: "1970-D",
    collectibility:
      "The last circulating US silver. Trades at a distinct discount to 90% due to refining costs.",
  },
  {
    id: "eisenhower-40",
    name: "Eisenhower Dollar (40%)",
    metalPurity: "United States Silver 40%",
    typicalWeight: "24.59g",
    mintage: "1971–1976 (San Francisco only)",
    keyDates: "1973-S",
    collectibility:
      '"Brown Ikes" and "Blue Ikes". Often traded in original mint packaging.',
  },
  {
    id: "jefferson-wartime-nickel",
    name: "Jefferson Wartime Nickel",
    metalPurity: "United States Silver 35%",
    typicalWeight: "5.00g",
    mintage: "1942–1945",
    keyDates: "1943-D, 1950-D (Non-silver key)",
    collectibility:
      "Large mint mark above Monticello. Requires bulk to have meaningful silver value.",
  },
  {
    id: "roosevelt-dime-pre65",
    name: "Roosevelt Dime (Pre-1965)",
    metalPurity: "United States Silver 90%",
    typicalWeight: "2.50g",
    mintage: "1946–1964",
    keyDates: "1949-S, 1955-S",
    collectibility:
      "Ultimate fractional junk silver. Trades entirely on weight multiplier with zero collector premium.",
  },
  {
    id: "gold-buffalo",
    name: "Gold Buffalo (1oz)",
    metalPurity: "United States Gold 99.99% (24k)",
    typicalWeight: "31.10g fine",
    mintage: "2006–Present",
    keyDates: "2006 (First year), 2008 fractional",
    collectibility:
      "The US Mint's 24k answer to the Maple Leaf. Very popular domestic bullion.",
  },
  {
    id: "platinum-eagle",
    name: "American Platinum Eagle",
    metalPurity: "United States Platinum 99.95%",
    typicalWeight: "31.10g fine",
    mintage: "1997–Present",
    keyDates: "1997, 2008 fractional",
    collectibility: "The dominant platinum bullion coin globally.",
  },
  {
    id: "indian-quarter-eagle",
    name: "Indian Head Quarter Eagle",
    metalPurity: "United States Gold 90%",
    typicalWeight: "4.18g",
    mintage: "1908–1929",
    keyDates: "1911-D",
    collectibility:
      "Unique incuse (sunken) design. Popular type coin with strong collector premiums.",
  },
  {
    id: "indian-half-eagle",
    name: "Indian Head Half Eagle",
    metalPurity: "United States Gold 90%",
    typicalWeight: "8.36g",
    mintage: "1908–1929",
    keyDates: "1909-O, 1929",
    collectibility:
      "Larger incuse design. Rare in high uncirculated grades due to the striking method.",
  },
  {
    id: "indian-eagle",
    name: "Indian Head Eagle ($10)",
    metalPurity: "United States Gold 90%",
    typicalWeight: "16.72g",
    mintage: "1907–1933",
    keyDates: "1907 Wire Rim, 1933",
    collectibility:
      "Augustus Saint-Gaudens design. Consistently trades with numismatic premiums.",
  },
  {
    id: "liberty-double-eagle",
    name: "Liberty Head Double Eagle",
    metalPurity: "United States Gold 90%",
    typicalWeight: "33.44g",
    mintage: "1850–1907",
    keyDates: "1854-O, 1856-O, 1870-CC",
    collectibility:
      "Massive gold coin of the Wild West era. Lower grades trade near spot, CC mints are prized.",
  },
  {
    id: "liberty-eagle",
    name: "Liberty Head Eagle ($10)",
    metalPurity: "United States Gold 90%",
    typicalWeight: "16.72g",
    mintage: "1838–1907",
    keyDates: "1858, 1875",
    collectibility: "Workhorse gold of the 19th century US economy.",
  },
  {
    id: "liberty-half-eagle",
    name: "Liberty Head Half Eagle",
    metalPurity: "United States Gold 90%",
    typicalWeight: "8.36g",
    mintage: "1839–1908",
    keyDates: "1875, 1908",
    collectibility: "The only US coin minted at all seven US branch mints.",
  },
  {
    id: "aussie-silver-kangaroo",
    name: "Australian Silver Kangaroo",
    metalPurity: "Australia Silver 99.99%",
    typicalWeight: "31.10g fine",
    mintage: "2015–Present",
    keyDates: "2015",
    collectibility:
      "High volume pure silver bullion competing directly with the Silver Eagle and Maple Leaf.",
  },
  {
    id: "aussie-silver-kookaburra",
    name: "Australian Silver Kookaburra",
    metalPurity: "Australia Silver 99.9% / 99.99%",
    typicalWeight: "31.10g fine",
    mintage: "1990–Present",
    keyDates: "1990, 2008",
    collectibility:
      "Annual design changes make this a premier bullion-collector crossover series.",
  },
  {
    id: "aussie-silver-koala",
    name: "Australian Silver Koala",
    metalPurity: "Australia Silver 99.9% / 99.99%",
    typicalWeight: "31.10g fine",
    mintage: "2007–Present",
    keyDates: "2007",
    collectibility: "Annual changing designs. Lower mintages than Kangaroos.",
  },
  {
    id: "aussie-gold-kangaroo",
    name: "Australian Gold Kangaroo",
    metalPurity: "Australia Gold 99.99%",
    typicalWeight: "31.10g fine",
    mintage: "1987–Present (Originally 'Nugget')",
    keyDates: "1987, 1989",
    collectibility:
      "Beautiful 24k gold bullion with yearly changing wildlife designs.",
  },
  {
    id: "chinese-silver-panda",
    name: "Chinese Silver Panda",
    metalPurity: "China Silver 99.9%",
    typicalWeight: "30g (Post-2015) / 1oz (Pre-2016)",
    mintage: "1983–Present",
    keyDates: "Early 1980s",
    collectibility:
      "Switched to metric 30g in 2016. High counterfeiting risk; requires careful authentication.",
  },
  {
    id: "chinese-gold-panda",
    name: "Chinese Gold Panda",
    metalPurity: "China Gold 99.9%",
    typicalWeight: "30g (Post-2015) / 1oz (Pre-2016)",
    mintage: "1982–Present",
    keyDates: "1982",
    collectibility:
      "Metric system shift in 2016. Yearly designs create strong global collector markets.",
  },
  {
    id: "silver-krugerrand",
    name: "South African Silver Krugerrand",
    metalPurity: "South Africa Silver 99.9%",
    typicalWeight: "31.10g fine",
    mintage: "2017–Present",
    keyDates: "2017",
    collectibility:
      "Late entry to silver bullion. Immediately became a high-liquidity staple.",
  },
  {
    id: "gold-philharmonic",
    name: "Austrian Gold Philharmonic",
    metalPurity: "Austria Gold 99.99%",
    typicalWeight: "31.10g fine",
    mintage: "1989–Present",
    keyDates: "1989",
    collectibility:
      "The most popular 24k gold bullion coin in Europe. Large diameter, very thin.",
  },
  {
    id: "gold-libertad",
    name: "Mexican Gold Libertad",
    metalPurity: "Mexico Gold 99.9%",
    typicalWeight: "31.10g fine",
    mintage: "1981–Present; extremely low annual mintages",
    keyDates: "Low-mintage years vary",
    collectibility:
      "Beautiful design, incredibly scarce compared to US/Canadian gold. High premiums.",
  },
  {
    id: "palladium-maple",
    name: "Canadian Palladium Maple",
    metalPurity: "Canada Palladium 99.95%",
    typicalWeight: "31.10g fine",
    mintage: "2005–Present (Intermittent)",
    keyDates: "2005",
    collectibility:
      "The most recognizable government-issued palladium bullion coin.",
  },
  {
    id: "platinum-maple",
    name: "Canadian Platinum Maple",
    metalPurity: "Canada Platinum 99.95%",
    typicalWeight: "31.10g fine",
    mintage: "1988–Present",
    keyDates: "Early fractional sizes",
    collectibility: "Highly liquid platinum bullion option.",
  },
  {
    id: "swiss-vreneli",
    name: "Swiss 20 Francs (Vreneli)",
    metalPurity: "Swiss Gold 90%",
    typicalWeight: "6.45g (5.80g fine)",
    mintage: "1897–1936, 1947, 1949",
    keyDates: "1926",
    collectibility:
      "Legendary European fractional gold. Acts as a highly liquid gold tracking asset.",
  },
  {
    id: "mexican-50-pesos",
    name: "Mexican 50 Pesos (Centenario)",
    metalPurity: "Mexico Gold 90%",
    typicalWeight: "41.66g (37.50g fine)",
    mintage: "1921–1947",
    keyDates: "1921, 1931",
    collectibility:
      "Massive gold coin (1.2 troy oz fine gold). Huge presence and popular as a store of wealth.",
  },
  {
    id: "german-20-marks",
    name: "German 20 Marks (Prussia)",
    metalPurity: "German Gold 90%",
    typicalWeight: "7.96g (7.16g fine)",
    mintage: "1871–1915",
    keyDates: "Wilhelm I issues",
    collectibility:
      "Standard gold coin of the German Empire. Trades near gold spot value.",
  },
  {
    id: "dutch-10-gulden",
    name: "Dutch 10 Gulden",
    metalPurity: "Netherlands Gold 90%",
    typicalWeight: "6.72g (6.04g fine)",
    mintage: "1897–1933",
    keyDates: "1898",
    collectibility:
      "Features Queen Wilhelmina. Popular European fractional gold unit.",
  },
  {
    id: "italian-20-lire",
    name: "Italian 20 Lire (Marengo)",
    metalPurity: "Italian Gold 90%",
    typicalWeight: "6.45g (5.80g fine)",
    mintage: "1861–1923",
    keyDates: "Papal States issues",
    collectibility:
      "Member of the Latin Monetary Union standard. Highly liquid in Europe.",
  },
  {
    id: "russian-5-roubles",
    name: "Russian 5 Roubles",
    metalPurity: "Russian Gold 90%",
    typicalWeight: "4.30g (3.87g fine)",
    mintage: "1897–1911",
    keyDates: "1906, 1907",
    collectibility:
      "Features Nicholas II, the last Tsar. Modest historical premium over fractional gold melt.",
  },
  {
    id: "maria-theresa-thaler",
    name: "Maria Theresa Thaler",
    metalPurity: "Austria Silver 83.3%",
    typicalWeight: "28.06g",
    mintage: "1780 (Restruck in the millions)",
    keyDates: "Original 1780s strikes",
    collectibility:
      "One of the most minted silver coins ever; used heavily in Levantine and African trade. Trades at melt.",
  },
  {
    id: "canadian-80-dollar",
    name: "Canadian 80% Silver Dollar",
    metalPurity: "Canada Silver 80%",
    typicalWeight: "23.33g",
    mintage: "1935–1967",
    keyDates: "1948",
    collectibility:
      'Famous "Voyageur" design. Core piece of Canadian silver stacking.',
  },
  {
    id: "canadian-80-half",
    name: "Canadian 80% Half Dollar",
    metalPurity: "Canada Silver 80%",
    typicalWeight: "11.66g",
    mintage: "1920–1967",
    keyDates: "1932",
    collectibility:
      "High-volume North American junk silver. Trades purely on weight.",
  },
  {
    id: "french-50-francs-hercules",
    name: "French 50 Francs (Hercules)",
    metalPurity: "French Silver 90%",
    typicalWeight: "30.00g",
    mintage: "1974–1980",
    keyDates: "1974, 1980",
    collectibility:
      "Extremely popular large-format European silver stacking coin.",
  },
  {
    id: "spanish-8-reales",
    name: "Spanish 8 Reales",
    metalPurity: "Spain/Colonies Silver 90.3%",
    typicalWeight: "27.06g",
    mintage: "16th–19th Century",
    keyDates: "Mint-dependent",
    collectibility:
      'The original "Piece of Eight". Hugely historically significant; trades purely as numismatic.',
  },
  {
    id: "armenian-noahs-ark",
    name: "Armenian Noah's Ark",
    metalPurity: "Armenia Silver 99.9%",
    typicalWeight: "31.10g fine",
    mintage: "2011–Present",
    keyDates: "2011",
    collectibility:
      "Minted in Germany. Fast-growing, highly recognizable European bullion.",
  },
  {
    id: "somalian-elephant",
    name: "Somalian Elephant",
    metalPurity: "Somalia Silver 99.99%",
    typicalWeight: "31.10g fine",
    mintage: "2004–Present",
    keyDates: "2004–2008",
    collectibility:
      "Bavarian State Mint product. Yearly changing wildlife design commands collector premiums.",
  },
];
