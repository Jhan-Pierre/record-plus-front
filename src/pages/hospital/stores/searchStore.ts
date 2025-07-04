import { type SortConfig, SortDirection } from '@/types/sorting';
import type { SortDescriptor } from '@heroui/react';
import { create } from 'zustand';
import { SEARCH_PARAMS } from '../constants/searchParams';
import type { HospitalRequestParams } from '../types/HospitalRequestParams';

interface SearchState {
  // Estado
  searchTerm: string;
  sortConfig: SortConfig;
  selectedState: number | null;
  searchFields: string[];
  filters: HospitalRequestParams;
  sortDescriptor: SortDescriptor;

  // Acciones
  setSortDescriptor: (descriptor: SortDescriptor) => void;
  setSearchTerm: (searchTerm: string) => void;
  setSortConfig: (config: SortConfig) => void;
  setSelectedState: (stateId: number | null) => void;
  setSearchFields: (fields: string[]) => void;
  setFilters: (filters: HospitalRequestParams) => void;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;

  // Utilidades
  buildSearchParams: () => HospitalRequestParams;
}

export const useSearchStore = create<SearchState>((set, get) => ({
  // Estado inicial
  searchTerm: '',
  sortConfig: { field: 'updatedAt', direction: SortDirection.DESC },
  selectedState: null,
  searchFields: [SEARCH_PARAMS[0].id],
  filters: { page: 0, size: 20 },
  sortDescriptor: {
    column: 'updatedAt',
    direction: 'descending',
  },

  // Acciones
  setSearchTerm: (term) =>
    set({
      searchTerm: term,
      filters: { ...get().filters, page: 0 },
    }),

  setSortConfig: (config) =>
    set({
      sortConfig: config,
      sortDescriptor: {
        column: config.field,
        direction: config.direction === SortDirection.ASC ? 'ascending' : 'descending',
      },
    }),

  setSelectedState: (stateId) =>
    set((state) => ({
      selectedState: stateId,
      filters: {
        ...state.filters,
        stateId: stateId ?? undefined,
      },
    })),

  setSearchFields: (fields) => set({ searchFields: fields }),

  setFilters: (filters) => set({ filters }),

  setPage: (page) => set({ filters: { ...get().filters, page: page - 1 } }),

  setPageSize: (size) => set({ filters: { ...get().filters, size } }),

  setSortDescriptor: (descriptor) => {
    set({
      sortDescriptor: descriptor,
      sortConfig: {
        field: descriptor.column as string,
        direction: descriptor.direction === 'ascending' ? SortDirection.ASC : SortDirection.DESC,
      },
    });
  },

  // Utilidades
  // Función para construir los parámetros de búsqueda
  buildSearchParams: () => {
    const state = get();
    const params: HospitalRequestParams = {
      ...state.filters,
      sort: `${state.sortConfig.field},${state.sortConfig.direction}`,
    };

    if (state.searchTerm) {
      for (const field of state.searchFields) {
        if (SEARCH_PARAMS.some((param) => param.id === field)) {
          if (field === 'id') {
            const numericId = Number.parseInt(state.searchTerm);
            if (!Number.isNaN(numericId)) {
              params.id = numericId;
            }
          } else if (field === 'ruc' || field === 'name') {
            params[field] = state.searchTerm;
          }
        }
      }
    }

    return params;
  },
}));
