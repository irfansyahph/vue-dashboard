import { defineStore } from 'pinia'
import axios from 'axios'

interface Berry {
  name: string
  url: string
}

interface BerryDetail {
  id: number
  name: string
  firmness: { name: string }
  flavors: { flavor: { name: string }, potency: number }[]
  natural_gift_power: number
}

interface State {
  berries: Berry[];
  berryDetail: BerryDetail | null;
  next: string | null;
  previous: string | null;
  count: number;
  offset: number;
  limit: number;
  loading: boolean;
  error: string;
}

export const useBerryStore = defineStore('berry', {
  state: (): State => ({
    berries: [],
    berryDetail: null,
    next: null,
    previous: null,
    count: 0,
    offset: 0,
    limit: 10,
    loading: false,
    error: ''
  }),

  actions: {
    async fetchBerries(offset: number, limit: number) {
      this.loading = true;
      this.error = '';
      try {
        const { data } = await axios.get(`https://pokeapi.co/api/v2/berry/?offset=${offset}&limit=${limit}`);
        this.berries = data.results;
        this.next = data.next;
        this.previous = data.previous;
        this.count = data.count;
        this.offset = offset;
      } catch (err) {
        this.error = 'Failed to fetch berries';
      } finally {
        this.loading = false;
      }
    },

    async fetchBerryByName(name: string) {
      this.loading = true;
      this.error = '';
      try {
        const { data } = await axios.get(`https://pokeapi.co/api/v2/berry/${name}`);
        this.berries = [data];
        this.next = null;
        this.previous = null;
        this.count = 1;
        this.offset = 0;
      } catch (err) {
        this.error = 'Berry not found';
        this.berries = [];
      } finally {
        this.loading = false;
      }
    },

    async fetchDetailBerry(url: string) {
      this.loading = true;
      this.error = '';
      try {
        const { data } = await axios.get(url);
        this.berryDetail = data;
      } catch (err) {
        this.error = 'Failed to fetch berry detail';
        this.berryDetail = null;
      } finally {
        this.loading = false;
      }
    }
  }
})
