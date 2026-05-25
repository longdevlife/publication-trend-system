import type { Request, Response } from "express";
import type { LoginInput, RefreshInput, RegisterInput } from "./auth.schema.js";
import { authService } from "./auth.service.js";

export const authController = {
  async register(req: Request<unknown, unknown, RegisterInput>, res: Response) {
    const result = await authService.register(req.body);
    res.status(201).json({ success: true, data: result });
  },

  async login(req: Request<unknown, unknown, LoginInput>, res: Response) {
    const result = await authService.login(req.body);
    res.json({ success: true, data: result });
  },

  async refresh(req: Request<unknown, unknown, RefreshInput>, res: Response) {
    const tokens = await authService.refresh(req.body.refreshToken);
    res.json({ success: true, data: tokens });
  },

  async logout(req: Request<unknown, unknown, RefreshInput>, res: Response) {
    await authService.logout(req.body.refreshToken);
    res.json({ success: true, data: { ok: true } });
  },

  async me(req: Request, res: Response) {
    res.json({ success: true, data: { user: req.user } });
  },
};
