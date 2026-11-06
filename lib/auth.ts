
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { mongoClient } from "@/lib/db";

export const auth = betterAuth({
  database: mongodbAdapter(mongoClient.db("togetherwe"), {
    client: mongoClient,
  }),

  emailAndPassword: {
    enabled: true,
  },
});
