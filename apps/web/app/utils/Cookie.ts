import { Cookies } from "react-cookie";

export default class Cookie {
  static set(key: string, data: unknown) {
    if (global.window) {
      const cookie = new Cookies();
      cookie.set(key, data, { path: "/" });

      return;
    }
    const cookies = require("next/headers").cookies;
    cookies().set(key, data);
  }

  static get(key: string) {
    if (global.window) {
      const cookie = new Cookies();
      return cookie.get(key);
    }
    const cookies = require("next/headers").cookies;
    return cookies().get(key);
  }

  static delete(key: string) {
    if (global.window) {
      const cookie = new Cookies();
      cookie.remove(key, { path: "/" });

      return;
    }
    const cookies = require("next/headers").cookies;
    cookies().delete(key);
  }
}
