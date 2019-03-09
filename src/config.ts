import runtimeEnv from "@mars/heroku-js-runtime-env";

const env = runtimeEnv();

export const apiUrl = env.REACT_APP_API_URL;
