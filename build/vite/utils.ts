import path from "path";

/**
 * Get user root directory
 * @param dir file path
 */
 function getRootPath(...dir: string[]) {
  return path.resolve(process.cwd(), ...dir);
}

// Read all environment variable configuration files to process.env
 function wrapperEnv(envConf: Recordable): ViteEnv {
  const ret: any = {};

  for (const envName of Object.keys(envConf)) {
    let realName = envConf[envName].replace(/\\n/g, "\n");
    realName = realName === "true" ? true : realName === "false" ? false : realName;
    if (envName === "VITE_PORT") realName = Number(realName);
    ret[envName] = realName;
  }
  return ret;
}


export { getRootPath, wrapperEnv };
