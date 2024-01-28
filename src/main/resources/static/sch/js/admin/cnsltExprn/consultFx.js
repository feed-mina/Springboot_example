var vueData = {
    cnsltOperateList: [],
    imageButton: "false",
    step: "master",
    cnsltUserSeq: 0,
    totalCount: 0,
    preview: "",
    cnsltFx: {},
    modifyData: {},
    cnsltList: {},
    searchData: {
        canceldCnsltInclude: false,
        searchText: '',
        pageNo: 1,
        pageLength: 10,
    },
    canceldCnsltInclude: '',
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
            fnSearch: function (cmmnCodeEtc) {
                this.searchData.pageNo = 1;

                event.getCnsltOperateList();
            },
            fnConsultOperationDetail: (cnsltSeq, cnsltSn) => {
                location.assign("/sch/admin/cnsltExprn/consultOperateDetail.html?cnsltSeq=" + cnsltSeq + "&cnsltSn=" + cnsltSn)
            }
        }
    })
    vm = app.mount("#content");

};
let event = {
    init: () => {
        let canceldCnsltIncludeCheckbox = document.querySelector("#canceldCnsltInclude");
        canceldCnsltIncludeCheckbox.addEventListener("change", () => {
            if (canceldCnsltIncludeCheckbox.checked) {
                vm.searchData.canceldCnsltInclude = true; // 운영취소 포함
            } else {

                vm.searchData.canceldCnsltInclude = false; // 운영취소 포함안됨
            }
        })

    }
    , getCnsltOperateList: () => {
        $.sendAjax({
            url: "/consult/selectCnsltOperateList.api",
            data: vm.searchData,
            contentType: "application/json",
            success: (res) => {
                const { totalCount, list, pageNo } = res.data;
                vm.totalCount = res.data.totalCount;
                vm.cnsltOperateList = res.data.list;
                let len = vm.cnsltOperateList.length;
                vm.totalCount = totalCount;
                vm.cnsltOperateList = list.map(item => {
                    const { cnsltWeekArray, exprnKndCode } = item;

                    const { cnsltRegisterCnt, consultUserCnt } = item;
                    if (cnsltWeekArray !== "") {
                        const dayNames = ["월", "화", "수", "목", "금", "토", "일"];
                        const dayIndices = cnsltWeekArray.split(',').map(Number);

                        item.cnsltWeekArray = dayIndices.map(index => dayNames[index - 1] || "오류").join("/");
                    }
                    vm.cnsltOperateList.consultUserCount = item.consultUserCount
                    return item;
                });
                fnPaging(res.data.totalCount, dataPerPage, pageCount, res.data.pageNo, (selectPage) => {
                    vm.searchData.pageNo = selectPage;
                    event.getCnsltOperateList();
                });
            }
            , error: function (e) {
                $.alert(e.responseJSON.message);
            }
        });
    }
};

$(document).ready(() => {
    vueInit();
    event.getCnsltOperateList();
    event.init();
});

