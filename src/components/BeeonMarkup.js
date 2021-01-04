import { encode } from "he";

import escapeRegex from "escape-string-regexp";
// function escapeRegex(string) {
//   return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
// }

export const TwitchConfig = {
  class: "twitchEmote",
  size: 1,
  version: "1"
};

export const DefaultConfig = {
  // Vue
  el: "span", // the element to wrap rendered sequences in (Vue)

  // Tags
  startTag: "{", // the opening sequence for tags
  endTag: "}", // the closing sequence for tags
  escape: "{", // what should be escaped if it's in a regular text run
  escapeAs: "{}", // what to escape (replace) it with

  // Twitch
  twitch: TwitchConfig // twitch configuration
};

/** Install markup rendering methods in a Handlebars instance */
export function registerHandlebarsHelpers(handlebars) {
  handlebars.registerHelper("twitchEmote", (id, options) => {
    let size = options.size ?? 1; // 1, 2, 3
    let version = options.version ?? "1"; // always 1
    let class_ = options.class ?? "";
    let html = `<img src="https://static-cdn.jtvnw.net/emoticons/v${version}/${id}/${size}.0" class="${class_}">`;
    return html;
  });
}

/** Convert a Twitch message with optional emotes to a markup message */
export function fromTwitchMessage(msg, config) {
  config = { ...DefaultConfig, ...config };
  let escapeRawRegex = new RegExp(escapeRegex(config.escape), "g");
  let message = msg.message;
  if (msg.emotes != null && msg.emotes.length) {
    let runs = msg.emotes
      .split("/")
      .map((x) => x.split(":"))
      .map((emote) => {
        let [from, to] = emote[1].split("-").map((x) => parseInt(x, 10));
        return { from, to, id: emote[0] };
      });

    let o = 0;
    let runs2 = runs.flatMap((e) => {
      let oo = o;
      o = e.to + 1;
      return [{ from: oo, to: e.from }, e];
    });
    runs2.push({ from: o, to: message.length + 1 });

    message = runs2
      .map((e) => {
        return e.id !== undefined
          ? `${config.startTag}twitchEmote ${e.id}${config.endTag}`
          : message
              .substr(e.from, e.to - e.from)
              .replace(escapeRawRegex, config.escapeAs);
      })
      .join("");
  }
  return message;
}

/** Convert markup to an HTML string */
export function toHTML(text, config) {
  config = { ...DefaultConfig, ...config };
  return parse(text, config)
    .map((e) => {
      if (typeof e === "string") return encode(e);
      else {
        if (e.tag === "twitchEmote") {
          return `<img class="${config.twitch.class}" src="https://static-cdn.jtvnw.net/emoticons/v${config.twitch.version}/${e.args}/${config.twitch.size}.0">`;
        } else {
          return `?`;
        }
      }
    })
    .join("");
}

/** Convert markup to a Handlebars template */
export function toHandlebarsTemplate(text, config) {
  config = { ...DefaultConfig, ...config };
  return parse(text, config)
    .map((e) => {
      if (typeof e === "string") return encode(e.replace(/\{\{/g, "\\{{"));
      else {
        if (e.tag === "twitchEmote") {
          return `{{{twitchEmote ${e.args} version=${config.twitch.version} size=${config.twitch.size}}}}`;
        } else {
          return `?`;
        }
      }
    })
    .join("");
}

/** Parse markup and return as an array of elements */
export function parse(text, config) {
  config = { ...DefaultConfig, ...config };
  let expr = new RegExp(
    `(${escapeRegex(config.startTag)}.*?${escapeRegex(config.endTag)})`
  );
  let runs = text.split(expr).map((s) => {
    if (s === config.escapeAs) return config.escape;
    else if (s.startsWith(config.startTag) && s.endsWith(config.endTag)) {
      s = s.substring(config.startTag.length, s.length - config.endTag.length);
      let ss = s.split(/\s+/, 2);
      return { tag: ss[0], args: ss[1] };
    } else return s;
  });
  // compress any sequences of strings into a single string
  let runs2 = [];
  for (let i = 0; runs.length > i; i++) {
    if (
      typeof runs[i] === "string" &&
      typeof runs2[runs2.length - 1] === "string"
    ) {
      runs2[runs2.length - 1] += runs[i];
    } else runs2.push(runs[i]);
  }
  return runs2;
}

function resolveConfig(...configs) {}