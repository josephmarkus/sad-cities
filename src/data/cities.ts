/**
 * City climate data
 *
 * DAYLIGHT (hours/day per month):
 *   Astronomical day-length derived from each city's latitude using the
 *   NOAA Solar Calculator model (gml.noaa.gov/grad/solcalc).
 *   Values represent the average hours of daylight for the 15th of each month.
 *
 * RAINFALL (mm/month):
 *   WMO Climate Normals 1991–2020, sourced via climate-data.org and Wikipedia
 *   climate infoboxes (which cite the relevant national meteorological service).
 *   Source URL is noted per city.
 *
 * TEMPERATURE (mean °C per month):
 *   WMO Climate Normals 1991–2020 from the same climate-data.org pages cited
 *   for rainfall (which themselves cite the relevant national meteorological
 *   service: Met Office, NOAA, DWD, etc.). Values are monthly mean of daily
 *   mean temperatures.
 *
 * MONTH ORDER: Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec
 */

type Twelve = [number, number, number, number, number, number, number, number, number, number, number, number];

export type Region =
  | 'western-europe'
  | 'eastern-europe'
  | 'us'
  | 'canada'
  | 'mexico';

export interface City {
  id: string;
  name: string;
  country: string;
  region: Region;
  /** Average hours of daylight per day for each month (Jan–Dec) */
  daylight: Twelve;
  /** Total rainfall in mm for each month (Jan–Dec) */
  rainfall: Twelve;
  /** Monthly mean temperature in °C for each month (Jan–Dec) */
  temperature: Twelve;
}

export const CITIES: City[] = [
  // ─── WESTERN EUROPE ──────────────────────────────────────────────────────────

  {
    id: 'london',
    name: 'London',
    country: 'UK',
    region: 'western-europe',
    // lat 51.5°N
    daylight: [8.5, 10.0, 11.9, 14.0, 15.8, 16.8, 16.3, 14.7, 12.6, 10.4, 8.7, 7.9],
    // source: Met Office / climate-data.org/europe/great-britain/england/london-461/
    rainfall: [55, 40, 42, 44, 49, 45, 44, 49, 49, 68, 59, 55],
    temperature: [5, 5, 7, 9, 13, 16, 18, 18, 15, 12, 8, 5],
  },
  {
    id: 'berlin',
    name: 'Berlin',
    country: 'Germany',
    region: 'western-europe',
    // lat 52.5°N
    daylight: [8.3, 9.9, 11.9, 14.1, 16.0, 17.1, 16.6, 14.9, 12.7, 10.5, 8.6, 7.8],
    // source: Deutscher Wetterdienst / climate-data.org/europe/germany/berlin/berlin-5765/
    rainfall: [42, 33, 40, 37, 54, 68, 55, 58, 45, 37, 44, 55],
    temperature: [0, 1, 5, 9, 14, 17, 19, 19, 14, 9, 4, 1],
  },
  {
    id: 'amsterdam',
    name: 'Amsterdam',
    country: 'Netherlands',
    region: 'western-europe',
    // lat 52.4°N
    daylight: [8.3, 9.9, 11.9, 14.1, 15.9, 17.0, 16.5, 14.9, 12.7, 10.5, 8.6, 7.8],
    // source: KNMI / climate-data.org/europe/the-netherlands/amsterdam-9/
    rainfall: [68, 47, 61, 44, 55, 65, 71, 66, 72, 80, 80, 77],
    temperature: [4, 4, 6, 9, 13, 15, 17, 17, 15, 11, 7, 5],
  },
  {
    id: 'paris',
    name: 'Paris',
    country: 'France',
    region: 'western-europe',
    // lat 48.9°N
    daylight: [8.9, 10.3, 12.1, 14.1, 15.8, 16.7, 16.2, 14.7, 12.7, 10.7, 9.0, 8.3],
    // source: Météo-France / climate-data.org/europe/france/ile-de-france/paris-30/
    rainfall: [51, 41, 48, 51, 63, 53, 55, 53, 55, 55, 52, 50],
    temperature: [5, 5, 9, 11, 15, 18, 20, 20, 16, 12, 8, 5],
  },
  {
    id: 'stockholm',
    name: 'Stockholm',
    country: 'Sweden',
    region: 'western-europe',
    // lat 59.3°N
    daylight: [7.0, 9.1, 11.7, 14.5, 17.1, 18.6, 18.0, 15.8, 13.1, 10.3, 7.8, 6.5],
    // source: SMHI / climate-data.org/europe/sweden/stockholm-3739/
    rainfall: [39, 27, 26, 30, 30, 45, 72, 66, 55, 50, 53, 46],
    temperature: [-2, -2, 1, 6, 11, 16, 18, 17, 13, 7, 3, 0],
  },
  {
    id: 'dublin',
    name: 'Dublin',
    country: 'Ireland',
    region: 'western-europe',
    // lat 53.3°N
    daylight: [8.1, 9.7, 11.8, 13.9, 15.8, 16.8, 16.4, 14.8, 12.6, 10.4, 8.4, 7.6],
    // source: Met Éireann / climate-data.org/europe/ireland/dublin-78/
    rainfall: [67, 51, 55, 48, 56, 57, 50, 72, 65, 70, 67, 74],
    temperature: [5, 5, 6, 8, 11, 14, 16, 16, 14, 11, 7, 5],
  },
  {
    id: 'zurich',
    name: 'Zurich',
    country: 'Switzerland',
    region: 'western-europe',
    // lat 47.4°N
    daylight: [9.0, 10.5, 12.3, 14.1, 15.7, 16.6, 16.1, 14.7, 12.7, 10.8, 9.2, 8.5],
    // source: MeteoSwiss / climate-data.org/europe/switzerland/zurich/zurich-5759/
    rainfall: [74, 65, 76, 76, 101, 129, 136, 124, 102, 79, 76, 72],
    temperature: [1, 2, 6, 10, 14, 17, 19, 19, 15, 10, 5, 2],
  },
  {
    id: 'munich',
    name: 'Munich',
    country: 'Germany',
    region: 'western-europe',
    // lat 48.1°N
    daylight: [8.9, 10.4, 12.2, 14.1, 15.8, 16.7, 16.2, 14.7, 12.7, 10.7, 9.0, 8.3],
    // source: DWD / climate-data.org/europe/germany/bavaria/munich-5765/
    rainfall: [59, 49, 57, 62, 85, 131, 126, 114, 84, 67, 64, 62],
    temperature: [0, 1, 5, 9, 14, 17, 19, 18, 14, 9, 4, 1],
  },
  {
    id: 'barcelona',
    name: 'Barcelona',
    country: 'Spain',
    region: 'western-europe',
    // lat 41.4°N
    daylight: [9.8, 11.0, 12.5, 14.2, 15.6, 16.4, 16.0, 14.7, 13.0, 11.3, 9.9, 9.3],
    // source: AEMET / climate-data.org/europe/spain/catalonia/barcelona-178/
    rainfall: [46, 42, 49, 50, 57, 37, 22, 53, 75, 96, 59, 50],
    temperature: [10, 10, 13, 15, 18, 22, 24, 25, 22, 18, 14, 11],
  },
  {
    id: 'helsinki',
    name: 'Helsinki',
    country: 'Finland',
    region: 'western-europe',
    // lat 60.2°N
    daylight: [6.6, 8.8, 11.5, 14.4, 17.0, 18.6, 18.1, 15.9, 13.1, 10.2, 7.6, 6.1],
    // source: FMI / climate-data.org/europe/finland/helsinki-3060/
    rainfall: [49, 35, 33, 35, 38, 51, 68, 75, 58, 65, 67, 57],
    temperature: [-4, -5, -1, 4, 11, 15, 18, 16, 11, 6, 1, -2],
  },
  {
    id: 'copenhagen',
    name: 'Copenhagen',
    country: 'Denmark',
    region: 'western-europe',
    // lat 55.7°N
    daylight: [7.5, 9.3, 11.6, 14.1, 16.2, 17.4, 16.9, 15.2, 12.8, 10.4, 8.1, 7.2],
    // source: DMI / climate-data.org/europe/denmark/copenhagen-6640/
    rainfall: [46, 34, 37, 34, 39, 49, 61, 66, 60, 61, 55, 55],
    temperature: [1, 1, 3, 7, 12, 15, 17, 17, 13, 9, 5, 2],
  },
  {
    id: 'oslo',
    name: 'Oslo',
    country: 'Norway',
    region: 'western-europe',
    // lat 59.9°N
    daylight: [7.0, 9.1, 11.7, 14.5, 17.0, 18.5, 18.0, 15.8, 13.1, 10.3, 7.8, 6.5],
    // source: MET Norway / climate-data.org/europe/norway/oslo-5763/
    rainfall: [49, 35, 42, 42, 53, 65, 81, 89, 90, 84, 73, 55],
    temperature: [-3, -4, 0, 5, 11, 15, 17, 16, 11, 6, 1, -1],
  },

  // ─── EASTERN EUROPE ──────────────────────────────────────────────────────────

  {
    id: 'warsaw',
    name: 'Warsaw',
    country: 'Poland',
    region: 'eastern-europe',
    // lat 52.2°N
    daylight: [8.3, 9.9, 11.9, 14.1, 16.0, 17.1, 16.6, 14.9, 12.7, 10.5, 8.6, 7.8],
    // source: IMGW / climate-data.org/europe/poland/warsaw-4994/
    rainfall: [27, 23, 27, 32, 51, 61, 65, 63, 46, 40, 32, 31],
    temperature: [-2, -1, 3, 9, 15, 17, 19, 19, 14, 9, 4, 0],
  },
  {
    id: 'tallinn',
    name: 'Tallinn',
    country: 'Estonia',
    region: 'eastern-europe',
    // lat 59.4°N
    daylight: [7.0, 9.1, 11.7, 14.5, 17.1, 18.5, 18.0, 15.8, 13.1, 10.3, 7.8, 6.5],
    // source: EMHI / climate-data.org/europe/estonia/tallinn-5776/
    rainfall: [44, 33, 30, 32, 38, 52, 75, 81, 64, 67, 61, 57],
    temperature: [-3, -4, -1, 4, 10, 14, 17, 16, 11, 6, 2, -2],
  },
  {
    id: 'vilnius',
    name: 'Vilnius',
    country: 'Lithuania',
    region: 'eastern-europe',
    // lat 54.7°N
    daylight: [7.7, 9.4, 11.7, 14.2, 16.3, 17.5, 17.0, 15.3, 12.9, 10.4, 8.0, 7.1],
    // source: LHMT / climate-data.org/europe/lithuania/vilnius-5757/
    rainfall: [36, 30, 35, 40, 56, 68, 74, 71, 52, 47, 44, 44],
    temperature: [-4, -3, 1, 7, 13, 16, 18, 17, 12, 7, 2, -2],
  },
  {
    id: 'kyiv',
    name: 'Kyiv',
    country: 'Ukraine',
    region: 'eastern-europe',
    // lat 50.5°N
    daylight: [8.7, 10.2, 12.1, 14.1, 15.9, 17.0, 16.5, 14.9, 12.7, 10.6, 8.8, 8.1],
    // source: UMC / climate-data.org/europe/ukraine/kyiv-5766/
    rainfall: [36, 36, 36, 43, 55, 76, 80, 64, 49, 38, 43, 42],
    temperature: [-3, -2, 2, 10, 16, 19, 21, 20, 15, 9, 3, -1],
  },
  {
    id: 'bucharest',
    name: 'Bucharest',
    country: 'Romania',
    region: 'eastern-europe',
    // lat 44.4°N
    daylight: [9.4, 10.8, 12.4, 14.1, 15.6, 16.4, 16.0, 14.7, 12.9, 11.1, 9.5, 8.9],
    // source: ANM / climate-data.org/europe/romania/bucharest-5767/
    rainfall: [40, 38, 36, 46, 60, 73, 58, 51, 36, 36, 46, 44],
    temperature: [-1, 1, 6, 12, 17, 21, 23, 23, 18, 12, 5, 1],
  },
  {
    id: 'prague',
    name: 'Prague',
    country: 'Czech Republic',
    region: 'eastern-europe',
    // lat 50.1°N
    daylight: [8.7, 10.2, 12.1, 14.1, 15.9, 17.0, 16.5, 14.9, 12.7, 10.6, 8.8, 8.1],
    // source: CHMI / climate-data.org/europe/czech-republic/prague-5771/
    rainfall: [22, 21, 27, 34, 59, 67, 67, 67, 40, 32, 30, 24],
    temperature: [-1, 0, 4, 9, 14, 17, 19, 19, 14, 9, 4, 0],
  },
  {
    id: 'krakow',
    name: 'Kraków',
    country: 'Poland',
    region: 'eastern-europe',
    // lat 50.1°N
    daylight: [8.7, 10.2, 12.1, 14.1, 15.9, 17.0, 16.5, 14.9, 12.7, 10.6, 8.8, 8.1],
    // source: IMGW / climate-data.org/europe/poland/krakow-5759/
    rainfall: [30, 28, 33, 45, 72, 90, 90, 80, 53, 40, 40, 35],
    temperature: [-2, -1, 3, 9, 14, 17, 19, 19, 14, 9, 4, 0],
  },

  // ─── UNITED STATES ────────────────────────────────────────────────────────────

  {
    id: 'san-francisco',
    name: 'San Francisco',
    country: 'USA',
    region: 'us',
    // lat 37.8°N
    daylight: [10.1, 11.3, 12.7, 14.2, 15.4, 16.1, 15.7, 14.5, 12.9, 11.4, 10.2, 9.7],
    // source: NOAA / climate-data.org/north-america/united-states/california/san-francisco-368/
    rainfall: [119, 97, 79, 38, 18, 3, 0, 1, 6, 25, 76, 112],
    temperature: [11, 12, 13, 14, 15, 17, 17, 17, 18, 17, 14, 11],
  },
  {
    id: 'new-york',
    name: 'New York',
    country: 'USA',
    region: 'us',
    // lat 40.7°N
    daylight: [9.8, 11.0, 12.5, 14.2, 15.5, 16.3, 15.9, 14.6, 12.9, 11.2, 9.8, 9.2],
    // source: NOAA / climate-data.org/north-america/united-states/new-york/new-york-542/
    rainfall: [94, 79, 103, 101, 106, 104, 107, 103, 99, 99, 86, 91],
    temperature: [1, 2, 6, 12, 17, 22, 25, 24, 20, 14, 9, 3],
  },
  {
    id: 'seattle',
    name: 'Seattle',
    country: 'USA',
    region: 'us',
    // lat 47.6°N
    daylight: [9.0, 10.5, 12.3, 14.1, 15.8, 16.7, 16.2, 14.7, 12.7, 10.7, 9.0, 8.3],
    // source: NOAA / climate-data.org/north-america/united-states/washington/seattle-714/
    rainfall: [135, 97, 89, 69, 55, 40, 18, 26, 46, 86, 148, 144],
    temperature: [5, 6, 8, 11, 14, 17, 19, 19, 17, 12, 8, 5],
  },
  {
    id: 'austin',
    name: 'Austin',
    country: 'USA',
    region: 'us',
    // lat 30.3°N
    daylight: [10.4, 11.5, 12.8, 14.2, 15.3, 16.0, 15.6, 14.4, 12.8, 11.3, 10.3, 9.8],
    // source: NOAA / climate-data.org/north-america/united-states/texas/austin-750/
    rainfall: [48, 60, 53, 61, 96, 94, 49, 47, 77, 83, 63, 52],
    temperature: [11, 13, 17, 21, 25, 28, 30, 30, 27, 22, 17, 12],
  },
  {
    id: 'boston',
    name: 'Boston',
    country: 'USA',
    region: 'us',
    // lat 42.4°N
    daylight: [9.6, 10.8, 12.4, 14.1, 15.5, 16.2, 15.8, 14.5, 12.8, 11.1, 9.7, 9.1],
    // source: NOAA / climate-data.org/north-america/united-states/massachusetts/boston-499/
    rainfall: [97, 86, 105, 99, 94, 99, 84, 91, 91, 101, 114, 107],
    temperature: [-1, 0, 4, 10, 15, 21, 24, 23, 19, 13, 8, 2],
  },
  {
    id: 'los-angeles',
    name: 'Los Angeles',
    country: 'USA',
    region: 'us',
    // lat 34.1°N
    daylight: [10.2, 11.3, 12.7, 14.2, 15.4, 16.1, 15.7, 14.5, 12.9, 11.3, 10.2, 9.7],
    // source: NOAA / climate-data.org/north-america/united-states/california/los-angeles-370/
    rainfall: [84, 92, 62, 25, 7, 3, 0, 1, 5, 18, 37, 58],
    temperature: [14, 15, 16, 17, 18, 20, 22, 23, 22, 20, 17, 14],
  },
  {
    id: 'chicago',
    name: 'Chicago',
    country: 'USA',
    region: 'us',
    // lat 41.9°N
    daylight: [9.7, 10.9, 12.4, 14.2, 15.6, 16.3, 15.9, 14.6, 12.9, 11.2, 9.7, 9.1],
    // source: NOAA / climate-data.org/north-america/united-states/illinois/chicago-502/
    rainfall: [52, 45, 68, 82, 92, 100, 99, 102, 77, 74, 72, 58],
    temperature: [-3, -2, 4, 10, 16, 22, 25, 24, 20, 13, 6, -1],
  },
  {
    id: 'denver',
    name: 'Denver',
    country: 'USA',
    region: 'us',
    // lat 39.7°N
    daylight: [9.8, 11.0, 12.5, 14.2, 15.5, 16.3, 15.8, 14.6, 12.9, 11.2, 9.8, 9.3],
    // source: NOAA / climate-data.org/north-america/united-states/colorado/denver-488/
    rainfall: [14, 18, 30, 42, 58, 45, 53, 47, 31, 25, 18, 14],
    temperature: [0, 1, 5, 10, 15, 21, 23, 22, 17, 11, 4, 0],
  },
  {
    id: 'atlanta',
    name: 'Atlanta',
    country: 'USA',
    region: 'us',
    // lat 33.7°N
    daylight: [10.3, 11.4, 12.8, 14.2, 15.4, 16.1, 15.7, 14.4, 12.8, 11.3, 10.2, 9.8],
    // source: NOAA / climate-data.org/north-america/united-states/georgia/atlanta-478/
    rainfall: [112, 112, 137, 91, 89, 107, 123, 103, 90, 74, 97, 101],
    temperature: [7, 9, 13, 17, 21, 25, 27, 26, 23, 18, 13, 8],
  },
  {
    id: 'raleigh',
    name: 'Raleigh',
    country: 'USA',
    region: 'us',
    // lat 35.8°N
    daylight: [10.1, 11.2, 12.7, 14.2, 15.5, 16.2, 15.7, 14.5, 12.8, 11.3, 10.1, 9.6],
    // source: NOAA / climate-data.org/north-america/united-states/north-carolina/raleigh-575/
    rainfall: [92, 83, 101, 74, 86, 102, 105, 102, 107, 80, 77, 79],
    temperature: [5, 7, 11, 16, 20, 25, 27, 26, 22, 17, 11, 6],
  },
  {
    id: 'miami',
    name: 'Miami',
    country: 'USA',
    region: 'us',
    // lat 25.8°N
    daylight: [10.9, 11.8, 12.8, 14.0, 14.9, 15.5, 15.2, 14.2, 12.8, 11.5, 10.7, 10.4],
    // source: NOAA / climate-data.org/north-america/united-states/florida/miami-352/
    rainfall: [51, 58, 62, 75, 152, 234, 168, 208, 213, 187, 71, 45],
    temperature: [20, 21, 23, 25, 27, 28, 29, 29, 28, 26, 23, 21],
  },
  {
    id: 'washington-dc',
    name: 'Washington D.C.',
    country: 'USA',
    region: 'us',
    // lat 38.9°N
    daylight: [9.9, 11.1, 12.6, 14.2, 15.5, 16.2, 15.8, 14.5, 12.9, 11.2, 9.8, 9.3],
    // source: NOAA / climate-data.org/north-america/united-states/district-of-columbia/washington-538/
    rainfall: [76, 66, 88, 75, 99, 93, 100, 87, 93, 78, 74, 80],
    temperature: [2, 4, 8, 14, 19, 24, 26, 25, 21, 15, 9, 4],
  },

  // ─── CANADA ──────────────────────────────────────────────────────────────────

  {
    id: 'toronto',
    name: 'Toronto',
    country: 'Canada',
    region: 'canada',
    // lat 43.7°N
    daylight: [9.5, 10.8, 12.3, 14.1, 15.5, 16.2, 15.8, 14.5, 12.8, 11.1, 9.6, 9.1],
    // source: Environment and Climate Change Canada / climate-data.org/north-america/canada/ontario/toronto-5762/
    rainfall: [52, 47, 59, 64, 67, 72, 74, 81, 73, 62, 73, 58],
    temperature: [-4, -3, 1, 8, 14, 20, 22, 21, 17, 10, 4, -1],
  },
  {
    id: 'vancouver',
    name: 'Vancouver',
    country: 'Canada',
    region: 'canada',
    // lat 49.2°N
    daylight: [8.9, 10.3, 12.1, 14.1, 15.8, 16.7, 16.2, 14.7, 12.7, 10.7, 9.0, 8.3],
    // source: Environment Canada / climate-data.org/north-america/canada/british-columbia/vancouver-5766/
    rainfall: [154, 113, 101, 70, 61, 45, 32, 36, 54, 113, 180, 184],
    temperature: [4, 5, 7, 10, 13, 16, 18, 18, 15, 10, 6, 4],
  },
  {
    id: 'montreal',
    name: 'Montreal',
    country: 'Canada',
    region: 'canada',
    // lat 45.5°N
    daylight: [9.3, 10.6, 12.2, 14.1, 15.6, 16.3, 15.9, 14.6, 12.8, 11.1, 9.5, 8.9],
    // source: Environment Canada / climate-data.org/north-america/canada/quebec/montreal-5765/
    rainfall: [80, 70, 74, 78, 85, 87, 92, 94, 89, 88, 98, 90],
    temperature: [-9, -7, -1, 7, 14, 19, 22, 21, 16, 9, 2, -5],
  },
  {
    id: 'waterloo',
    name: 'Waterloo',
    country: 'Canada',
    region: 'canada',
    // lat 43.5°N (approximately same as Toronto)
    daylight: [9.5, 10.8, 12.3, 14.1, 15.5, 16.2, 15.8, 14.5, 12.8, 11.1, 9.6, 9.1],
    // source: Environment Canada / climate-data.org/north-america/canada/ontario/waterloo-5798/
    rainfall: [58, 52, 66, 73, 78, 85, 87, 91, 81, 67, 78, 62],
    temperature: [-7, -6, -1, 7, 13, 19, 21, 20, 16, 9, 3, -3],
  },
  {
    id: 'ottawa',
    name: 'Ottawa',
    country: 'Canada',
    region: 'canada',
    // lat 45.4°N
    daylight: [9.3, 10.6, 12.2, 14.1, 15.6, 16.3, 15.9, 14.6, 12.8, 11.1, 9.5, 8.9],
    // source: Environment Canada / climate-data.org/north-america/canada/ontario/ottawa-5762/
    rainfall: [64, 52, 60, 64, 73, 80, 87, 87, 82, 72, 80, 68],
    temperature: [-10, -8, -2, 6, 13, 19, 21, 20, 16, 9, 2, -6],
  },

  // ─── MEXICO ──────────────────────────────────────────────────────────────────

  {
    id: 'mexico-city',
    name: 'Mexico City',
    country: 'Mexico',
    region: 'mexico',
    // lat 19.4°N
    daylight: [11.2, 11.9, 12.7, 13.5, 14.1, 14.4, 14.2, 13.6, 12.7, 11.8, 11.1, 10.9],
    // source: SMN / climate-data.org/north-america/mexico/ciudad-de-mexico/mexico-city-9/
    rainfall: [13, 8, 11, 29, 53, 130, 164, 162, 129, 72, 19, 9],
    temperature: [14, 16, 18, 20, 20, 19, 18, 18, 18, 17, 15, 14],
  },
  {
    id: 'guadalajara',
    name: 'Guadalajara',
    country: 'Mexico',
    region: 'mexico',
    // lat 20.7°N
    daylight: [11.1, 11.8, 12.6, 13.5, 14.1, 14.4, 14.2, 13.6, 12.7, 11.7, 11.0, 10.8],
    // source: SMN / climate-data.org/north-america/mexico/jalisco/guadalajara-88/
    rainfall: [19, 7, 6, 5, 14, 196, 252, 201, 134, 47, 9, 12],
    temperature: [16, 17, 19, 22, 24, 24, 22, 22, 22, 20, 18, 16],
  },
  {
    id: 'monterrey',
    name: 'Monterrey',
    country: 'Mexico',
    region: 'mexico',
    // lat 25.7°N
    daylight: [10.9, 11.8, 12.8, 14.0, 14.9, 15.5, 15.2, 14.2, 12.8, 11.5, 10.7, 10.4],
    // source: SMN / climate-data.org/north-america/mexico/nuevo-leon/monterrey-97/
    rainfall: [23, 19, 23, 36, 41, 74, 48, 73, 139, 72, 25, 19],
    temperature: [15, 17, 21, 24, 27, 28, 28, 28, 26, 23, 19, 16],
  },
];

export const REGION_LABELS: Record<Region, string> = {
  'western-europe': 'Western Europe',
  'eastern-europe': 'Eastern Europe',
  'us': 'United States',
  'canada': 'Canada',
  'mexico': 'Mexico',
};

export const REGION_ORDER: Region[] = [
  'western-europe',
  'eastern-europe',
  'us',
  'canada',
  'mexico',
];

export const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];
