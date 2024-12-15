import { apiSlice } from "./apiSlice";

export const analyzeApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    summarize: builder.mutation({
      query: (data) => ({
        url: "http://localhost:5001/chat",
        method: "POST",
        body: data,
      }),
    }),
    qna: builder.mutation({
      query: (data) => ({
        url: "http://localhost:5001/chat",
        method: "POST",
        body: data,
      }),
    }),
    translate: builder.mutation({
      query: (data) => ({
        url: "http://localhost:5001/translate",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useSummarizeMutation, useQnaMutation, useTranslateMutation } =
  analyzeApiSlice;
