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
import BeeonMarkupComp from "@/components/BeeonMarkup.vue";
import {
  BeeonMarkup,
  registerHandlebarsHelpers,
} from "@/components/BeeonMarkup.js";

registerHandlebarsHelpers(Handlebars);

const markup = new BeeonMarkup();

export default {
  components: { "beeon-markup": BeeonMarkupComp },
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
      return markup.fromTwitchMessage(this.msg);
    },
    renderedMarkup() {
      return markup.toHTML(this.markupText);
    },
    handlebarsTemplate() {
      return markup.toHandlebarsTemplate(this.markupText);
    },
    handlebarsHTML() {
      return Handlebars.compile(this.handlebarsTemplate)({});
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