# SAD Cities

Compare daylight hours, rainfall, and temperature through the year for tech
hubs across North America and Europe. Pick any combination of cities and
metric, and see them side by side — either as absolute values, or as each
city's deviation from its own yearly mean (which makes seasonal amplitude
directly comparable, e.g. how harsh winters are in Helsinki vs Barcelona).

Climate data is from WMO Climate Normals 1991–2020 (Met Office, NOAA,
Environment Canada, etc., via climate-data.org); daylight is derived from
each city's latitude using the NOAA Solar Calculator model.

## Running locally

```bash
npm install
npm run dev
```

Built with React, TypeScript, Vite, and Recharts.
