import { tool } from "ai";
import z from "zod";

export const getWether = tool({
  title: "GetWeather",
  description: "Get the weather of a city",
  inputSchema: z.object({
    city: z.string().meta({
      description:
        "The name of the city you want to get the weather from(ie: Malage)",
    }),
  }),
  execute: ({ city }) => {
    return `The weather in the ${city} is sunny.`;
  },
});

export const getLocation = tool({
  title: "getLocation",
  description: "Use this to get rhe user location",
  inputSchema: z.object({}),
});
