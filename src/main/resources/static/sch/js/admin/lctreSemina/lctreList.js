let vueData = {
    totalCount: 0,
    lctreList: [],
    searchData: {
        closedLctreInclude: false,
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
                event.getLectureList();
            },
            fnDetail: event.fnDetail,
            LctreRegisterRedirect: () => {
                location.href = "/sch/admin/lctreSemina/lctreRegist.html";
            },
            ellipsisText: (text) => {
                return util.formmater.textLengthOverCut(text, null, null);
            }
        }
    })
    vm = app.mount("#content");
};

let event = {

    getLectureList: () => {
        $.sendAjax({
            url: "/lctreController/selectLctreList.api",
            data: vm.searchData,
            contentType: "application/json",
            success: (res) => {
                vm.totalCount = res.data.totalCount;
                vm.lctreList = res.data.list;
                let len = vm.lctreList.length;

                //강의요일 글자로 변환
                for (let i = 0; i < len; i++) {
                    let lctreWeekArrayStr = vm.lctreList[i].lctreWeekArray;
                    lctreWeekArrayStr = lctreWeekArrayStr.replace("1", "월")
                        .replace("2", "화")
                        .replace("3", "수")
                        .replace("4", "목")
                        .replace("5", "금")
                        .replace("6", "토")
                        .replaceAll(", ", "/");
                    vm.lctreList[i].lctreWeekArray = lctreWeekArrayStr;
                }

                //회원종류 글자로 변환
                for (let i = 0; i < len; i++) {
                    let atnlcAuthorArrayStr = vm.lctreList[i].atnlcAuthorArray;
                    atnlcAuthorArrayStr = atnlcAuthorArrayStr.replace("ALL", "전체")
                        .replace("ETA", "기타-중고생")
                        .replace("ETB", "기타-초등생")
                        .replace("ETC", "기타-지역주민")
                        .replace("FF", "교직원")
                        .replace("ST", "순천향대학생")
                        .replace("TJ", "텐진외대학생")
                        .replaceAll(", ", "/");
                    vm.lctreList[i].atnlcAuthorArray = atnlcAuthorArrayStr;
                }

                fnPaging(res.data.totalCount, dataPerPage, pageCount, res.data.pageNo, (selectPage) => {
                    vm.searchData.pageNo = selectPage;
                    event.getLectureList();
                })
            }
            , error: function (e) {
                $.alert(e.responseJSON.message);
            }
        });
    },
    fnDetail: (lctreSeq, target) => {
        if (target === 'register') {
            location.href = "lctreDetail.html?lctreSeq=" + lctreSeq + "&target=" + target;
        } else {
            location.href = "lctreDetail.html?lctreSeq=" + lctreSeq;
        }
    }
}

$(document).ready(() => {
    vueInit();
    util.tableSetting();
    event.getLectureList();
});
