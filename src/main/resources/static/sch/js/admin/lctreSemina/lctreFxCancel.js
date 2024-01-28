let vueData = {
    lctreData : {
        lctreKndCode: "",			//강의 종류
        lctreKndCodeNm: "",         //강의 종류명
        specialLctreYn: false,		//특강여부
        specialLctreYnStr: "",		//특강여부 리터럴값
        lctreNm: "",				//강의명
        profsrName: "",				//교수명
        smtmIntrprNm: "",		    //동시통역명
        profsrUserSeq: "",          //교수이용자일련
        lctreSeq: "",               //강의일련
        lctreSj: "",                //강의제목
        lctreDtls: "",              //강의내역
        lctreSn: "",                //강좌일련
        rlctreCode: "",             //휴강코드
        rlctreDc: "",               //휴강설명
        rlctreNtcnArray: ["P", "A"],//알림 안내 배열
        useAt: "N",                  //사용여부('N':휴강)
    },
    lctreRlctreCodeList: [],		//commonCode에서 받아온 휴강 사유 리스트
    lctreKndCodeList: [],			//commonCode에서 받아온 강의 종류 리스트
}

let vm;

let vueInit = () => {
    const app = Vue.createApp({
        data() {
            return vueData;
        },
        methods: {
            selectCmmnCode: () => {
                let paramList = [
                    {upperCmmnCode:"LCTRE_CANCEL_REASON"},
                    {upperCmmnCode:"LCTRE_KND_CODE"},
                ];

                for(let i=0; i<paramList.length; i++) {
                    $.sendAjax({
                        url: "/cmmn/selectCmmnCode.api",
                        data: paramList[i],
                        contentType: "application/json",
                        success: (res) => {

                            switch(paramList[i].upperCmmnCode){
                                case 'LCTRE_CANCEL_REASON': vm.lctreRlctreCodeList = res.data; break;
                                case 'LCTRE_KND_CODE': vm.lctreKndCodeList = res.data; break;
                            }
                        },
                        error: function (e) {
                            $.alert(e.responseJSON.message);
                        },
                    });
                }
            },
        },
    })
    vm = app.mount('#content');
}

let event = {
    init: () => {
        $(document).on("click", "#btnCancel", function (e) {
            vm.lctreData.rlctreCode = "";
            vm.lctreData.rlctreDc = "";
            vm.lctreData.rlctreNtcnArray = ["P", "A"];
        });
        $(document).on("click", "#btnSave", function (e) {
            if(!event.validation()){
                return false;
            }

            $.sendAjax({
                url: "/lctreController/updateLctreFx.api",
                data: vm.lctreData,
                contentType: "application/json",
                success: (res) => {
                    $.alert("휴강 처리 되었습니다. 강의 운영 목록으로 이동합니다.", () => {
                        location.href = "lctreOperateList.html";
                    });
                },
                error: function (e) {
                    $.alert(e.responseJSON.message);
                },
            });
        });
    },
    getLectureFxDetail : () => {
        let urlParams = new URL(location.href).searchParams;
        let lctreSeq = urlParams.get('lctreSeq');
        let lctreSn = urlParams.get('lctreSn');
        let paramMap = {'lctreSeq': lctreSeq, 'lctreSn': lctreSn};
        $.sendAjax({
            url: "/lctreController/selectLctreFx.api",
            data: paramMap,
            contentType: "application/json",
            success: async (res) => {
                let resData = res.data;
                await event.setLctreFx(resData);
            }
            ,error: function (e) {
                $.alert(e.responseJSON.message);
            }
        });
    },
    setLctreFx: (resData) => {
        vm.lctreData.lctreKndCode = resData.lctreKndCode;							//강의 종류
        $.each(vm.lctreKndCodeList, function (index, lctreKndCodeItem) {
            if(lctreKndCodeItem.cmmnCode === vm.lctreData.lctreKndCode) {
                vm.lctreData.lctreKndCodeNm += lctreKndCodeItem.cmmnCodeNm;
            }
        });

        let tempSpecialLctreYnStr = resData.speclLctreAt;							//특강여부
        if(tempSpecialLctreYnStr === 'Y') {
            vm.lctreData.specialLctreYn = true;
        }else if(tempSpecialLctreYnStr === 'N') {
            vm.lctreData.specialLctreYn = false;
        }

        vm.lctreData.lctreNm = resData.lctreNm;									//강의명

        vm.lctreData.profsrUserSeq = resData.profsrUserSeq;                     //교수이용자일련
        vm.lctreData.profsrName = resData.userNm;                               //교수명
        vm.lctreData.smtmIntrprNm = resData.smtmIntrprNm;                       //동시통역명
        vm.lctreData.lctreSeq = resData.lctreSeq;                               //강의일련
        vm.lctreData.lctreSn = resData.lctreSn;                                 //강좌일련
        vm.lctreData.lctreSj = resData.lctreSj;                                 //강의제목
        vm.lctreData.lctreDtls = resData.lctreDtls;                             //강의내역
    },
    validation: () => {
        let temp = vm.lctreData.rlctreCode;
        if(vm.lctreData.rlctreCode === "") {
            $.alert("휴강 사유를 입력해주세요.");
            return false;
        }
        return true;
    }
}

$(document).ready( () => {
    vueInit();
    event.init();
    vm.selectCmmnCode();
    event.getLectureFxDetail();
});
