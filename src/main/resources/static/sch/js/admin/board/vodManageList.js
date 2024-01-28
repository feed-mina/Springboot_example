let vueData = {
    totalCount: 0,
    vodManageList: [],
    checkedVodManageList: [],
    searchData: {
        searchText: '',
        pageNo: 1,
        pageLength: 10
    },
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
            fnSearch: function () {
                this.searchData.pageNo = 1;
                event.getVodManageList();
            },
            fnDetail: event.fnDetail,
            ellipsisText: (text) => {
                return util.formmater.textLengthOverCut(text, null, null);
            }
        }
    });
    vm = app.mount("#content");
};

let event = {
    init: () => {
        $(document).on("change","#checkAllItem",function(e){
            util.changeCheckedStatusByClass(e.target.checked, "vodManageItem");
        });
        $(document).on("click",".page-link",function(e){
            event.setVodMangeUnchecked();
        });
        $(document).on("click","#hideVodManageBtn",function(){
            $.confirm("선택한 글을 숨김처리하시겠습니까?", () => {
                var vodManageItemList = document.getElementsByClassName("vodManageItem");
                vm.checkedVodManageList = [];

                for (var i=0; i<vodManageItemList.length; i++) {
                    if (vodManageItemList[i].checked === true) {
                        vm.checkedVodManageList.push(vodManageItemList[i].id);
                    }
                }

                var paramMap = {"vodManageSeq":vm.checkedVodManageList};

                $.sendAjax({
                    url: "/vodManageController/hideVodManageList.api",
                    data: paramMap,
                    contentType: "application/json",
                    success: (res) => {
                        event.getVodManageList();
                        event.setVodMangeUnchecked();
                    }
                    , error: function (e) {
                        $.alert(e.responseJSON.message);
                    }
                });
            });
        });
        $(document).on("click","#showVodManageBtn",function(){
            $.confirm("선택한 글을 숨김해제 처리하시겠습니까?", () => {
                var vodManageItemList = document.getElementsByClassName("vodManageItem");
                vm.checkedVodManageList = [];

                for (var i=0; i<vodManageItemList.length; i++) {
                    if (vodManageItemList[i].checked === true) {
                        vm.checkedVodManageList.push(vodManageItemList[i].id);
                    }
                }

                var paramMap = {"vodManageSeq":vm.checkedVodManageList};

                $.sendAjax({
                    url: "/vodManageController/showVodManageList.api",
                    data: paramMap,
                    contentType: "application/json",
                    success: (res) => {
                        event.getVodManageList();
                        event.setVodMangeUnchecked();
                    }
                    , error: function (e) {
                        $.alert(e.responseJSON.message);
                    }
                });
            });
        });
    },
    getVodManageList: () => {
        $.sendAjax({
            url: "/vodManageController/selectVodManageList.api",
            data: vm.searchData,
            contentType: "application/json",
            success: (res) => {
                vm.totalCount = res.data.totalCount;
                vm.vodManageList = res.data.list;
                let len = vm.vodManageList.length;

                fnPaging(res.data.totalCount, dataPerPage, pageCount, res.data.pageNo, (selectPage) => {
                    vm.searchData.pageNo = selectPage;
                    event.getVodManageList();
                });
            }
            , error: function (e) {
                $.alert(e.responseJSON.message);
            }
        });
    },
    fnDetail: (vodManageSeq) => {
        location.href = "vodManageDetail.html?vodManageSeq=" + vodManageSeq;
    },
    setVodMangeUnchecked: (e) => {
        util.changeCheckedStatusByClass(false, "vodManageItem");
    },
}

$(document).ready(() => {
    vueInit();
    util.tableSetting();
    event.getVodManageList();
    event.init();
});