var vueData = {
  totalCount: 0,
  alarmList: [],
  cmmnCode: [],
  searchData: {
    searchText: '',
    pageNo: 1,
    pageLength: 10,
    userType: "user"
  }
};

let dataPerPage = 10;
let pagePerBar = 10;
let pageCount = 10;
var vm;

var vueInit = () => {
  const app = Vue.createApp({
    data() {
      return vueData;
    },
    methods: {
      fnSearch: function (alarmCategory) {
        this.searchData.pageNo = 1;
        if (alarmCategory !== '') {
          vm.searchData.alarmCategory = alarmCategory;
        }
        event.getAlarmList();
      },
      fnDtail: (alarmSeq) => {
        location.href = "alarmDetail.html?alarmSeq=" + alarmSeq;
      },
      fnRedirectAlarm: () => {
        location.href = "alarmSend.html";
      }
    }
  })
  vm = app.mount("#content");
};

var event = {

  getAlarmList: () => {
    console.log(vm.searchData)
    $.sendAjax({
      url: "/alarm/selectAlarmList.api",
      data: vm.searchData,
      contentType: "application/json",
      success: (res) => {
        vm.totalCount = res.data.totalCount;
        vm.alarmList = res.data.list;

        //회원종류 글자로 변환
        for (let i = 0; i < vm.alarmList.length; i++) {
          let alarmTargetArrayStr = vm.alarmList[i].alarmTarget;
          alarmTargetArrayStr = alarmTargetArrayStr?.replace("ALL", "전체")
              .replace("ETA", "기타-중고생")
              .replace("ETB", "기타-초등생")
              .replace("ETC", "기타-지역주민")
              .replace("FF", "교직원")
              .replace("ST", "순천향대학생")
              .replace("TJ", "텐진대학생")
              .replace("PR", "교수")
              .replaceAll(", ", "/");
          vm.alarmList[i].alarmTarget = alarmTargetArrayStr;
        }
        fnPaging(res.data.totalCount, dataPerPage, pageCount, res.data.pageNo, (selectPage) => {
          vm.searchData.pageNo = selectPage;
          event.getAlarmList();
        })
      }
      , error: function (e) {
        $.alert(e.responseJSON.message);
      }
    });
  }
}

$(document).ready(() => {
  vueInit();
  util.tableSetting();
  event.getAlarmList();
});