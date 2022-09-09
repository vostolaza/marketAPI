import mailService from "./mailService";
import { MAX_AUTHCODE_TRIES } from "../utils/constants/mail";

class twoFactorService {
  authCodes: Record<string, [number, number]> = {};
  timers: Record<string, NodeJS.Timeout> = {};

  constructor() {}

  async createCode(
    username: string,
    email: string,
    code: number
  ): Promise<void | any> {
    if (this.authCodes[username]) {
      clearTimeout(this.timers[username]);
    }

    this.authCodes[username] = [code, 0];

    console.log(`created code ${code} for username ${username}`);

    console.log(`Email to: ${email}`);

    try {
      await mailService.sendCode(email, code);
    } catch (error) {
      throw error;
    }

    this.timers[username] = setTimeout(() => {
      if (this.authCodes[username]) {
        delete this.authCodes[username];
      }
      console.log(`deleted code ${code} for username ${username}`);
    }, 120 * 1000); // Código expira en 2 minutos
  }

  verifyAuthCode(username: string, code: number): [boolean, boolean] {
    console.log(`verify ${this.authCodes[username]} == ${code}`);
    const aux = this.authCodes[username];

    // El código no existe o supero el limite de intentos
    if (aux === undefined || aux[1]++ >= MAX_AUTHCODE_TRIES) {
      return [false, true];
    }

    // Borrar el código si hace match
    if (aux[0] == code) {
      delete this.authCodes[username];
      return [true, false];
    }

    // si no hacen match, no borrar el codigo ya que podría intentar nuevamente
    else {
      return [false, false];
    }
  }
}

export default new twoFactorService();
