import { Router } from "express";
import { AppError } from "../../lib/error.js";
import { PaperModel } from "./paper.model.js";

export const paperRouter: Router = Router();

/** Minimal search endpoint — keyword over title+abstract. Phase 1. */
paperRouter.get("/", async (req, res) => {
  const q = (req.query.q as string | undefined)?.trim();
  const page = Math.max(1, Number(req.query.page) || 1);
  const pageSize = Math.min(50, Math.max(1, Number(req.query.pageSize) || 20));

  const filter = q ? { $text: { $search: q } } : {};
  const [papers, total] = await Promise.all([
    PaperModel.find(filter)
      .sort({ publicationYear: -1, citationCount: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .lean(),
    PaperModel.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: papers,
    meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
  });
});

paperRouter.get("/:id", async (req, res) => {
  const paper = await PaperModel.findById(req.params.id).lean();
  if (!paper) throw AppError.notFound("Paper not found");
  res.json({ success: true, data: paper });
});
