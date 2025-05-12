import Fastify, { FastifyInstance, FastifyReply } from "fastify";
import db, { getConnection } from "./db";
import { config } from "dotenv";
import { shoppingRoutes } from "./routes/shoppingRoute";
import { getSecrets } from "./secrets";

config();

const IS_LOCAL = require.main === module;

let fastify: FastifyInstance;

declare module "fastify" {
  interface FastifyInstance {
    config: any;
  }
}

async function init(): Promise<FastifyInstance> {
  // ================================
  // ==========  OPTIONS  ===========
  // ================================
  fastify = Fastify({
    logger: true,
  });

  // ================================
  // =========  DECORATORS  =========
  // ================================
  const secrets = await getSecrets(process.env.SECRET_ID as string);
  fastify.decorate("config", secrets);

  // ================================
  // ==========  ROUTES  ============
  // ================================
  fastify.register(db, getConnection(IS_LOCAL));
  fastify.register(shoppingRoutes);

  // ================================
  // ============ HOOKS =============
  // ================================
  fastify.addHook("onRequest", async () => {
    fastify.log.info("Got a request!!!");
  });

  fastify.addHook("preParsing", async (request, reply, payload) => {});

  fastify.addHook("preValidation", async (request, reply) => {});
  fastify.addHook("preHandler", async (request, reply) => {});

  fastify.addHook("preSerialization", async (request, reply, payload) => {
    return {
      data: payload,
      err: "",
      message: "Success!",
    };
  });

  fastify.addHook("onSend", async (request, reply, payload) => {});

  fastify.addHook("onResponse", async (request, reply: FastifyReply) => {
    fastify.log.info("Responding: " + reply.getResponseTime());
  });

  // Useful for custom error logging
  // You should not use this hook to update the error
  fastify.addHook("onError", async (request, reply, error) => {});
  fastify.addHook("onTimeout", async (request, reply) => {});
  fastify.addHook("onRequestAbort", async (request) => {});

  return fastify;
}

["SIGINT", "SIGTERM"].forEach((signal) => {
  process.on(signal, async () => {
    await fastify.close();
    process.exit(0);
  });
});

if (IS_LOCAL) {
  // called directly i.e. "node app"
  init().then((fastify) => {
    fastify.listen(
      { port: process.env.SERVER_PORT as unknown as number },
      (err) => {
        if (err) console.error(err);
        console.log("server listening on 3000");
      }
    );
  });
  // init().listen(
  //   { port: process.env.SERVER_PORT as unknown as number },
  //   (err) => {
  //     if (err) console.error(err);
  //     console.log("server listening on 3000");
  //   }
  // );
} else {
  // required as a module => executed on aws lambda
  module.exports = init;
}

export default init;
