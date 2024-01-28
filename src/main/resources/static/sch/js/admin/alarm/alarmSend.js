var vueData = {
  totalCount: 0,
  alarmData: {
    alarmCategory: "",                      // 알림 카테고리 코드
    alarmType: "",                          // 알림 종류코드
    alarmForm: "",                          // 알림 형태(P:푸시, M:메일, A:알림)
    alarmTarget: "",                        // 알림 타켓배열
    sj: "",                                // 제목
    msg: "",                                // 내용
    alarmFormList: [],
    alarmTargetList: [],
  },
  cmmnCode: [],
  searchData: {
    searchText: '',
    pageNo: 1,
    pageLength: 10,
  },
  authorList: [],
  alarmCategoryList: [],
  alarmTypeList: [],
  alarmFormList: [],
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
      fnOpenModal: () => {
        if (vm.alarmData.alarmCategory === '') {
          $.alert("카테고리를 선택하세요.");
          return false;
        }
        event.dataBindingForSend();
        if (vm.alarmData.alarmForm === '') {
          $.alert("알림형태를 선택하세요.");
          return false;
        }

        if (vm.alarmData.alarmType === '') {
          $.alert("알림종류를 선택하세요.");
          return false;
        }

        if (vm.alarmData.alarmTarget === '') {
          $.alert("알림 대상군을 선택하세요.");
          return false;
        }

        // if (vm.alarmData.sj === '') {
        //   $.alert("제목 작성하세요.");
        //   return false;
		//   }
		  
        if (vm.alarmData.msg === '') {
          $.alert("내용을 작성하세요.");
          return false;
        }

        $('#alarmSendModal').modal('show');
        event.dataBindingForModal();

        console.log(vm.alarmData);
      },
      fnSend: () => {
        $.sendAjax({
          url: "/alarm/insertAlarm.api",
          data: vm.alarmData,
          contentType: "application/json",
          success: (res) => {
            console.log(res);
          },
          error: function (e) {
            $.alert(e.responseJSON.message);
          },
        });
      },
      selectCmmnCode: () => {
        let paramList = [
          {upperCmmnCode: "ALARM_CATEGORY"},
          {upperCmmnCode: "AUTHOR"},
          {upperCmmnCode: "ALARM_TYPE"},
        ];
        for (let i = 0; i < paramList.length; i++) {
          $.sendAjax({
            url: "/cmmn/selectCmmnCode.api",
            data: paramList[i],
            contentType: "application/json",
            success: (res) => {
              switch (paramList[i].upperCmmnCode) {
                case 'AUTHOR':
                  vm.authorList = res.data;
                  break;
                case 'ALARM_CATEGORY':
                  vm.alarmCategoryList = res.data;
                  break;
                case 'ALARM_TYPE':
                  vm.alarmTypeList = res.data;
                  break;
              }
            },
            error: function (e) {
              $.alert(e.responseJSON.message);
            },
          });
        }
      },


    }
  })
  vm = app.mount("#content");
};

var event = {
  init: () => {
    // textArea 200자 제한
    $('#textBox').keyup(function (e) {
      let content = $(this).val();

      if (content.length === 0 || content === '') {
        $('.textCount').text('0');
      } else {
        $('.textCount').text(content.length);
      }
      if (content.length > 200) {
        $(this).val($(this).val().substring(0, 200));
      }
    });

    //회원종류에 전체 선택하면 다른 모든 회원종류 체크되도록 처리
    $(document).on("change", "input[id='ALL']", function (e) {
      let checkedStatus = e.target.checked;
      util.changeCheckedStatus(checkedStatus, "userKndCode");
    });
  },
  dataBindingForSend: () => {
    // 알림 형태
    const alarmFormCode = $("input[name='alarmForm']:checked");
    let alarmFormArray = [...alarmFormCode].map(ele => ele.value);
    vm.alarmData.alarmForm = alarmFormArray.join(',');
    vm.alarmData.alarmFormList = alarmFormArray;

    //알림 대상군
    const userKndCode = $("input[name='userKndCode']:checked");
    let userCodeArray = [...userKndCode].map(element => element.id);

    if (userCodeArray.includes('ALL')) {
      userCodeArray = 'ALL';
    } else {
      userCodeArray = userCodeArray.join(',');
    }
    vm.alarmData.alarmTarget = userCodeArray;
    vm.alarmData.alarmTargetList = [...userKndCode].map(element => element.id);
  },
  dataBindingForModal: () => {
    let alarmFormObj = {
      "P": "앱 푸시",
      "M": "메일",
      "A": "알림",
    }

    const category = vm.alarmData.alarmCategory;
    const categoryObj = vm.alarmCategoryList.find(item => item.cmmnCode === category);
    const categoryNm = categoryObj ? categoryObj.cmmnCodeNm : "";
    $("#modalCategory").text(categoryNm);

    let alarmTypeArray = vm.alarmData.alarmForm.split(",");
    let alarmTypeValues = alarmTypeArray.map(ele => alarmFormObj[ele]);
    let alarmType = alarmTypeValues.join(", ");
    $("#modalForm").text(alarmType);

    const type = vm.alarmData.alarmType;
    const typeObj = vm.alarmTypeList.find(item => item.cmmnCode === type);
    const typeNm = typeObj ? typeObj.cmmnCodeNm : "";
    $("#modalType").text(typeNm);

    let alarmTargetArray = vm.alarmData.alarmTarget.split(",");
    let alarmTargetValues = alarmTargetArray.map(code => {
      let mappingItem = vm.authorList.find(item => item.cmmnCode === code);
      return mappingItem ? mappingItem.cmmnCodeNm : "";
    });
    let alarmTarget = alarmTargetValues.join(", ");
    $("#modalTarget").text(alarmTarget);

    $("#modalSj").text(vm.alarmData.sj);
    $("#modalMsg").text(vm.alarmData.msg);
  },
}

$(document).ready(() => {
  vueInit();
  event.init();
  vm.selectCmmnCode();
});