let vueData = {
    seminaData: {
        seminaSeq: "",              //세미나일련
        seminaNm: "",               //세미나명
        seminaKndCode: "",          //세미나종류코드
        seminaKndCodeNm: "",        //세미나종류코드이름
        useLangCd: "",             //사용언어
        useLangCdNm: "",           //사용언어이름
        progrsUserSeq: "",          //진행이용자일련
        progrsUserNm: "",           //진행이용자이름
        progrsUserEmail: "",        //진행이용자이메일
        smtmIntrprSeq: "",          //동시통역일련
        smtmIntrprNm: "",           //동시통역이름
        smtmIntrprEmail: "",        //동시통역이메일
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
        seminaSttusSe: "",          //세미나상태구분 (R:미정,C:확정,D:취소)
        seminaKeywordArray: [],		//검색 키워드
        seminaUserCnt: "",          //현 세미나 신청자
    },
    authorList: [],					//commonCode에서 받아온 회원 종류 리스트
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
                    {upperCmmnCode: "AUTHOR", cmmnCodeEtc: "LCTRE_USER"},
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
        $(document).on("click", "#btnList", function (e) {
            location.href = "seminaList.html";
        });
        $(document).on("click", "#btnConfirm", function (e) {
            let urlParams = new URL(location.href).searchParams;
            let seminaSeq = urlParams.get('seminaSeq');
            let paramMap =
                {
                    'seminaSeq':
                    seminaSeq,
                    'seminaSttusSe':
                        'C'
                };
            $.sendAjax({
                url: "/seminaController/updateSeminaForConfirm.api",
                data: paramMap,
                contentType: "application/json",
                success: (res) => {
                    event.getSeminaDetail();
                },
                error: function (e) {
                    $.alert(e.responseJSON.message);
                },
            });
        });
        $(document).on("click", "#btnUpdate", function (e) {
            let urlParams = new URL(location.href).searchParams;
            let seminaSeq = urlParams.get('seminaSeq');
            location.href = "seminaUpdt.html?seminaSeq=" + seminaSeq;
        });
        $(document).on("click", "#btnCancelSemina", function (e) {
            let urlParams = new URL(location.href).searchParams;
            let seminaSeq = urlParams.get('seminaSeq');
            location.href = "seminaCancel.html?seminaSeq=" + seminaSeq;
        });
        $(document).on("click", "#btnDeleteSemina", function (e) {
            let urlParams = new URL(location.href).searchParams;
            let seminaSeq = urlParams.get('seminaSeq');
            let paramMap =
                {
                    'seminaSeq':
                    seminaSeq
                };
            $.confirm("정말 삭제하시겠습니까? 자료가 모두 사라집니다.", () => {
                $.sendAjax({
                    url: "/seminaController/deleteSemina.api",
                    data: paramMap,
                    contentType: "application/json",
                    success: (res) => {
                        $.alert("입력한 내용이 모두 삭제되었습니다.", () => {
                            location.href = "seminaList.html";
                        });
                    },
                    error: function (e) {
                        $.alert(e.responseJSON.message);
                    },
                });
            });
        });
    },
    getSeminaDetail: () => {
        let urlParams = new URL(location.href).searchParams;
        let seminaSeq = urlParams.get('seminaSeq');
        let target = urlParams.get('target');
        let paramMap = {'seminaSeq': seminaSeq};
        $.sendAjax({
            url: "/seminaController/selectSemina.api",
            data: paramMap,
            contentType: "application/json",
            success: async (res) => {
                let resData = res.data;
                await event.setSemina(resData);
                if (target === 'register') {
                    $(window).scrollTop(600);
                }
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
        vm.seminaData.smtmIntrprSeq = resData.smtmIntrprSeq;                //동시통역일련
        vm.seminaData.smtmIntrprNm = resData.smtmIntrprNm;                  //동시통역이름
        vm.seminaData.smtmIntrprEmail = resData.smtmIntrprEmail;            //동시통역이메일
        vm.seminaData.lctrUserSeqArray = resData.lctrUserSeqArray.split(",");          //강연이용자일련배열
        event.userSearchModalDefault();
        vm.seminaData.seminaStyleSe = resData.seminaStyleSe;                //세미나스타일구분
        vm.seminaData.seminaDe = util.date.addDateDash(resData.seminaDe);                          //세미나일자
        vm.seminaData.startHour = resData.seminaBeginTime.substring(0, 2);  //세미나 시작 시간
        vm.seminaData.startMinute = resData.seminaBeginTime.substring(2, 4);//세미나 시작 분
        vm.seminaData.endHour = resData.seminaEndTime.substring(0, 2);      //세미나 종료 시간
        vm.seminaData.endMinute = resData.seminaEndTime.substring(2, 4);    //세미나 종료 분
        vm.seminaData.seminaPlaceNm = resData.seminaPlaceNm;                //세미나장소명

        vm.seminaData.startPeriodDt = resData.rcritBeginDt.substring(0, 10);		//모집기간 시작일자
        vm.seminaData.endPeriodDt = resData.rcritEndDt.substring(0, 10);		//모집기간 종료일자
        vm.seminaData.startPeriodHour = resData.rcritBeginDt.substring(11, 13);	//모집기간 시작시간
        vm.seminaData.startPeriodMinute = resData.rcritBeginDt.substring(14, 16);//모집기간 시작분
        vm.seminaData.endPeriodHour = resData.rcritEndDt.substring(11, 13);		//모집기간 종료시간
        vm.seminaData.endPeriodMinute = resData.rcritEndDt.substring(14, 16);    //모집기간 종료분

        vm.seminaData.atnlcAuthorArray = resData.atnlcAuthorArray;      //수강권한배열 -> 회원 종류
        vm.seminaData.atnlcCo = resData.atnlcCo;                        //수강수
        vm.seminaData.seminaImageCn = resData.seminaImageCn;            //세미나 현수막 이미지
        vm.seminaData.seminaDc = resData.seminaDc;                      //세미나설명
        vm.seminaData.seminaCn = resData.seminaCn;                      //세미나내용
        vm.seminaData.seminaSttusSe = resData.seminaSttusSe;            //세미나상태구분 (R:미정,C:확정,D:취소)
        vm.seminaData.seminaUserCnt = resData.seminaUserCnt;            //세매나 신청자 수
        vm.seminaData.seminaKeywordArray = [];							//검색 키워드
        let tempUserKndCodeArray = resData.atnlcAuthorArray.split(","); 	//회원 종류
        $.each(tempUserKndCodeArray, function (index, kndCodeItem) {
            $.each(vm.authorList, function (index, authorItem) {
                if (authorItem.cmmnCode === kndCodeItem) {
                    vm.seminaData.userKndCodeArrayStr += authorItem.cmmnCodeNm;
                }
            });
            if (index !== tempUserKndCodeArray.length - 1) {
                vm.seminaData.userKndCodeArrayStr += " / "
            }
        });
        let tempKeywordArray = [];
        if (resData.seminaKwrd.indexOf(",") != -1) {
            tempKeywordArray = resData.seminaKwrd.split(",");
        } else {
            tempKeywordArray.push(resData.seminaKwrd);
        }
        for (let i = 0; i < tempKeywordArray.length; i++) {
            let keyword = tempKeywordArray[i];

            let keywordTag = "<div class='keyword dp_center side-by-side'>" + keyword + "</div>";
            $("#keywordContainer").append(keywordTag);

            vm.seminaData.seminaKeywordArray.push(keyword);
        }
    },
    userSearchModalDefault() {
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
}

$(document).ready(() => {
    vueInit();
    event.init();
    vm.selectCmmnCode();
    event.getSeminaDetail();
});
