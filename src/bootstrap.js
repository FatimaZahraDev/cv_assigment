import lodash from "lodash";
import constants from "@/config/constants";
import helper from "@/helpers";
async function bootstrap() {
  window.lodash = lodash;
  window.constants = constants;
  window.helper = helper;
  window.user = await window.helper.getStorageData("session");
}

export default bootstrap;
