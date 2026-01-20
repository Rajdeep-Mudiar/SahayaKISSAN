import express from "express";
import passport from "passport"
const router = express.Router();

router.get("/google", (req, res, next) => {
  if (req.query.redirect) {
    req.session.redirectTo = req.query.redirect;
  }
  next();
}, passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:5173/auth"
  }),
  (req, res) => {
    console.log("SESSION REDIRECT:", req.session.redirectTo);

    const redirectTo = req.session.redirectTo || "/";
    delete req.session.redirectTo;

    res.redirect(`http://localhost:5173${redirectTo}`);
  }
);



router.get("/me", (req, res) => {
  if (!req.user) {
    return res.status(401).json({ loggedIn: false });
  }

  res.json({
    loggedIn: true,
    user: req.user
  });
});

router.post("/logout", (req, res) => {
  req.logout(() => {
    req.session.destroy();
    res.clearCookie("mini.sid");
    res.json({ message: "Logged out" });
  });
});
router.post("/set-redirect", (req, res) => {
  req.session.redirectTo = req.body.redirectTo;
  res.json({ ok: true });
});

export default router;
