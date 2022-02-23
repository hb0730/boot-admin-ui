import { defineComponent, h } from "vue";
import { EIcon } from "e-icon-picker";
export default defineComponent({
  name: "IconPicker",
  components: { EIcon },
  props: {
    icon: {
      type: String,
      default: ""
    }
  },
  render() {
    return h(EIcon, { iconName: `${this.icon}` });
  }
});
