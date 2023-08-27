import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

console.log('test', `${process.env}`);

export const playersApi = createApi({
  reducerPath: 'playersApi',
  baseQuery: fetchBaseQuery({
    baseUrl:
      process.env.NODE_ENV === 'development'
        ? process.env.REACT_APP_DEV_MODE_API
        : process.env.REACT_APP_PRO_MODE,
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
      query: (teams) => ({
        url: '/teams',
        method: 'POST',
        body: teams,
      }),
      invalidatesTags: ['teams'],
    }),
  }),
});

export const {
  useFetchPlayersQuery,
  useLazyFetchPlayersQuery,
  useSoldPlayerMutation,
  useFetchTeamsQuery,
  useCreateTeamsMutation,
} = playersApi;
