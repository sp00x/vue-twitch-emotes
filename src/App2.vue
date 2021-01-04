<template>
  <div>
    <h1>Input from Twitch</h1>

    <h2>Message:</h2>
    <input type="text" v-model="msg.message" /><br />

    <h2>Emotes:</h2>
    <input type="text" v-model="msg.emotes" /><br />

    <h1>Parse-a-roo</h1>

    <h2>Bee-On&reg;&trade; Markup:</h2>
    <input type="text" readonly :value="markupText" />

    <h2>Render:</h2>
    <beeon-markup :text="markupText" /><br />

    <h2>HTML:</h2>
    {{ renderedMarkup }}<br />

    <h2>HTML in v-html:</h2>
    <span v-html="renderedMarkup" />

    <h2>Handlebars template:</h2>
    {{ handlebarsTemplate }}

    <h2>Handlebars rendered:</h2>
    <span v-html="handlebarsHTML" />
  </div>
</template>

<script>
import Handlebars from "handlebars";
import BeeonMarkup from "@/components/BeeonMarkup.vue";
import {
  toHTML,
  toHandlebarsTemplate,
  fromTwitchMessage,
  registerHandlebarsHelpers,
} from "@/components/BeeonMarkup.js";

registerHandlebarsHelpers(Handlebars);

Handlebars.registerHelper("twitchEmote", (id, options) => {
  let size = options.size ?? 1; // 1, 2, 3
  let version = options.version ?? "1"; // always 1
  let class_ = options.class ?? "";
  let html = `<img src="https://static-cdn.jtvnw.net/emoticons/v${version}/${id}/${size}.0" class="${class_}">`;
  return html;
});

export default {
  components: { "beeon-markup": BeeonMarkup },
  data() {
    return {
      msg: {
        message:
          "if you win now gmbenjSUSPICIOUS nakamuraPogChamp ;< {{{}}} 😀🤶🎅👮‍♀️👮‍♂️👳‍♀️👳‍♂️",
        emotes: "982507:15-30/302340180:32-47",
      },
    };
  },
  computed: {
    markupText() {
      return this.convertTwitchMessageToMarkup(this.msg);
    },
    renderedMarkup() {
      return toHTML(this.markupText);
    },
    handlebarsTemplate() {
      return toHandlebarsTemplate(this.markupText);
    },
    handlebarsHTML() {
      return Handlebars.compile(this.handlebarsTemplate)({});
    },
  },
  methods: {
    convertTwitchMessageToMarkup(msg) {
      return fromTwitchMessage(msg);
    },
  },
};
</script>

<style scoped>
input[type="text"] {
  width: 100%;
}

img.twitchEmote {
  height: 1em;
}
</style>