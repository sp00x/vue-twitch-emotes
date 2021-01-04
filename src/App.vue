<template>
  <div id="app">
    <h1>emotes test</h1>

    <p>
      size:
      <input type="number" step="1" min="1" max="3" v-model.number="size" />
    </p>

    <p>
      clamp height:
      <input type="checkbox" v-model="clampHeight" />
    </p>

    <p>channel: <input type="text" v-model.number="channel" /></p>

    <p>
      text:
      <textarea style="width: 100%" v-model="text"></textarea>
    </p>

    <p>
      <emotes-data
        :channel="channel"
        v-model="emotes"
        :cache-key="`twitch-emotes-${channel}`"
      />

      <emotes-data
        channel="1"
        v-model="defaultEmotes"
        cache-key="twitch-emotes-1"
      />

      <div>
        <emotes
          :version="version"
          :size="size"
          :text="text"
          :emotes="[emotes, defaultEmotes]"
          :image-class="{ emote: clampHeight }"
        />
      </div>
    </p>
    <pre>{{ emotes }}</pre>
  </div>
</template>

<script>
import { EmotesComp, EmotesDataComp } from "@/components/TwitchEmotes";

export default {
  name: "App",
  components: {
    [EmotesComp.name]: EmotesComp,
    [EmotesDataComp.name]: EmotesDataComp,
  },
  data() {
    return {
      clampHeight: false,
      channel: "23161357",
      version: "1",
      size: 1,
      text:
        "herpaderpderp :-D :D lirikLATE lirikLATE mc derpens lirikANGRY lirikBOOMER :P :P :P:P:P:P :) o.O",
      emotes: null,
      defaultEmotes: null,
    };
  },
  mounted() {},
};
</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.emote {
  max-height: 1em;
}
</style>
