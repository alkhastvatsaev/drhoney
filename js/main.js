import { initI18n } from "./i18n.js";
import { applyStripeLinks } from "./stripe.js";
import { initBackgroundVideo } from "./video.js";

applyStripeLinks();
initI18n();
initBackgroundVideo(document.getElementById("bg-video"));
