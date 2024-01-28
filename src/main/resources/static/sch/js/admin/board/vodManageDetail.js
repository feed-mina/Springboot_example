let vueData = {
    vodManageDetail :{},
    vodManageTag: "",
    vodImageFileList : [],
    vodManageVideoFileList: [],
    vodImageFile:"",
    vodManageVideoFile:"",
}

let vm;

let vueInit = () => {
    const app = Vue.createApp({
        data() {
            return vueData;
        },
        methods: {
        },
    });
    vm = app.mount('#content');
}

let event = {
    init: () => {
        $(document).on("click","#hideVodManageBtn",function(){
            $.confirm("선택한 글을 숨김처리하시겠습니까?", () => {
                var urlParams = new URL(location.href).searchParams;
                var vodManageSeq = urlParams.get('vodManageSeq');
                var paramList = [];
                paramList.push(vodManageSeq);
                var paramMap = {'vodManageSeq': paramList};

                $.sendAjax({
                    url: "/vodManageController/hideVodManageList.api",
                    data: paramMap,
                    contentType: "application/json",
                    success: (res) => {
                        event.getVodManageDetail();
                    }
                    , error: function (e) {
                        $.alert(e.responseJSON.message);
                    }
                });
            });
        });
        $(document).on("click","#showVodManageBtn",function(){
            $.confirm("선택한 글을 숨김해제 처리하시겠습니까?", () => {
                var urlParams = new URL(location.href).searchParams;
                var vodManageSeq = urlParams.get('vodManageSeq');
                var paramList = [];
                paramList.push(vodManageSeq);
                var paramMap = {'vodManageSeq': paramList};

                $.sendAjax({
                    url: "/vodManageController/showVodManageList.api",
                    data: paramMap,
                    contentType: "application/json",
                    success: (res) => {
                        event.getVodManageDetail();
                    }
                    , error: function (e) {
                        $.alert(e.responseJSON.message);
                    }
                });
            });
        });
    },
    getVodManageDetail: () => {
        var urlParams = new URL(location.href).searchParams;
        var vodManageSeq = urlParams.get('vodManageSeq');
        var paramMap = {'vodManageSeq': vodManageSeq};
        $.sendAjax({
            url: "/vodManageController/selectVodManageDetail.api",
            data: paramMap,
            contentType: "application/json",
            success: (res) => {
                vm.vodManageDetail = res.data;
                vm.vodManageTag = res.data.vodManageTagMap.vodManageTag;
                vm.vodImageFile = "/cmmn/fileDownload.api?fileSeq=" + res.data.vodImageSeq;
                vm.vodManageVideoFile = "/cmmn/fileDownload.api?fileSeq=" + res.data.vodManageVideoSeq;
                var tempTagArray = [];
                if (util.validator.isNotEmpty(vm.vodManageTag)) {
                    if (vm.vodManageTag.indexOf(",") != -1) {
                        tempTagArray = vm.vodManageTag.split(",");
                    } else {
                        tempTagArray.push(vm.vodManageTag);
                    }

                    for (let i = 0; i < tempTagArray.length; i++) {
                        var tag = tempTagArray[i];

                        var tagAppend = "<div class='keyword dp_center side-by-side'>" + tag + "</div>";
                        $("#tagContainer").append(tagAppend);
                    }
                }

                if(res.data.vodImageFileList.length > 0){
                    vm.vodImageFileList = res.data.vodImageFileList;
                    for(var i=0; i < vm.vodImageFileList.length; i++){
                        var cours = vm.vodImageFileList[i].fileCours
                        vm.vodImageFileList[i].fileNm = util.getLastString(cours)
                        var fileNm = vm.vodImageFileList[i].orignlFileNm
                        vm.vodImageFileList[i].fileType = util.chkType(fileNm)
                    }
                }

                if(res.data.vodManageVideoFileList.length > 0){
                    vm.vodManageVideoFileList = res.data.vodManageVideoFileList;
                    for(var i=0; i < vm.vodManageVideoFileList.length; i++){
                        var cours = vm.vodManageVideoFileList[i].fileCours
                        vm.vodManageVideoFileList[i].fileNm = util.getLastString(cours)
                        var fileNm = vm.vodManageVideoFileList[i].orignlFileNm
                        vm.vodManageVideoFileList[i].fileType = util.chkType(fileNm)
                    }
                }
            },
            error: function (e) {
                $.alert(e.responseJSON.message);
            },
        });
    },
}

$(document).ready( () => {
    vueInit();
    event.init();
    event.getVodManageDetail();
});
