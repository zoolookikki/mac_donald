import { City } from '../models/city';
import { Poi } from '../models/poi';
import { NominatimSearchResult } from '../models/nominatim-search-result';

export const city1: City = {
  id: 1,
  name: 'CityOne',
  lat: 1.2345,
  lon: 2.3456,
  boundingbox: ['1.23', '1.24', '2.34', '2.35'],
};

export const city2: City = {
  id: 2,
  name: 'CityTwo',
  lat: 21.2345,
  lon: 22.3456,
  boundingbox: ['21.23', '21.24', '22.34', '22.35'],
};

export const cityInvalid: City = {
  id: 999,
  name: '',
  lat: 0,
  lon: 0,
  boundingbox: [],
};

export const cityWithoutBoundingbox: City = {
  id: 3,
  name: 'CityWithoutBoundingbox',
  lat: 1.2345,
  lon: 2.3456,
  boundingbox: [],
};

export const poi1: Poi = {
  id: 1,
  name: "Adresse McDonald's 1 City1",
  lat: 1,
  lon: 2,
  address: "Adresse McDonald's 1 City1",
};

export const poi2: Poi = {
  id: 2,
  name: "Adresse McDonald's 2 City1",
  lat: 21,
  lon: 22,
  address: "Adresse McDonald's 2 City1",
};

export const nominatimSearchResults: NominatimSearchResult[] = [
  {
    place_id: city1.id,
    display_name: city1.name,
    lat: String(city1.lat),
    lon: String(city1.lon),
    boundingbox: city1.boundingbox,
  },
  {
    place_id: city2.id,
    display_name: city2.name,
    lat: String(city2.lat),
    lon: String(city2.lon),
    boundingbox: city2.boundingbox,
  },
];

export const nominatimPoiResults: NominatimSearchResult[] = [
  {
    place_id: poi1.id,
    display_name: poi1.address,
    lat: String(poi1.lat),
    lon: String(poi1.lon),
    boundingbox: [''],
  },
  {
    place_id: poi2.id,
    display_name: poi2.address,
    lat: String(poi2.lat),
    lon: String(poi2.lon),
    boundingbox: [''],
  },
];

export const searchCitiesResult: City[] = [city1, city2];
export const nearbyPoiCity1Result: Poi[] = [poi1, poi2];
