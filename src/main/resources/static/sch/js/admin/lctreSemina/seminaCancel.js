let vueData = {
    seminaData: {
        seminaSeq: "",              //세미나일련
        seminaNm: "",               //세미나명
        seminaKndCode: "",          //세미나종류코드
        seminaKndCodeNm: "",        //세미나종류코드이름
        useLangCd : "",             //사용언어
        useLangCdNm : "",           //사용언어이름
        progrsUserSeq : "",         //진행이용자일련
        progrsUserNm: "",           //진행이용자이름
        progrsUserEmail: "",        //진행이용자이메일
        lctrUserSeqArray: [],       //강연이용자일련배열
        seminaStyleSe: "",          //세미나스타일구분
        seminaDe: "",               //세미나일자

        startHour: "",				//세미나 시작 시간
        startMinute: "",			//세미나 시작 분
        endHour: "",				//세미나 종료 시간
        endMinute: "",				//세미나 종료 분

        seminaPlaceNm: "",          //세미나장소명
        startPeriodDt: "",			//모집기간 시작일자
        endPeriodDt: "",			//모집기간 종료일자
        startPeriodHour: "",		//모집기간 시작시간
        startPeriodMinute: "",		//모집기간 시작분
        endPeriodHour: "",			//모집기간 종료시간
        endPeriodMinute: "",		//모집기간 종료분

        atnlcAuthorArray: "",       //수강권한배열 -> 회원 종류
        userKndCodeArrayStr: "",
        atnlcCo: "",                //수강수
        seminaImageCn: "",          //세미나 현수막 이미지
        seminaDc: "",               //세미나설명
        seminaCn: "",               //세미나내용
        seminaSttusSe: "D",          //세미나상태구분 (R:미정,C:확정,D:취소)
        seminaKeywordArray: [],		//검색 키워드
        canclCode: "",             //취소코드
        canclDc: "",               //취소설명
        canclNtcnArray: ["P", "A"],        //취소알림배열
    },
    canclCodeList: [],					//commonCode에서 받아온 취소코드 리스트
    userList: [],
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
                    {upperCmmnCode:"SEMINA_CANCEL_REASON"},
                ];

                for(let i=0; i<paramList.length; i++) {
                    $.sendAjax({
                        url: "/cmmn/selectCmmnCode.api",
                        data: paramList[i],
                        contentType: "application/json",
                        success: (res) => {
                            switch(paramList[i].upperCmmnCode){
                                case 'SEMINA_CANCEL_REASON': vm.canclCodeList = res.data; break;
                                    break;
                            }
                        },
                        error: function (e) {
                            $.alert(e.responseJSON.message);
                        },
                    });
                }
            },
        },
    });
    vm = app.mount('#content');
}

let event = {
    init: () => {
        $(document).on("click", "#btnCancel", function (e) {
            vm.seminaData.canclCode = "";
            vm.seminaData.canclDc = "";
            vm.seminaData.canclNtcnArray = ["P", "A"];
        });
        $(document).on("click", "#btnSave", function (e) {
            if(!event.validation()){
                return false;
            }

            $.sendAjax({
                url: "/seminaController/updateSeminaForConfirm.api",
                data: vm.seminaData,
                contentType: "application/json",
                success: (res) => {
                    $.alert("세미나 취소 처리 되었습니다. 세미나 개설 목록으로 이동합니다.", () => {
                        location.href = "seminaList.html";
                    });
                },
                error: function (e) {
                    $.alert(e.responseJSON.message);
                },
            });
        });
    },
    getSeminaDetail : () => {
        let urlParams = new URL(location.href).searchParams;
        let seminaSeq = urlParams.get('seminaSeq');
        let paramMap = {'seminaSeq': seminaSeq};
        $.sendAjax({
            url: "/seminaController/selectSemina.api",
            data: paramMap,
            contentType: "application/json",
            success: async (res) => {
                let resData = res.data;
                await event.setSemina(resData);
            },
            error: function (e) {
                $.alert(e.responseJSON.message);
            },
        });
    },
    setSemina: (resData) => {
        vm.seminaData.seminaSeq = resData.seminaSeq;                        //세미나일련
        vm.seminaData.seminaNm = resData.seminaNm;                          //세미나명
        vm.seminaData.seminaKndCode = resData.seminaKndCode;                //세미나종류코드
        vm.seminaData.seminaKndCodeNm = resData.seminaKndCodeNm;            //세미나종류코드이름
        vm.seminaData.useLangCd = resData.useLangCd;                        //세미나사용언어
        vm.seminaData.useLangCdNm = resData.useLangCdNm;                    //세미나사용언어이름
        vm.seminaData.progrsUserSeq = resData.progrsUserSeq;                //진행이용자일련
        vm.seminaData.progrsUserNm = resData.progrsUserNm;                  //진행이용자이름
        vm.seminaData.progrsUserEmail = resData.progrsUserEmail;            //진행이용자이메일
        vm.seminaData.lctrUserSeqArray = resData.lctrUserSeqArray.split(",");          //강연이용자일련배열
        event.userSearchModalDefault();
        vm.seminaData.seminaStyleSe = resData.seminaStyleSe;                //세미나스타일구분
        vm.seminaData.seminaDe = util.date.addDateDash(resData.seminaDe);                          //세미나일자
        vm.seminaData.startHour = resData.seminaBeginTime.substring(0, 2);  //세미나 시작 시간
        vm.seminaData.startMinute = resData.seminaBeginTime.substring(2, 4);//세미나 시작 분
        vm.seminaData.endHour = resData.seminaEndTime.substring(0, 2);      //세미나 종료 시간
        vm.seminaData.endMinute = resData.seminaEndTime.substring(2, 4);    //세미나 종료 분
        vm.seminaData.seminaPlaceNm = resData.seminaPlaceNm;                //세미나장소명

        vm.seminaData.startPeriodDt = resData.rcritBeginDt.substring(0,10);		//모집기간 시작일자
        vm.seminaData.endPeriodDt =  resData.rcritEndDt.substring(0,10);		//모집기간 종료일자
        vm.seminaData.startPeriodHour = resData.rcritBeginDt.substring(11,13);	//모집기간 시작시간
        vm.seminaData.startPeriodMinute = resData.rcritBeginDt.substring(14,16);//모집기간 시작분
        vm.seminaData.endPeriodHour = resData.rcritEndDt.substring(11,13);		//모집기간 종료시간
        vm.seminaData.endPeriodMinute = resData.rcritEndDt.substring(14,16);    //모집기간 종료분

        // vm.seminaData.atnlcAuthorArray = resData.atnlcAuthorArray;      //수강권한배열 -> 회원 종류
        vm.seminaData.atnlcCo = resData.atnlcCo;                        //수강수
        vm.seminaData.seminaImageCn = resData.seminaImageCn;            //세미나 현수막 이미지
        vm.seminaData.seminaDc = resData.seminaDc;                      //세미나설명
        vm.seminaData.seminaCn = resData.seminaCn;                      //세미나내용

        vm.seminaData.seminaKeywordArray = [];							//검색 키워드

        let tempKeywordArray = [];
        if(resData.seminaKwrd.indexOf(",") != -1) {
            tempKeywordArray = resData.seminaKwrd.split(",");
        } else {
            tempKeywordArray.push(resData.seminaKwrd);
        }
        for(let i=0; i<tempKeywordArray.length; i++) {
            let keyword = tempKeywordArray[i];

            let keywordTag = "<div class='keyword dp_center side-by-side'>" + keyword + "</div>";
            $("#keywordContainer").append(keywordTag);

            vm.seminaData.seminaKeywordArray.push(keyword);
        }
    },
    userSearchModalDefault()  {
        let paramMap = {};
        $.sendAjax({
            url: "/user/userInfoList.api",
            data: paramMap,
            contentType: "application/json",
            success: (res) => {
                vm.userList = res.data;
                event.makeLctrUSerTag();
            },
            error: function (e) {
                $.alert(e.responseJSON.message);
            },
        });
    },
    makeLctrUSerTag() {
        let userInfoTag = "";
        for (let i = 0; i < vm.seminaData.lctrUserSeqArray.length; i++) {
            for (let j = 0; j < vm.userList.length; j++) {
                if (vm.seminaData.lctrUserSeqArray[i] === vm.userList[j].userSeq) {
                    userInfoTag = "<div id='" + vm.userList[j].userSeq + "' class='dp_center side-by-side lctrUser'>" + vm.userList[j].userNm + "&nbsp;&nbsp;&nbsp;" + vm.userList[j].userEmail + "</div>";
                    $("#lctrUserContainer").append(userInfoTag);
                    break;
                }
            }
        }
    },
    validation: () => {
        if(vm.seminaData.canclCode === "") {
            $.alert("취소 사유를 입력해주세요.");
            return false;
        }
        return true;
    }
}

$(document).ready( () => {
    vueInit();
    event.init();
    vm.selectCmmnCode();
    event.getSeminaDetail();
});
