import { mount } from "svelte";
import "./app.css";
import App from "./App.svelte";
import { log } from "./lib/logger";

log("Initializing Svelte app");
const app = mount(App, {
   target: document.getElementById("app")!,
});
log("App mounted");

export default app;
