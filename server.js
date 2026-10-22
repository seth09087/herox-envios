const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const AGENCIES_API = "https://api.shalom-api.lat/public/agencies/search";

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/agencies", async (req, res) => {
  try {
    const department = String(req.query.department || "").trim();
    const q = String(req.query.q || "").trim();

    if (!department) {
      return res.status(400).json({ error: "Selecciona un departamento." });
    }

    const params = new URLSearchParams();
    const apiDepartment = department
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toUpperCase();
    params.set("departamento", apiDepartment);
    if (q) params.set("q", q);
    params.set("per_page", "100");

    const upstream = await fetch(`${AGENCIES_API}?${params.toString()}`, {
      headers: { "Accept": "application/json" },
      signal: AbortSignal.timeout(12000)
    });

    if (!upstream.ok) {
      return res.status(502).json({
        error: "El catálogo de agencias no respondió correctamente.",
        upstreamStatus: upstream.status
      });
    }

    const payload = await upstream.json();
    const agencies = Array.isArray(payload) ? payload : (payload.data || payload.items || payload.agencies || []);

    // Normalize department names to avoid accent/case differences.
    const normalize = (s) => String(s || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toUpperCase()
      .trim();

    const wantedDepartment = normalize(department);
    const filtered = agencies.filter((agency) => {
      const actualDepartment = normalize(agency.departamento || agency.departamento_nombre || "");
      return actualDepartment && actualDepartment === wantedDepartment;
    });

    res.set("Cache-Control", "public, max-age=300");
    return res.json({ data: filtered, total: filtered.length });
  } catch (error) {
    console.error("Agency lookup failed:", error.message);
    return res.status(502).json({
      error: "No se pudo consultar el catálogo externo. Inténtalo nuevamente."
    });
  }
});

app.get("/health", (_req, res) => res.json({ ok: true }));

app.listen(PORT, "0.0.0.0", () => {
  console.log(`HEROX server listening on port ${PORT}`);
});
