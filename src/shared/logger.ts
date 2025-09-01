import pino from "pino";
import pinoHttp from "pino-http";

const isProd = process.env.NODE_ENV === "production";

export const logger = pino({
  level: process.env.LOG_LEVEL || (isProd ? "info" : "debug")
});

export const httpLogger = pinoHttp({
  logger,
  serializers: {
    req(req) {
      return { method: req.method, url: req.url, params: req.params, query: req.query, ip: req.ip };
    },
    res(res) {
      return { statusCode: res.statusCode };
    },
  },
});