let vueData = {
    lctreData: {
        startHour: "",				//강의 시작 시간
        startMinute: "",			//강의 시작 분
        endHour: "",				//강의 종료 시간
        endMinute: "",				//강의 종료 분
        startDt: "",				//강의 기간 시작일자
        endDt: "",					//강의 기간 종료일자
        startPeriodDt: "",			//모집기간 시작일자
        endPeriodDt: "",			//모집기간 종료일자
        startPeriodHour: "",		//모집기간 시작시간
        startPeriodMinute: "",		//모집기간 시작분
        endPeriodHour: "",			//모집기간 종료시간
        endPeriodMinute: "",		//모집기간 종료분

        lctreKndCode: "",			//강의 종류
        lctreKndCodeNm: "",
        specialLctreYn: false,		//특강여부
        specialLctreYnStr: "",		//특강여부 리터럴값
        lctreNm: "",				//강의명
        profsrName: "",				//교수명
        profsrUserSeq: "USER_00000062",	//교수이용자일련 -> 회원검색 팝업 생기면 이 부분 수정하기
        studentMax: 300, 			//최대 수강생 수
        lctreMax: 100, 				//최대 강좌수 -> 최대 100개까지 등록 가능
        lctreNum: [],				//전체 강좌 수 -> length로 카운팅
        lctreDayArray: [],			//강의요일
        lctrePlace: "",				//강의장소
        userKndCodeArray: [], 		//회원 종류
        userKndCodeArrayStr: "",    //회원 종류 리터럴
        studentCount: "", 			//수강생 수
        lctreFile: "",				//강의 대표 이미지
        lctreDescription: "",		//강의설명
        lctreDetailSubjectArray: [],		//강좌 디테일 제목 배열
        lctreDetailOutlineArray: [],		//강좌 디테일 개요 배열
        lctreDetailStartHourArray: [],//강좌 시작 시간 배열
        lctreDetailStartMinuteArray: [],//강좌 시작 분 배열
        lctreDetailEndHourArray: [],//강좌 종료 시간 배열
        lctreDetailEndMinuteArray: [],//강좌 종료 분 배열

        lctreKeywordArray: [],		//검색 키워드
        lctreCountArray: [],		//강좌일정
        lctreSttusArray: [],        //강좌상태

        lctreUserCnt: 0,             //현 수강신청자 명수
        lctreUserArray: [],         //수강신청자 배열
        lctreStatus: "",            //모집 상태
        lctreSttusSe: "",            //강의 상태구분
        lctreSeq: "",                //강의일련
        smtmIntrprNm: "",            //동시통역이름
    },
    authorList: [],					//commonCode에서 받아온 회원 종류 리스트
    lctreKndCodeList: [],			//commonCode에서 받아온 강의 종류 리스트
    preview: "",
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
                    {upperCmmnCode: "LCTRE_KND_CODE"}
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
                                case 'LCTRE_KND_CODE':
                                    vm.lctreKndCodeList = res.data;
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
    })
    vm = app.mount('#content');
}

let event = {
    init: () => {
        $(document).on("click", "#btnList", function (e) {
            location.href = "lctreList.html";
        });
        $(document).on("click", "#btnConfirm", function (e) {
            let urlParams = new URL(location.href).searchParams;
            let lctreSeq = urlParams.get('lctreSeq');
            let paramMap =
                {
                    'lctreSeq':
                    lctreSeq,
                    'lctreSttusSe':
                        'C'
                };
            $.sendAjax({
                url: "/lctreController/updateLctre.api",
                data: paramMap,
                contentType: "application/json",
                success: (res) => {
                    event.getLctreDetail();
                },
                error: function (e) {
                    $.alert(e.responseJSON.message);
                },
            });
        });
        $(document).on("click", "#btnFileDownload", function (e) {
            let lctreUserArray = vm.lctreData.lctreUserArray;
            let paramMap =
                {
                    'lctreUserArray':
                    lctreUserArray
                };
            $.sendAjax({
                url: "/lctreController/getCurrentUserListExcel.api",
                data: paramMap,
                contentType: "application/json",
                xhrFields: {
                    'responseType': 'blob'
                },
                success: (res, status, xhr) => {
                    let filename = '현재 수강신청자 현황.xlsx';
                    let filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                    let disposition = xhr.getResponseHeader('Content-Disposition');
                    let matches = filenameRegex.exec(disposition);
                    if (matches != null && matches[1]) {
                        filename = matches[1].replace(/['"]/g, '');
                    }

                    let link = document.createElement('a');
                    link.href = URL.createObjectURL(res);
                    link.download = decodeURI(filename);
                    link.click();
                },
                error: function (e) {
                    $.alert(e.responseJSON.message);
                },
            });
        });
        $(document).on("click", "#btnUpdate", function (e) {
            let urlParams = new URL(location.href).searchParams;
            let lctreSeq = urlParams.get('lctreSeq');
            location.href = "lctreUpdt.html?lctreSeq=" + lctreSeq;
        });
        $(document).on("click", "#btnCloseLctre", function (e) {
            let urlParams = new URL(location.href).searchParams;
            let lctreSeq = urlParams.get('lctreSeq');
            location.href = "lctreClose.html?lctreSeq=" + lctreSeq;
        });
        $(document).on("click", "#btnDeleteLctre", function (e) {
            let urlParams = new URL(location.href).searchParams;
            let lctreSeq = urlParams.get('lctreSeq');
            let paramMap =
                {
                    'lctreSeq':
                    lctreSeq
                };
            $.confirm("정말 삭제하시겠습니까? 자료가 모두 사라집니다.", () => {
                $.sendAjax({
                    url: "/lctreController/deleteLctre.api",
                    data: paramMap,
                    contentType: "application/json",
                    success: (res) => {
                        $.alert("입력한 내용이 모두 삭제되었습니다.", () => {
                            location.href = "lctreList.html";
                        });
                    },
                    error: function (e) {
                        $.alert(e.responseJSON.message);
                    },
                });
            });
        });
    },
    getLctreDetail: () => {
        let urlParams = new URL(location.href).searchParams;
        let lctreSeq = urlParams.get('lctreSeq');
        let target = urlParams.get('target');
        let paramMap = {'lctreSeq': lctreSeq};
        $.sendAjax({
            url: "/lctreController/selectLctre.api",
            data: paramMap,
            contentType: "application/json",
            success: async (res) => {
                let resData = res.data;
                await event.setLctre(resData);
                $.sendAjax({
                    url: "/lctreController/selectLctrePlanList.api",
                    data: paramMap,
                    contentType: "application/json",
                    success: async (lctreFxRes) => {
                        await event.setLctreFx(lctreFxRes.data);
                    },
                    error: function (e) {
                        $.alert(e.responseJSON.message);
                    },
                });
                $.sendAjax({
                    url: "/lctreController/selectLctreUserList.api",
                    data: paramMap,
                    contentType: "application/json",
                    success: async (lctreUserListRes) => {
                        await event.setLctreUser(lctreUserListRes.data);
                        if (target === 'register') {
                            let bottomPosition = $("#container").prop("clientHeight");
                            $(window).scrollTop(bottomPosition);
                        }
                    },
                    error: function (e) {
                        $.alert(e.responseJSON.message);
                    },
                });
            },
            error: function (e) {
                $.alert(e.responseJSON.message);
            },
        });
    },
    setLctre: (resData) => {
        vm.lctreData.startHour = resData.lctreBeginTime.substring(0, 2);			//강의 시작 시간
        vm.lctreData.startMinute = resData.lctreBeginTime.substring(2, 4);			//강의 시작 분
        vm.lctreData.endHour = resData.lctreEndTime.substr(0, 2);					//강의 종료 시간
        vm.lctreData.endMinute = resData.lctreEndTime.substr(2, 2);					//강의 종료 분
        vm.lctreData.startDt = util.date.addDateDash(resData.lctreBeginDe);			//강의 기간 시작일자
        vm.lctreData.endDt = util.date.addDateDash(resData.lctreEndDe);				//강의 기간 종료일자
        vm.lctreData.startPeriodDt = resData.rcritBeginDt.substring(0, 10);			//모집기간 시작일자
        vm.lctreData.endPeriodDt = resData.rcritEndDt.substring(0, 10);				//모집기간 종료일자
        vm.lctreData.startPeriodHour = resData.rcritBeginDt.substring(11, 13);		//모집기간 시작시간
        vm.lctreData.startPeriodMinute = resData.rcritBeginDt.substring(14, 16);		//모집기간 시작분
        vm.lctreData.endPeriodHour = resData.rcritEndDt.substring(11, 13);			//모집기간 종료시간
        vm.lctreData.endPeriodMinute = resData.rcritEndDt.substring(14, 16);		    //모집기간 종료분

        vm.lctreData.lctreKndCode = resData.lctreKndCode;							//강의 종류
        $.each(vm.lctreKndCodeList, function (index, lctreKndCodeItem) {
            if (lctreKndCodeItem.cmmnCode === vm.lctreData.lctreKndCode) {
                vm.lctreData.lctreKndCodeNm += lctreKndCodeItem.cmmnCodeNm;
            }
        });

        let tempSpecialLctreYnStr = resData.speclLctreAt;							//특강여부
        if (tempSpecialLctreYnStr === 'Y') {
            vm.lctreData.specialLctreYn = true;
        } else if (tempSpecialLctreYnStr === 'N') {
            vm.lctreData.specialLctreYn = false;
        }
        vm.lctreData.smtmIntrprNm = resData.smtmIntrprNm;               //동시통역이름
        vm.lctreData.lctreNm = resData.lctreNm;									//강의명
        vm.lctreData.profsrUserSeq = resData.profsrUserSeq;		                //교수이용자일련
        vm.lctreData.profsrName = resData.userNm;                               //교수명
        vm.lctreData.lctreNum.length = resData.detailLctreCo;				    //전체 강좌 수 -> length로 카운팅
        vm.lctreData.lctreDayArray = [];
        let tempLctreWeekArray = resData.lctreWeekArray.split(",");			//강의요일
        for (let i = 0; i < tempLctreWeekArray.length; i++) {
            let dayValue = tempLctreWeekArray[i];
            vm.lctreData.lctreDayArray.push(dayValue);
            $("input:checkbox[value=dayValue]").prop("checked", true);
        }
        vm.lctreData.lctrePlace = resData.lctrePlaceNm;								//강의장소
        let tempUserKndCodeArray = resData.atnlcAuthorArray.split(","); 	//회원 종류
        $.each(tempUserKndCodeArray, function (index, kndCodeItem) {
            $.each(vm.authorList, function (index, authorItem) {
                if (authorItem.cmmnCode === kndCodeItem) {
                    vm.lctreData.userKndCodeArrayStr += authorItem.cmmnCodeNm;
                }
            });
            if (index !== tempUserKndCodeArray.length - 1) {
                vm.lctreData.userKndCodeArrayStr += " / "
            }
        });

        vm.lctreData.studentCount = resData.atnlcCo; 								//수강생 수
        if (resData.lctreUserCnt !== undefined) {
            vm.lctreData.lctreUserCnt = resData.lctreUserCnt;                       //현 수강신청자 명수
        }
        vm.preview = resData.lctreImageCn;                                          //강의 대표 이미지

        vm.lctreData.lctreDescription = resData.lctreDc;							//강의설명

        vm.lctreData.lctreKeywordArray = [];										//검색 키워드
        let tempKeywordArray = [];
        if (resData.lctreKwrd.indexOf(",") != -1) {
            tempKeywordArray = resData.lctreKwrd.split(",");
        } else {
            tempKeywordArray.push(resData.lctreKwrd);
        }

        for (let i = 0; i < tempKeywordArray.length; i++) {
            let keyword = tempKeywordArray[i];

            let keywordTag = "<div class='keyword dp_center side-by-side'>" + keyword + "</div>";
            $("#keywordContainer").append(keywordTag);

            vm.lctreData.lctreKeywordArray.push(keyword);
        }

        vm.lctreData.lctreStatus = resData.lctreStatus;
        vm.lctreData.lctreSttusSe = resData.lctreSttusSe;
        vm.lctreData.lctreSeq = resData.lctreSeq;
    },
    setLctreFx: (resData) => {
        let today = new Date();

        for (let i = 0; i < resData.length; i++) {
            vm.lctreData.lctreDetailSubjectArray.push(resData[i].lctreSj);
            vm.lctreData.lctreDetailOutlineArray.push(resData[i].lctreDtls);
            vm.lctreData.lctreCountArray.push(util.date.addDateDash(resData[i].lctreDt));
            vm.lctreData.lctreDetailStartHourArray.push(resData[i].lctreBeginTime.substring(0, 2));    //강좌 시작 시간 배열
            vm.lctreData.lctreDetailStartMinuteArray.push(resData[i].lctreBeginTime.substring(2, 4));  //강좌 시작 분 배열
            vm.lctreData.lctreDetailEndHourArray.push(resData[i].lctreEndTime.substring(0, 2));      //강좌 종료 시간 배열
            vm.lctreData.lctreDetailEndMinuteArray.push(resData[i].lctreEndTime.substring(2, 4));    //강좌 종료 분 배열

            let lctreDateStr = util.date.addDateDash(resData[i].lctreDt) + " " + vm.lctreData.endHour + ":" + vm.lctreData.endMinute + ":00";
            let lctreDate = new Date(lctreDateStr);
            let lctreSttusStr = "";

            if (resData[i].useAt === 'N') {
                lctreSttusStr = "휴강";
            } else if (lctreDate < today) {
                lctreSttusStr = "완료";
            } else {
                lctreSttusStr = "진행 예정";
            }

            vm.lctreData.lctreSttusArray.push(lctreSttusStr);
        }
    },
    setLctreUser: (resData) => {
        //참여자 상세 이름(기본정보) 노출
        for (let i = 0; i < resData.length; i++) {
            if (resData[i].userAuthor === 'ST' || resData[i].userAuthor === 'TJ') {
                //순천향대학생, 텐진외대학생의 기본정보는 학번
                vm.lctreData.lctreUserArray.push(resData[i].userNm + "(" + resData[i].userInnb + ")");
            } else if (resData[i].userAuthor === 'FF') {
                //교직원은 사번
                vm.lctreData.lctreUserArray.push(resData[i].userNm + "(" + resData[i].userInnb + ")");
            } else if (resData[i].userAuthor === 'ETA' || resData[i].userAuthor === 'ETB') {
                //기타 수강생 - 중고생, 초등학생은 학교명
                vm.lctreData.lctreUserArray.push(resData[i].userNm + "(" + resData[i].psitnNm + ")");
            } else if (resData[i].userAuthor === 'ETC') {
                vm.lctreData.lctreUserArray.push(resData[i].userNm + "(" + resData[i].psitnNm + ")");
            }
        }
    },
}

$(document).ready(() => {
    vueInit();
    event.init();
    vm.selectCmmnCode();
    event.getLctreDetail();
});
