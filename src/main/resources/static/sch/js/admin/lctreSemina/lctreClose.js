let vueData = {
    lctreData : {
        lctreKndCode: "",			//강의 종류
        lctreKndCodeNm: "",         //강의 종류명
        specialLctreYn: false,		//특강여부
        specialLctreYnStr: "",		//특강여부 리터럴값
        lctreNm: "",				//강의명
        profsrName: "",				//교수명
        profsrUserSeq: "",	        //교수이용자일련
        lctreSeq:"",                //강의일련
        alarmArray: ["P", "A"],             //알림 안내 배열
        clctreCode: "",             //폐강 사유
        clctreDc: "",               //폐강 설명
        lctreSttusSe: "D",          //강의상태구분(R:미정,C:확정,D:폐강)
        smtmIntrprNm: "",           //동시통역이름
    },
    lctreClctreCodeList: [],		//commonCode에서 받아온 폐강 사유 리스트
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
                    {upperCmmnCode:"CLOSE_REASON"},
                    {upperCmmnCode:"LCTRE_KND_CODE"},
                ];

                for(let i=0; i<paramList.length; i++) {
                    $.sendAjax({
                        url: "/cmmn/selectCmmnCode.api",
                        data: paramList[i],
                        contentType: "application/json",
                        success: (res) => {

                            switch(paramList[i].upperCmmnCode){
                                case 'CLOSE_REASON': vm.lctreClctreCodeList = res.data; break;
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
            vm.lctreData.clctreCode = "";
            vm.lctreData.clctreDc = "";
            vm.lctreData.alarmArray = ["P", "A"];
        });
        $(document).on("click", "#btnSave", function (e) {
            if(!event.validation()){
                return false;
            }

            $.sendAjax({
                url: "/lctreController/updateLctre.api",
                data: vm.lctreData,
                contentType: "application/json",
                success: (res) => {
                    $.alert("폐강 처리 되었습니다. 강의 개설 목록으로 이동합니다.", () => {
                        location.href = "lctreList.html";
                    });
                },
                error: function (e) {
                    $.alert(e.responseJSON.message);
                },
            });
        });
    },
    getLectureDetail : () =>{
        let urlParams = new URL(location.href).searchParams;
        let lctreSeq = urlParams.get('lctreSeq');
        let paramMap = {'lctreSeq': lctreSeq};
        $.sendAjax({
            url: "/lctreController/selectLctre.api",
            data: paramMap,
            contentType: "application/json",
            success: async (res) => {
                let resData = res.data;
                await event.setLctre(resData);
            }
            ,error: function (e) {
                $.alert(e.responseJSON.message);
            }
        });
    },
    setLctre: (resData) => {
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

        vm.lctreData.profsrUserSeq = resData.profsrUserSeq; 	                //교수이용자일련
        vm.lctreData.profsrName = resData.userNm;                               //교수명
        vm.lctreData.lctreSeq = resData.lctreSeq;                               //강의일련
        vm.lctreData.smtmIntrprNm = resData.smtmIntrprNm;                       //강의일련
    },
    validation: () => {
        if(vm.lctreData.clctreCode === "") {
            $.alert("폐강 사유를 입력해주세요.");
            return false;
        }
        return true;
    }
}

$(document).ready( () => {
    vueInit();
    event.init();
    vm.selectCmmnCode();
    event.getLectureDetail();
});
