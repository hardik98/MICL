import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const playersApi = createApi({
  reducerPath: 'playersApi',
  baseQuery: fetchBaseQuery({
    baseUrl:
      process.env.NODE_ENV === 'development'
        ? process.env.REACT_APP_DEV_MODE_API
        : 'https://my-json-server.typicode.com/hardik98/backend_micl',
  }),
  endpoints: (builder) => ({
    fetchPlayers: builder.query({
      query: () => 'players',
      providesTags: ['players'],
    }),
    fetchTeams: builder.query({
      query: () => 'teams',
      providesTags: ['teams'],
    }),
    soldPlayer: builder.mutation({
      query: ({ id, updatedPlayer }) => ({
        url: `players/${id}`,
        method: 'PUT',
        body: updatedPlayer,
      }),
      invalidatesTags: ['players'],
    }),
    createTeams: builder.mutation({
      query: (newTeam) => ({
        url: '/teams',
        method: 'POST',
        body: newTeam,
      }),

      invalidatesTags: ['teams'],
    }),
    addSoldPlayer: builder.mutation({
      query: ({ id, updatedTeam }) => ({
        url: `teams/${id}`,
        method: 'PUT',
        body: updatedTeam,
      }),
      invalidatesTags: ['teams', 'players'],
    }),
  }),
});

export const {
  useFetchPlayersQuery,
  useLazyFetchPlayersQuery,
  useSoldPlayerMutation,
  useAddSoldPlayerMutation,
  useFetchTeamsQuery,
  useLazyFetchTeamsQuery,
  useCreateTeamsMutation,
} = playersApi;
