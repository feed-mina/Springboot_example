let vueData = {
  alarmDetail: {},
  urlParams: "",
}

let vm;

let vueInit = () => {
  const app = Vue.createApp({
    data() {
      return vueData;
    },
    methods: {
    }
  })
  vm = app.mount("#content");
};

let event = {
  alarmDetailOne: () => {
    let param = {
      alarmSeq: this.urlParams.get('alarmSeq'),
    }

    $.sendAjax({
      url: "/alarm/selectAlarmOneDeatil.api",
      data: param,
      contentType: "application/json",
      success: (res) => {
        vm.alarmDetail = res.data;

        let alarmTargetArrayStr = vm.alarmDetail.alarmTarget;
        alarmTargetArrayStr = alarmTargetArrayStr.replace("ALL", "전체")
            .replace("ETA", "기타-중고생")
            .replace("ETB", "기타-초등생")
            .replace("ETC", "기타-지역주민")
            .replace("FF", "교직원")
            .replace("ST", "순천향대학생")
            .replace("TJ", "텐진대학생")
            .replace("PR", "교수")
            .replaceAll(", ", "/");
        vm.alarmDetail.alarmTarget = alarmTargetArrayStr;
      }
    })
  },
}

$(document).ready(() => {
  this.urlParams = new URL(location.href).searchParams;
  vueInit();
  event.alarmDetailOne();

})
