import { decode } from "he";

/** Convert (xxx) groups into (?:xxx) to avoid causing capture groups */
function ungroupParas(s) {
  return s.replace(/(?<!\\)\(/g, "(?:");
}

/** Unescape '\x' sequences by just replacing with 'x' */
function unslash(s) {
  return s.replace(/\\./g, (x) => x.substr(1));
}

/** Uncode the weirdly coded emote regex sequences */
function uncode(s) {
  return ungroupParas(s.replace(/\\&.*?\\;/g, (x) => decode(unslash(x))));
}

export const EmotesDataComp = {
  name: "emotes-data",
  props: {
    /** Twitch channel id */
    channel: {
      type: [String, Number],
      required: true
    },
    /** For v-model */
    value: {
      type: Object
    },
    /** Which key to store the cached data in local storage under */
    cacheKey: {
      type: String,
      required: false,
      default: null
    },
    /** How long to accept cached data in local storage before refreshing */
    cacheAge: {
      // TODO: not implemented
      type: Number,
      default: 30 * 60 * 1000 // 30 minutes
    }
  },
  watch: {
    /** Monitor the {channel} property for changes and trigger loading */
    channel: {
      immediate: true,
      handler(v) {
        this.load();
      }
    }
  },
  /** Do not render anything */
  render() {
    return null;
  },
  methods: {
    load() {
      let emotesJson =
        this.cacheKey == null ? null : localStorage.getItem(this.cacheKey);
      if (emotesJson == null) {
        let r = new XMLHttpRequest();
        r.onload = (data) => {
          localStorage.setItem(this.cacheKey, r.responseText);
          this.$emit("input", JSON.parse(r.responseText));
        };
        r.onerror = (err) => {
          this.$emit("input", {});
        };
        r.open(
          "GET",
          `https://api.twitchemotes.com/api/v4/channels/${this.channel}`
        );
        r.send();
      } else {
        this.$emit("input", JSON.parse(emotesJson));
      }
    }
  }
};

export const EmotesComp = {
  name: "emotes",
  props: {
    imageClass: {
      type: [String, Object],
      default: "image"
    },
    text: String,
    emotes: [Object, Array],
    size: { type: Number, default: 1 },
    version: { type: String, default: "1" }
  },
  computed: {
    allEmotes() {
      let all;
      if (this.emotes == null) {
        all = [];
      } else if (this.emotes instanceof Array) {
        all = this.emotes
          .map((e) => (e != null ? e.emotes : null))
          .filter((e) => e != null)
          .reduce((p, c) => p.concat(c), []);
      } else {
        all = this.emotes;
      }

      let merged = all.map((e) => {
        e = { ...e }; // copy
        e.code0 = e.code;
        return {
          ...e,
          code0: e.code,
          code: uncode(e.code), // there's a mix of html and regex escapes in there..
          regex: new RegExp("^" + e.code + "$")
        };
      });
      return merged;
    },
    emotesRegexp() {
      let codes = this.allEmotes.map((e) => e.code);
      return this.allEmotes
        ? new RegExp("(?:\\b|\\s|^)(" + codes.join("|") + ")(?:\\b|\\s|$)", "g")
        : null;
    }
  },
  render(h) {
    if (this.allEmotes != null) {
      let split = this.text.split(this.emotesRegexp);
      let stuff = split.map((token) => {
        let emote = this.allEmotes.find((e) => e.regex.test(token));
        if (emote) {
          return h("img", {
            class: this.imageClass,
            attrs: {
              src: `https://static-cdn.jtvnw.net/emoticons/v${this.version}/${emote.id}/${this.size}.0`
            }
          });
        } else {
          return token;
        }
      });
      return h("span", stuff);
    } else {
      return this.text;
    }
  }
};
