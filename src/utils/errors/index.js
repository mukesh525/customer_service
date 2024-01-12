const Sentry = require("@sentry/node");
const _ = require("@sentry/tracing");
const {
  NotFoundError,
  ValidationError,
  AuthorizeError,
} = require("./app-errors");

Sentry.init({
  dsn: "https://2f137c4977fdfc1c2e4ad5dd12d86721@o4506553963773952.ingest.sentry.io/4506553965608960",
  tracesSampleRate: 1.0,
});

module.exports = (app) => {
  app.use((error, req, res, next) => {
    let reportError = true;

    // skip common / known errors
    [NotFoundError, ValidationError, AuthorizeError].forEach((typeOfError) => {
      if (error instanceof typeOfError) {
        reportError = false;
      }
    });

    if (reportError) {
      Sentry.captureException(error);
    }
    const statusCode = error.statusCode || 500;
    const data = error.data || error.message;
    return res.status(statusCode).json(data);
  });
};
