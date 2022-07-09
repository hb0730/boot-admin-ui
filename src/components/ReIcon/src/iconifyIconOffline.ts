import { h, defineComponent } from "vue";
import { Icon as IconifyIcon, addIcon } from "@iconify/vue/dist/offline";

// element-plus icon
import Check from "@iconify-icons/ep/check";
import HomeFilled from "@iconify-icons/ep/home-filled";
import Setting from "@iconify-icons/ep/setting";
import Lollipop from "@iconify-icons/ep/lollipop";
import RefreshRight from "@iconify-icons/ep/refresh-right";
import ArrowDown from "@iconify-icons/ep/arrow-down";
import CloseBold from "@iconify-icons/ep/close-bold";
import Bell from "@iconify-icons/ep/bell";
import Guide from "@iconify-icons/ep/guide";
import User from "@iconify-icons/ep/user";
import Iphone from "@iconify-icons/ep/iphone";
import Location from "@iconify-icons/ep/location";
import Tickets from "@iconify-icons/ep/tickets";
import OfficeBuilding from "@iconify-icons/ep/office-building";
import Notebook from "@iconify-icons/ep/notebook";
import Delete from "@iconify-icons/ep/delete";
import Plus from "@iconify-icons/ep/plus";
import UserFilled from "@iconify-icons/ep/user-filled";
import Rank from "@iconify-icons/ep/rank";
import videoPlay from "@iconify-icons/ep/video-play";
import Monitor from "@iconify-icons/ep/monitor";
import Search from "@iconify-icons/ep/search";
import Lock from "@iconify-icons/ep/lock";
import Edit from "@iconify-icons/ep/edit";
import Download from "@iconify-icons/ep/download";
import Upload from "@iconify-icons/ep/upload";

addIcon("check", Check);
addIcon("home-filled", HomeFilled);
addIcon("setting", Setting);
addIcon("lollipop", Lollipop);
addIcon("refresh-right", RefreshRight);
addIcon("arrow-down", ArrowDown);
addIcon("close-bold", CloseBold);
addIcon("bell", Bell);
addIcon("guide", Guide);
addIcon("user", User);
addIcon("iphone", Iphone);
addIcon("location", Location);
addIcon("tickets", Tickets);
addIcon("office-building", OfficeBuilding);
addIcon("notebook", Notebook);
addIcon("delete", Delete);
addIcon("plus", Plus);
addIcon("user-filled", UserFilled);
addIcon("video-play", videoPlay);
addIcon("rank", Rank);
addIcon("monitor", Monitor);
addIcon("search", Search);
addIcon("lock", Lock);
addIcon("edit", Edit);
addIcon("download", Download);
addIcon("upload", Upload);

// remixicon
import arrowRightSLine from "@iconify-icons/ri/arrow-right-s-line";
import arrowLeftSLine from "@iconify-icons/ri/arrow-left-s-line";
import logoutCircleRLine from "@iconify-icons/ri/logout-circle-r-line";
import nodeTree from "@iconify-icons/ri/node-tree";
import ubuntuFill from "@iconify-icons/ri/ubuntu-fill";
import questionLine from "@iconify-icons/ri/question-line";
import checkboxCircleLine from "@iconify-icons/ri/checkbox-circle-line";
import informationLine from "@iconify-icons/ri/information-line";
import closeCircleLine from "@iconify-icons/ri/close-circle-line";
import arrowUpLine from "@iconify-icons/ri/arrow-up-line";
import arrowDownLine from "@iconify-icons/ri/arrow-down-line";
import bookmark2Line from "@iconify-icons/ri/bookmark-2-line";
import refreshLine from "@iconify-icons/ri/refresh-line";
addIcon("arrow-right-s-line", arrowRightSLine);
addIcon("arrow-left-s-line", arrowLeftSLine);
addIcon("logout-circle-r-line", logoutCircleRLine);
addIcon("node-tree", nodeTree);
addIcon("ubuntu-fill", ubuntuFill);
addIcon("question-line", questionLine);
addIcon("checkbox-circle-line", checkboxCircleLine);
addIcon("information-line", informationLine);
addIcon("close-circle-line", closeCircleLine);
addIcon("arrow-up-line", arrowUpLine);
addIcon("arrow-down-line", arrowDownLine);
addIcon("bookmark-2-line", bookmark2Line);
addIcon("refreshLine", refreshLine);

// Font Awesome 4
import faUser from "@iconify-icons/fa/user";
import faLock from "@iconify-icons/fa/lock";
import faSignOut from "@iconify-icons/fa/sign-out";
import faSearch from "@iconify-icons/fa/search";
import faTrash from "@iconify-icons/fa/trash";
import faRefresh from "@iconify-icons/fa/refresh";
import faUpload from "@iconify-icons/fa/upload";
import faDownload from "@iconify-icons/fa/download";
import faKey from "@iconify-icons/fa/key";
import faCheck from "@iconify-icons/fa/check";
import faEdit from "@iconify-icons/fa/edit";
import faPlayCircle from "@iconify-icons/fa/play-circle";
import faCopyright from "@iconify-icons/fa/copyright";

addIcon("fa-user", faUser);
addIcon("fa-lock", faLock);
addIcon("fa-sign-out", faSignOut);
addIcon("fa-search", faSearch);
addIcon("fa-trash", faTrash);
addIcon("fa-refresh", faRefresh);
addIcon("fa-upload", faUpload);
addIcon("fa-download", faDownload);
addIcon("fa-key", faKey);
addIcon("fa-check", faCheck);
addIcon("fa-edit", faEdit);
addIcon("fa-search", Search);
addIcon("fa-play-circle", faPlayCircle);
addIcon("fa-copyright", faCopyright);

// Iconify Icon在Vue里离线使用（用于内网环境）https://docs.iconify.design/icon-components/vue/offline.html
export default defineComponent({
  name: "IconifyIcon",
  components: { IconifyIcon },
  props: {
    icon: {
      type: String,
      default: ""
    }
  },
  render() {
    const attrs = this.$attrs;
    return h(
      IconifyIcon,
      {
        icon: `${this.icon}`,
        ...attrs
      },
      {
        default: () => []
      }
    );
  }
});
