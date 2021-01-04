<script>
import { DefaultConfig, parse } from "./BeeonMarkup.js";

export default {
  name: "beeon-markup",
  props: {
    scope: {
      type: String,
      default: null,
      required: false,
    },
    text: {
      type: String,
      default: "",
      required: false,
    },
    config: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  computed: {
    resolvedConfig() {
      return { ...DefaultConfig, ...this.config };
    },
  },
  render(h) {
    let config = this.resolvedConfig;
    let elems = parse(this.text, config).map((e) => {
      if (typeof e === "string") {
        return e;
      } else {
        if (e.tag === "twitchEmote") {
          return h("img", {
            class: config.twitch.class,
            attrs: {
              [this.scope]: "",
              [this.$parent.$options._scopeId]: "",
              src: `https://static-cdn.jtvnw.net/emoticons/v${
                config.twitch.version || "1"
              }/${e.args}/${config.twitch.size || "1"}.0`,
            },
          });
        } else {
          return `[unknown markup: ${e.tag}]`;
        }
      }
    });
    return h(config.el, elems);
  },
};
</script>