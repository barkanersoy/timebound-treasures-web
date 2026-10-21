export type GuideCoin = {
  id: string;
  name: string;
  region: "British" | "United States";
  metal: string;
  purity: string;
  typicalWeight: string;
  mintage: string;
  keyDates: string;
  collectibility: string;
};

export const GUIDE_COINS: GuideCoin[] = [
  {
    id: "sovereign",
    name: "Gold Sovereign",
    region: "British",
    metal: "Gold",
    purity: "22k / 91.67%",
    typicalWeight: "7.98g (7.32g fine)",
    mintage: "Struck most years since 1817; branch mints add scarcity",
    keyDates: "1917-P, 1920-S, 1922-S, 1937 proof",
    collectibility:
      "Workhorse gold coin with both bullion and date/mint premiums. Young Head Victorian and scarce colonial mints sit well above melt.",
  },
  {
    id: "half-sovereign",
    name: "Half Sovereign",
    region: "British",
    metal: "Gold",
    purity: "22k / 91.67%",
    typicalWeight: "3.99g",
    mintage: "Lower than full sovereigns in many Victorian years",
    keyDates: "1871 shield, 1923-SA, 2012 proof issues",
    collectibility:
      "Popular starter gold piece. Shield-back Victorians and selected South African dates command collector bids.",
  },
  {
    id: "gold-britannia",
    name: "Gold Britannia (1oz)",
    region: "British",
    metal: "Gold",
    purity: "999.9 (modern) / 22k (1987–2012)",
    typicalWeight: "31.10g fine (modern)",
    mintage: "Bullion mintages vary yearly; proofs far lower",
    keyDates: "1987 first year, 2016 change to 999.9, low-mintage proofs",
    collectibility:
      "UK legal-tender bullion with VAT advantages for investors. Proof and early 22k types are the collector angle.",
  },
  {
    id: "silver-britannia",
    name: "Silver Britannia (1oz)",
    region: "British",
    metal: "Silver",
    purity: "958 (early) / 999 (from 2013)",
    typicalWeight: "31.10g",
    mintage: "High bullion output; proofs and privy marks scarcer",
    keyDates: "1997, 2014 Lunar Horse privy, annual proofs",
    collectibility:
      "Accessible bullion with a loyal UK following. Orient privy and early 958 issues bring modest premiums.",
  },
  {
    id: "pre47-shilling",
    name: "Pre-1947 Shilling",
    region: "British",
    metal: "Silver",
    purity: "50% (1920–1946); 92.5% (pre-1920)",
    typicalWeight: "5.66g",
    mintage: "Very large, especially George V / VI",
    keyDates: "1850, 1861, 1905 English/Scottish types",
    collectibility:
      "Melt floor is 50% silver for 1920–46. Victorian and 1905 dates are the numismatic exceptions.",
  },
  {
    id: "pre47-halfcrown",
    name: "Pre-1947 Half Crown",
    region: "British",
    metal: "Silver",
    purity: "50% (1920–1946); 92.5% (pre-1920)",
    typicalWeight: "14.14g",
    mintage: "High in George V, thinner in some Victorian years",
    keyDates: "1905, 1925, 1930",
    collectibility:
      "Heavier pre-47 silver — a favourite scrap lot coin. 1905 remains a true key date.",
  },
  {
    id: "pre47-florin",
    name: "Pre-1947 Florin (2 Shillings)",
    region: "British",
    metal: "Silver",
    purity: "50% (1920–1946); 92.5% (pre-1920)",
    typicalWeight: "11.31g",
    mintage: "Introduced 1849; gothic and jubilee types collected as types",
    keyDates: "1849 ‘Godless’, 1891, 1905",
    collectibility:
      "The 1849 Godless florin is a type-set prize. Later dates mostly track silver unless high grade.",
  },
  {
    id: "gothic-crown",
    name: "Gothic Crown (1847)",
    region: "British",
    metal: "Silver",
    purity: "92.5% sterling",
    typicalWeight: "28.28g",
    mintage: "Proof-only; about 8,000",
    keyDates: "1847 UNDECIMO / inscribed edge",
    collectibility:
      "William Wyon masterpiece. Even impaired examples sit far above sterling melt.",
  },
  {
    id: "kew-50p",
    name: "Kew Gardens 50p (2009)",
    region: "British",
    metal: "Cupro-nickel",
    purity: "None (circulating)",
    typicalWeight: "8.00g",
    mintage: "210,000 — lowest circulating 50p",
    keyDates: "2009 circulating; 2009 silver/gold proofs",
    collectibility:
      "Modern UK key date. Hunt circulated examples; proofs and gold issues are a separate market.",
  },
  {
    id: "1933-penny",
    name: "1933 Penny",
    region: "British",
    metal: "Bronze",
    purity: "None",
    typicalWeight: "9.45g",
    mintage: "A handful of official / pattern pieces",
    keyDates: "1933 only",
    collectibility:
      "Legendary British rarity. Any genuine claim requires museum-grade authentication.",
  },
  {
    id: "morgan",
    name: "Morgan Silver Dollar",
    region: "United States",
    metal: "Silver",
    purity: "90%",
    typicalWeight: "26.73g",
    mintage: "1878–1904, 1921; CC and S mints drive premiums",
    keyDates: "1893-S, 1889-CC, 1895 proof, 1893-O, 1884-S",
    collectibility:
      "Cornerstone US series. Common dates hug 90% silver; Carson City and 1893-S are serious money.",
  },
  {
    id: "peace",
    name: "Peace Silver Dollar",
    region: "United States",
    metal: "Silver",
    purity: "90%",
    typicalWeight: "26.73g",
    mintage: "1921–1928, 1934–1935",
    keyDates: "1921 high relief, 1928, 1934-S",
    collectibility:
      "Art-deco counterpart to the Morgan. 1921 high relief is a type essential; 1928 is the mintage key.",
  },
  {
    id: "silver-eagle",
    name: "American Silver Eagle",
    region: "United States",
    metal: "Silver",
    purity: "99.9%",
    typicalWeight: "31.10g (1oz fine)",
    mintage: "Annual bullion since 1986; 1996 lowest bullion",
    keyDates: "1986 first year, 1996, 2019-S enhanced reverse proof",
    collectibility:
      "Global bullion benchmark. Burnished, proof, and 1996 dates carry collector premiums over spot.",
  },
  {
    id: "gold-eagle",
    name: "American Gold Eagle (1oz)",
    region: "United States",
    metal: "Gold",
    purity: "22k / 91.67%",
    typicalWeight: "33.93g (1oz fine)",
    mintage: "Bullion plus proof/burnished programmes",
    keyDates: "1986 first year, 1999 unsophisticated counterfeit wave (authenticate), low-mintage proofs",
    collectibility:
      "Most recognised US gold bullion coin. Proof and early dates add numismatic spread over melt.",
  },
  {
    id: "walking-liberty",
    name: "Walking Liberty Half Dollar",
    region: "United States",
    metal: "Silver",
    purity: "90%",
    typicalWeight: "12.50g",
    mintage: "1916–1947",
    keyDates: "1921, 1921-D, 1921-S, 1938-D",
    collectibility:
      "Weinman’s design later inspired the Silver Eagle. Common 1940s dates are melt-plus; 1921s are keys.",
  },
  {
    id: "saint-gaudens",
    name: "Saint-Gaudens Double Eagle ($20)",
    region: "United States",
    metal: "Gold",
    purity: "90%",
    typicalWeight: "33.44g",
    mintage: "1907–1933",
    keyDates: "1907 high relief, 1920-S, 1921, 1933 (national treasure / illegal to most holders)",
    collectibility:
      "America’s most beautiful gold coin. Common Saints trade as gold; 1933 is essentially uncollectible.",
  },
];
