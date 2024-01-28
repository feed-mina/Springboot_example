let vueData = {
    totalCount: 0,
    seminaList: [],
    searchData: {
        canceledSeminaInclude: false,
        authorOne: "",
        searchText: '',
        pageNo: 1,
        pageLength: 10
    }
};

let dataPerPage = 10;
let pagePerBar = 10;
let pageCount = 10;
let vm;

let vueInit = () => {
    const app = Vue.createApp({
        data() {
            return vueData;
        },
        methods: {
            fnSearch: function (userAuthor) {
                this.searchData.pageNo = 1;
                if (userAuthor !== '') {
                    vm.searchData.authorOne = userAuthor;
                }
                event.getSeminaList();
            },
            fnDetail: event.fnDetail,
            seminaRegisterRedirect: () => {
                location.href = "/sch/admin/lctreSemina/seminaRegist.html";
            },
            ellipsisText: (text) => {
                return util.formmater.textLengthOverCut(text, null, null);
            }
        }
    });
    vm = app.mount("#content");
}

let event = {
    getSeminaList: () => {
        $.sendAjax({
            url: "/seminaController/selectSeminaList.api",
            data: vm.searchData,
            contentType: "application/json",
            success: (res) => {
                vm.totalCount = res.data.totalCount;
                vm.seminaList = res.data.list;
                let len = vm.seminaList.length;

                for (let i = 0; i < len; i++) {
                    //회원종류 글자로 변환
                    let atnlcAuthorArrayStr = vm.seminaList[i].atnlcAuthorArray;
                    atnlcAuthorArrayStr = atnlcAuthorArrayStr.replace("ALL", "전체")
                        .replace("ETA", "기타-중고생")
                        .replace("ETB", "기타-초등생")
                        .replace("ETC", "기타-지역주민")
                        .replace("FF", "교직원")
                        .replace("ST", "순천향대학생")
                        .replace("TJ", "텐진외대학생")
                        .replaceAll(", ", "/");
                    vm.seminaList[i].atnlcAuthorArray = atnlcAuthorArrayStr;

                    //세미나 날짜 form 맞춰주기
                    vm.seminaList[i].seminaDe = util.date.addDateDash(vm.seminaList[i].seminaDe);
                }

                fnPaging(res.data.totalCount, dataPerPage, pageCount, res.data.pageNo, (selectPage) => {
                    vm.searchData.pageNo = selectPage;
                    event.getSeminaList();
                });
            }
            , error: function (e) {
                $.alert(e.responseJSON.message);
            }
        });
    },
    fnDetail: (seminaSeq, target) => {
        if (target === 'register') {
            location.href = "seminaDetail.html?seminaSeq=" + seminaSeq + "&target=" + target;
        } else {
            location.href = "seminaDetail.html?seminaSeq=" + seminaSeq;
        }
    },
}

$(document).ready(() => {
    vueInit();
    util.tableSetting();
    event.getSeminaList();
});
