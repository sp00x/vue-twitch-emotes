<script>
export default {
  name: "beeon-markup",
  props: {
    markup: {
      type: Object,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    scope: {
      type: String,
      default: null,
      required: false,
    },
  },
  render(h) {
    //let markup = new BeeonMarkup(this.config);
    const { markup } = this;
    let elems = markup.parse(this.text).map((e) => {
      if (typeof e === "string") {
        return e;
      } else {
        if (e.tag === "twitchEmote") {
          return h("img", {
            class: markup.config.twitch.class,
            attrs: {
              [this.scope]: "",
              [this.$parent.$options._scopeId]: "",
              src: `https://static-cdn.jtvnw.net/emoticons/v${
                markup.config.twitch.version || "1"
              }/${e.args}/${markup.config.twitch.size || "1"}.0`,
            },
          });
        } else {
          return `[unknown markup: ${e.tag}]`;
        }
      }
    });
    return h(markup.config.el, elems);
  },
};
</script>