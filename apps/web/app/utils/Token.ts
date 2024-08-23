const TOKEN = {
  ACCESS: "access_token",
};

type TokenDto = {
  accessToken: string;
};

export default class Token {
  static set(token: TokenDto, onSet?: () => void) {
    if (global.window) {
      const cookie = new (require("react-cookie") as any).Cookies();
      cookie.set(TOKEN.ACCESS, token.accessToken, { path: "/" });

      onSet?.();
      return;
    }
    const cookies = require("next/headers").cookies;
    cookies().set(TOKEN.ACCESS, token.accessToken);

    onSet?.();
  }

  static get(): TokenDto {
    if (global.window) {
      const cookie = new (require("react-cookie") as any).Cookies();
      const accessToken = cookie.get(TOKEN.ACCESS);

      return { accessToken };
    }

    const cookies = require("next/headers").cookies;
    const accessToken = cookies().get(TOKEN.ACCESS)?.value || "";

    return { accessToken };
  }

  static clear(onDone?: () => void) {
    if (global.window) {
      const cookie = new (require("react-cookie") as any).Cookies();
      cookie.remove(TOKEN.ACCESS);

      onDone?.();
      return;
    }
    const cookies = require("next/headers").cookies;
    cookies().delete(TOKEN.ACCESS);

    onDone?.();
  }
}
