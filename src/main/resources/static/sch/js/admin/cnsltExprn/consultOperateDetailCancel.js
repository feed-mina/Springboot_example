var vueData = {
    answerData: {},
    canclNtcnArray: [],			//
    cnsltData: {
        canclDc: "",
        cnsltCode: "", // 취소코드
        cnsltCodeList: [],	 // 취소코드 설명
        startHour: "",				// 시작 시간
        startMinute: "",			// 시작 분
        endHour: "",				// 종료 시간
        endMinute: "",				// 종료 분
        startDt: "",				// 기간 시작일자
        endDt: "",					// 기간 종료일자
        startPeriodDt: "",			//모집기간 시작일자
        endPeriodDt: "",			//모집기간 종료일자
        startPeriodHour: "",		//모집기간 시작시간
        startPeriodMinute: "",		//모집기간 시작분
        endPeriodHour: "",			//모집기간 종료시간
        endPeriodMinute: "",		//모집기간 종료분 
        profsrName: "",				//교수명 
        cnsltWeekArray: [],			//요일
        cnsltPlace: "",				//장소   
        canclNtcnArray: ['A', 'M', 'P'],			//취소알림배열
        cnsltUserCnt: "",
        cnsltDescription: "",
        cnsltPlace: "",
        useAt: "",
    }
    , preview: "",
};

let vm;
var vueInit = () => {
    const app = Vue.createApp({
        data() {
            return vueData;
        },
        methods: {
            fnGetCheckboxValue: () => {
                let result = '';


            },
            fnConsultCnclUpdt: () => {
                event.consultCnclUpdt();
            },
            fnCnsltCanclCode: () => {
                $(document).on("click", "#cnsltCanclCode", function (e) {
                    if (vm.cnsltData.cnsltCanclCode == 'CNSLT_CANCEL_REASON1') {
                        vm.cnsltData.cnsltCodeList = '일정 변경'
                    } else if (vm.cnsltData.cnsltCanclCode == 'CNSLT_CANCEL_REASON2') {
                        vm.cnsltData.cnsltCodeList = '교수님 일정 변경'
                    }
                })
            }
            , fnCancel: () => {
                $.alert("교수상담이 취소됩니다. ", () => {
                    vm.cnsltData.canclDc = ''
                    vm.cnsltData.useAt = 'N'
                    location.href = "consultFx.html"
                })
            }
        }
    })
    vm = app.mount('#content');
}

let event = {
    init: () => {
        var cnsltCanclCodeSelect = document.getElementById('cnsltCanclCode');
        cnsltCanclCodeSelect.addEventListener("change", function () {
            this.setCustomValidity("");
            if (this.value === "") {
                this.setCustomValidity("사유를 선택하세요.");
            }
        });
        cnsltCanclCodeSelect.setCustomValidity("사유를 선택하세요.");


        $(document).on("click", "#btnCancel", function (e) {
            vm.cnsltData.canclCode = "";
            vm.cnsltData.canclDc = "";
            vm.cnsltData.canclNtcnArray = [];
        });
        $(document).on("click", "#btnSave", function (e) {
            if (!event.validation()) {
                return false;
            }
            vm.fnConsultCnclUpdt()
        })

        $(document).on("click", "#btnUpdateCnslt", function (e) {
            let urlParams = new URL(location.href).searchParams;
            let cnsltSeq = urlParams.get('cnsltSeq');
            let cnsltSn = urlParams.get('cnsltSn');
            location.href = "consultUpdt.html?cnsltSeq=" + cnsltSeq;

        });
    },
    consultCnclUpdt: () => {
        let urlParams = new URL(location.href).searchParams;
        let cnsltSeq = urlParams.get('cnsltSeq');
        let cnsltSn = urlParams.get('cnsltSn');
        vm.cnsltData.cnsltSeq = cnsltSeq
        vm.cnsltData.cnsltSn = cnsltSn
        var text = vm.cnsltData.canclDc;
        text = text.replace(/(?:\r\n|\r|\n)/g, '<br>');
        vm.cnsltData.canclDc = text
        if (vm.cnsltData.canclNtcnArray != null) {
            vm.cnsltData.canclNtcnArray = Object.values(vm.cnsltData.canclNtcnArray.sort()).join()
        }


        let formData = new FormData();
        formData.append('paramMap', new Blob([JSON.stringify(vm.cnsltData.canclDc)], { type: 'application/json' }));

        $.sendAjax({
            url: "/consult/updateConsultCancl.api",
            data: {
                canclCode: vm.cnsltData.canclCode,
                canclDc: vm.cnsltData.canclDc,
                canclNtcnArray: vm.cnsltData.canclNtcnArray,
                useAt: 'N',
                cnsltSeq: vm.cnsltData.cnsltSeq,
                cnsltSn: vm.cnsltData.cnsltSn
            },
            contentType: "application/json",
            success: (res) => {
                $.alert("취소 사유가 등록되었습니다. 교수상담 운영 목록으로 이동합니다.", () => {
                    location.href = "consultFx.html";
                })
            }
            , error: function (e) {
                $.alert(e.responseJSON.message);
            }
        })
    }
    , getCmmnCodeList: () => {
        let param = {
            upperCmmnCode: 'CNSLT_CANCEL_REASON'
        }
        $.sendAjax({
            url: "/cmmn/selectCmmnCode.api",
            data: param,
            contentType: "application/json",
            success: (res) => {
                vm.cmmnCode = res.data;
            }
        })
    }
    , getConsultDetail: () => {
        let urlParams = new URL(location.href).searchParams;
        let cnsltSeq = urlParams.get('cnsltSeq');
        let cnsltSn = urlParams.get('cnsltSn');
        let paramMap = { 'cnsltSeq': cnsltSeq, 'cnsltSn': cnsltSn };
        $.sendAjax({
            url: "/consult/selectConsultOperate.api",
            data: paramMap,
            contentType: "application/json",
            success: async (res) => {
                let resData = res.data;


                vm.cnsltData = res.data

                if (resData.canclNtcnArray != null) {
                    vm.cnsltData.canclNtcnArray = resData.canclNtcnArray.split(',')
                } else {
                    vm.cnsltData.canclNtcnArray = []
                }

                vm.cnsltData.cnsltWeekArray = resData.cnsltWeekArray.split(',')
                vm.cnsltData.rcritBeginDt = resData.rcritBeginDt.substring(0, 10);			//모집기간 시작일자
                vm.cnsltData.rcritEndDt = resData.rcritEndDt.substring(0, 10);				//모집기간 종료일자	
                vm.cnsltData.startPeriodHour = resData.rcritBeginHour
                vm.cnsltData.startPeriodMinute = resData.rcritBeginMinutes
                vm.cnsltData.endPeriodHour = resData.rcritEndHour
                vm.cnsltData.endPeriodMinute = resData.rcritEndMinutes


                $.sendAjax({
                    url: "/consult/selectConsultTimeList.api",
                    data: paramMap,
                    contentType: "application/json",
                    success: async (cnsltFxRes) => {
                        //   await event.setCnsltFx(cnsltFxRes.data, paramMap);


                    },
                    error: function (e) {
                        $.alert(e.responseJSON.message);
                    },
                });
            }
            , error: function (e) {
                $.alert(e.responseJSON.message);
            },
        });
    }
    , validation: () => {
        if (vm.cnsltData.canclCode === "") {
            $.alert("취소 사유를 입력해주세요.");
            return false;
        }
        return true;
    }
};





$(document).ready(() => {
    vueInit();
    event.init();
    event.getConsultDetail();
});




